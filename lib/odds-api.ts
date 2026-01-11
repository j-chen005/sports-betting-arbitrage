import { Event, OddsRow, Sport } from '@/types/odds';

const API_KEY = process.env.ODDS_API_KEY || '';
const BASE_URL = 'https://api.the-odds-api.com/v4';

export async function getSports(): Promise<Sport[]> {
  const url = `${BASE_URL}/sports/?apiKey=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to retrieve sports: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchOddsData(
  sportKey: string,
  regions: string = 'us,us2',
  commenceTimeFrom?: string
): Promise<Event[]> {
  const url = `${BASE_URL}/sports/${sportKey}/odds/`;
  
  const params = new URLSearchParams({
    apiKey: API_KEY,
    regions,
    oddsFormat: 'decimal',
  });

  // Format date to YYYY-MM-DDTHH:MM:SSZ (no milliseconds) as required by API
  const formatDateForAPI = (dateString: string): string => {
    // Remove milliseconds if present
    return dateString.replace(/\.\d{3}Z$/, 'Z');
  };

  if (commenceTimeFrom) {
    params.append('commenceTimeFrom', formatDateForAPI(commenceTimeFrom));
  } else {
    // Default to current date
    const now = new Date().toISOString();
    params.append('commenceTimeFrom', formatDateForAPI(now));
  }

  const response = await fetch(`${url}?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch data: ${response.status} ${errorText}`);
  }

  return response.json();
}

export function processOddsData(events: Event[], limit: number = 50): OddsRow[] {
  const data: OddsRow[] = [];

  for (const event of events.slice(0, limit)) {
    for (const bookmaker of event.bookmakers) {
      for (const market of bookmaker.markets) {
        for (const outcome of market.outcomes) {
          data.push({
            match: `${event.home_team} vs ${event.away_team}`,
            commenceTime: event.commence_time,
            bookmaker: bookmaker.title,
            bookmakerKey: bookmaker.key,
            outcome: outcome.name,
            odds: outcome.price,
          });
        }
      }
    }
  }

  return data;
}

