# Sports Betting Arbitrage Opportunities

A Next.js web application that detects and displays sports betting arbitrage opportunities using The Odds API.

## Features

- 🔍 Automatically detects arbitrage opportunities across multiple sports
- 💰 Displays guaranteed profit calculations
- 📊 Shows detailed betting strategies for each opportunity
- 🎯 Filters out unreliable bookmakers (Betfair, Fliff, Bovada)
- ⚡ Real-time data from The Odds API
- 🎨 Modern, responsive UI built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: The Odds API (https://the-odds-api.com/)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An API key from [The Odds API](https://the-odds-api.com/)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sports-betting-arbitrage
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your API key:
```env
ODDS_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### Arbitrage Detection

The application detects arbitrage opportunities by:

1. **Fetching odds data** from The Odds API for specified sports
2. **Calculating implied probabilities** for each outcome (1/odds)
3. **Finding the best odds** for each outcome across all bookmakers
4. **Summing minimum implied probabilities** - if the sum < 1, an arbitrage opportunity exists
5. **Calculating optimal bet amounts** to guarantee profit

### Algorithm

For each match:
- Filter out excluded bookmakers and odds > 800
- For each outcome, find the bookmaker offering the best (lowest) implied probability
- If the sum of all minimum implied probabilities < 1, arbitrage exists
- Calculate bet amounts proportionally: `Bet Amount = (Investment × Implied Probability) / Total Min Probability`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── arbitrage/          # API routes for arbitrage detection
│   │   │   ├── route.ts        # Single sport endpoint
│   │   │   └── multiple/       # Multiple sports endpoint
│   │   └── sports/             # Sports list endpoint
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
├── components/
│   ├── ArbitrageCard.tsx       # Individual opportunity card
│   └── ArbitrageList.tsx       # List of opportunities
├── lib/
│   ├── arbitrage.ts            # Arbitrage detection logic
│   └── odds-api.ts             # API client functions
├── types/
│   └── odds.ts                 # TypeScript type definitions
└── config/
    └── sports.ts               # Default sports configuration
```

## API Endpoints

### GET `/api/sports`
Returns a list of available sports from The Odds API.

### GET `/api/arbitrage?sport={sportKey}`
Fetches arbitrage opportunities for a single sport.

### POST `/api/arbitrage/multiple`
Fetches arbitrage opportunities for multiple sports.

**Request Body:**
```json
{
  "sports": ["basketball_nba", "soccer_epl"],
  "commenceTimeFrom": "2024-12-01T00:00:00Z"
}
```

## Configuration

### Default Sports

Edit `config/sports.ts` to change which sports are checked by default:

```typescript
export const DEFAULT_SPORTS = [
  'basketball_nba',
  'soccer_epl',
  // ... add more sports
];
```

### Excluded Bookmakers

Edit `lib/arbitrage.ts` to modify the excluded bookmakers list:

```typescript
const EXCLUDED_BOOKMAKERS = ['Betfair', 'Fliff', 'Bovada'];
```

### Investment Amount

Edit `lib/arbitrage.ts` to change the default investment amount:

```typescript
const TOTAL_INVESTMENT = 500; // Change to your preferred amount
```

## Conversion from Python

This project is a TypeScript conversion of the original Python notebook. Key conversions:

- **pandas DataFrame** → TypeScript arrays and objects
- **requests** → native `fetch` API
- **pandas.groupby()** → JavaScript `Map` and array operations
- **pandas filtering** → JavaScript array `.filter()` method

## Limitations

- API rate limits from The Odds API apply
- Opportunities may disappear quickly in real-time betting
- Requires accounts with multiple bookmakers to execute
- Profit margins are typically small (0.1% - 5%)

## License

MIT
