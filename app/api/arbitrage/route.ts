import { NextRequest, NextResponse } from 'next/server';
import { fetchOddsData, processOddsData } from '@/lib/odds-api';
import { detectArbitrage } from '@/lib/arbitrage';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sportKey = searchParams.get('sport');
    const commenceTimeFrom = searchParams.get('commenceTimeFrom') || undefined;

    if (!sportKey) {
      return NextResponse.json(
        { error: 'Sport key is required' },
        { status: 400 }
      );
    }

    // Fetch odds data
    const events = await fetchOddsData(sportKey, 'us,us2', commenceTimeFrom);
    
    // Process the data
    const oddsData = processOddsData(events, 50);
    
    // Detect arbitrage opportunities
    const opportunities = detectArbitrage(oddsData);

    return NextResponse.json({
      sport: sportKey,
      opportunities,
      count: opportunities.length,
    });
  } catch (error) {
    console.error('Error fetching arbitrage opportunities:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch arbitrage opportunities' },
      { status: 500 }
    );
  }
}

