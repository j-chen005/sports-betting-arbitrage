# Sports Betting Arbitrage Opportunities

A Next.js web application that detects and displays sports betting arbitrage opportunities using The Odds API.

## Features

- Automatically detects arbitrage opportunities across multiple sports and bookmakers
- Displays guaranteed profit calculations
- Shows detailed betting strategies for each opportunity

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
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

