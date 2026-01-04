'use client';

import { useState } from 'react';
import ArbitrageCard from './ArbitrageCard';
import { ArbitrageOpportunity } from '@/types/odds';

interface ArbitrageListProps {
  sports: string[];
}

export default function ArbitrageList({ sports }: ArbitrageListProps) {
  const [opportunities, setOpportunities] = useState<
    (ArbitrageOpportunity & { sport?: string })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/arbitrage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sports,
          commenceTimeFrom: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch arbitrage opportunities');
      }

      const data = await response.json();
      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchOpportunities}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Retry'}
        </button>
      </div>
    );
  }

  if (opportunities.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-600 mb-4">Click the button below to find arbitrage opportunities</div>
        <button
          onClick={fetchOpportunities}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
        >
          {loading ? 'Loading...' : 'Find Arbitrage Opportunities'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {loading ? 'Loading...' : `Found ${opportunities.length} opportunity${opportunities.length !== 1 ? 'ies' : ''}`}
        </h2>
        <button
          onClick={fetchOpportunities}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="grid gap-6">
        {opportunities.map((opp, index) => (
          <ArbitrageCard key={index} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}

