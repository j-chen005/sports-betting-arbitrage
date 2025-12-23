import { ArbitrageOpportunity, OddsRow } from '@/types/odds';

const EXCLUDED_BOOKMAKERS = ['Betfair', 'Fliff', 'Bovada'];
const MAX_ODDS = 800;
const TOTAL_INVESTMENT = 500;

interface ProcessedRow extends OddsRow {
  impliedProbability: number;
}

export function detectArbitrage(oddsData: OddsRow[]): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];

  // Group by match
  const matchGroups = new Map<string, OddsRow[]>();
  for (const row of oddsData) {
    if (!matchGroups.has(row.match)) {
      matchGroups.set(row.match, []);
    }
    matchGroups.get(row.match)!.push(row);
  }

  // Process each match
  for (const [match, rows] of matchGroups) {
    // Filter out excluded bookmakers and high odds
    let filteredRows = rows.filter((row) => {
      if (row.odds > MAX_ODDS) return false;
      const bookmakerLower = row.bookmaker.toLowerCase();
      return !EXCLUDED_BOOKMAKERS.some((excluded) =>
        bookmakerLower.includes(excluded.toLowerCase())
      );
    });

    if (filteredRows.length === 0) continue;

    // Calculate implied probabilities
    const processedRows: ProcessedRow[] = filteredRows.map((row) => ({
      ...row,
      impliedProbability: 1 / row.odds,
    }));

    // Group by outcome and find minimum implied probability for each outcome
    const outcomeGroups = new Map<string, ProcessedRow[]>();
    for (const row of processedRows) {
      if (!outcomeGroups.has(row.outcome)) {
        outcomeGroups.set(row.outcome, []);
      }
      outcomeGroups.get(row.outcome)!.push(row);
    }

    // Find the row with minimum implied probability for each outcome
    const minProbRows: ProcessedRow[] = [];
    for (const [, outcomeRows] of outcomeGroups) {
      const minRow = outcomeRows.reduce((min, current) =>
        current.impliedProbability < min.impliedProbability ? current : min
      );
      minProbRows.push(minRow);
    }

    // Sum the minimum implied probabilities
    const totalMinProb = minProbRows.reduce(
      (sum, row) => sum + row.impliedProbability,
      0
    );

    // Check for arbitrage opportunity
    if (totalMinProb < 1) {
      // Calculate bet amounts
      const bets = minProbRows.map((row) => ({
        outcome: row.outcome,
        bookmaker: row.bookmaker,
        odds: row.odds,
        betAmount: (TOTAL_INVESTMENT * row.impliedProbability) / totalMinProb,
        impliedProbability: row.impliedProbability,
      }));

      // Calculate guaranteed return (minimum of all possible returns)
      const guaranteedReturn = Math.min(
        ...bets.map((bet) => bet.betAmount * bet.odds)
      );
      const profit = guaranteedReturn - TOTAL_INVESTMENT;

      // Get commence time from first row
      const commenceTime = minProbRows[0].commenceTime;

      opportunities.push({
        match,
        commenceTime,
        totalMinProbability: totalMinProb,
        bets,
        guaranteedReturn,
        profit,
        profitPercentage: (profit / TOTAL_INVESTMENT) * 100,
      });
    }
  }

  return opportunities;
}

