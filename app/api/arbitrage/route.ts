import { NextRequest, NextResponse } from 'next/server';
import { fetchOddsData, processOddsData } from '@/lib/odds-api';
import { detectArbitrage } from '@/lib/arbitrage';
import { ArbitrageOpportunity } from '@/types/odds';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sports, commenceTimeFrom, totalInvestment = 500, sportsbooks } = body;

    if (!sports || !Array.isArray(sports) || sports.length === 0) {
      return NextResponse.json(
        { error: 'Sports array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (totalInvestment && (typeof totalInvestment !== 'number' || totalInvestment <= 0)) {
      return NextResponse.json(
        { error: 'Total investment must be a positive number' },
        { status: 400 }
      );
    }

    if (sportsbooks && (!Array.isArray(sportsbooks) || sportsbooks.length === 0)) {
      return NextResponse.json(
        { error: 'Sportsbooks array must not be empty if provided' },
        { status: 400 }
      );
    }

    console.log(`Processing ${sports.length} sports for arbitrage opportunities`);
    if (sportsbooks) {
      console.log(`Filtering by ${sportsbooks.length} sportsbooks:`, sportsbooks);
    }

    const allOpportunities: (ArbitrageOpportunity & { sport: string })[] = [];
    const errors: string[] = [];

    // Process each sport
    for (const sportKey of sports) {
      try {
        console.log(`Fetching odds for sport: ${sportKey}`);
        const events = await fetchOddsData(sportKey, 'us,us2', commenceTimeFrom);
        console.log(`Found ${events.length} events for ${sportKey}`);
        
        if (events.length === 0) {
          console.log(`No events found for ${sportKey}`);
          continue;
        }

        const oddsData = processOddsData(events, 50);
        console.log(`Processed ${oddsData.length} odds rows for ${sportKey}`);
        
        const opportunities = detectArbitrage(oddsData, totalInvestment, sportsbooks);
        console.log(`Found ${opportunities.length} arbitrage opportunities for ${sportKey}`);

        // Add sport key to each opportunity
        for (const opp of opportunities) {
          allOpportunities.push({ ...opp, sport: sportKey });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing sport ${sportKey}:`, errorMessage);
        errors.push(`${sportKey}: ${errorMessage}`);
        // Continue with other sports even if one fails
      }
    }

    // Sort by profit percentage (descending)
    allOpportunities.sort((a, b) => b.profitPercentage - a.profitPercentage);

    console.log(`Total opportunities found: ${allOpportunities.length}`);

    return NextResponse.json({
      opportunities: allOpportunities,
      count: allOpportunities.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error fetching multiple arbitrage opportunities:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch arbitrage opportunities' },
      { status: 500 }
    );
  }
}

