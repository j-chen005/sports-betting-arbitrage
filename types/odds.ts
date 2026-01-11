// Types for The Odds API responses

export interface Sport {
  key: string;
  active: boolean;
  group: string;
  description: string;
  title: string;
  has_outrights: boolean;
}

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Event {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

// Processed data structures
export interface OddsRow {
  match: string;
  commenceTime: string;
  bookmaker: string;
  bookmakerKey: string;
  outcome: string;
  odds: number;
}

export interface ArbitrageBet {
  outcome: string;
  bookmaker: string;
  odds: number;
  betAmount: number;
  impliedProbability: number;
}

export interface ArbitrageOpportunity {
  match: string;
  commenceTime: string;
  totalMinProbability: number;
  bets: ArbitrageBet[];
  guaranteedReturn: number;
  profit: number;
  profitPercentage: number;
}

