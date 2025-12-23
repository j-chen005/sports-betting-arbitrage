import { NextRequest, NextResponse } from 'next/server';
import { fetchOddsData, processOddsData } from '@/lib/odds-api';
import { detectArbitrage } from '@/lib/arbitrage';
import { ArbitrageOpportunity } from '@/types/odds';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sports, commenceTimeFrom } = body;

    if (!sports || !Array.isArray(sports)) {
      return NextResponse.json(
        { error: 'Sports array is required' },
        { status: 400 }
      );
    }

    const allOpportunities: (ArbitrageOpportunity & { sport: string })[] = [];

    // Process each sport
    for (const sportKey of sports) {
      try {
        const events = await fetchOddsData(sportKey, 'us,us2', commenceTimeFrom);
        const oddsData = processOddsData(events, 50);
        const opportunities = detectArbitrage(oddsData);

        // Add sport key to each opportunity
        for (const opp of opportunities) {
          allOpportunities.push({ ...opp, sport: sportKey });
        }
      } catch (error) {
        console.error(`Error processing sport ${sportKey}:`, error);
        // Continue with other sports even if one fails
      }
    }

    // Sort by profit percentage (descending)
    allOpportunities.sort((a, b) => b.profitPercentage - a.profitPercentage);

    return NextResponse.json({
      opportunities: allOpportunities,
      count: allOpportunities.length,
    });
  } catch (error) {
    console.error('Error fetching multiple arbitrage opportunities:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch arbitrage opportunities' },
      { status: 500 }
    );
  }
}

