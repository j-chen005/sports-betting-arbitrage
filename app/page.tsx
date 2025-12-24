import ArbitrageList from '@/components/ArbitrageList';
import { DEFAULT_SPORTS } from '@/config/sports';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Sports Betting Arbitrage Opportunities
          </h1>
          <p className="mt-2 text-gray-600">
            Find guaranteed profit opportunities across multiple bookmakers
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArbitrageList sports={DEFAULT_SPORTS} />
      </main>
    </div>
  );
}
