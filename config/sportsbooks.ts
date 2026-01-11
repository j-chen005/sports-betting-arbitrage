// Available sportsbooks for arbitrage calculations
export interface Sportsbook {
  key: string;
  name: string;
  region: string;
  requiresPaid?: boolean;
  notes?: string;
}

export const SPORTSBOOKS: Sportsbook[] = [
  { key: 'betonlineag', name: 'BetOnline.ag', region: 'us' },
  { key: 'betmgm', name: 'BetMGM', region: 'us' },
  { key: 'betrivers', name: 'BetRivers', region: 'us' },
  { key: 'betus', name: 'BetUS', region: 'us' },
  { key: 'bovada', name: 'Bovada', region: 'us' },
  { key: 'draftkings', name: 'DraftKings', region: 'us' },
  { key: 'fanduel', name: 'FanDuel', region: 'us' },
  { key: 'lowvig', name: 'LowVig.ag', region: 'us' },
  { key: 'mybookieag', name: 'MyBookie.ag', region: 'us' },
  { key: 'ballybet', name: 'Bally Bet', region: 'us2' },
  { key: 'betanysports', name: 'BetAnything', region: 'us2', notes: 'Formerly BetAnySports' },
  { key: 'betparx', name: 'betPARX', region: 'us2' },
  { key: 'espnbet', name: 'theScore Bet', region: 'us2', notes: 'Formerly ESPN Bet' },
  { key: 'fliff', name: 'Fliff', region: 'us2' },
  { key: 'hardrockbet', name: 'Hard Rock Bet', region: 'us2' },
];

// Default sportsbooks to use (all non-paid ones)
export const DEFAULT_SPORTSBOOKS = SPORTSBOOKS
  .filter(sb => !sb.requiresPaid)
  .map(sb => sb.key);
