'use client';

import { useState, useEffect } from 'react';
import ArbitrageCard from './ArbitrageCard';
import { ArbitrageOpportunity, Sport } from '@/types/odds';
import { DEFAULT_SPORTS } from '@/config/sports';

interface ArbitrageListProps {
  sports?: string[];
}

export default function ArbitrageList({ sports: initialSports }: ArbitrageListProps) {
  const [availableSports, setAvailableSports] = useState<Sport[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<
    (ArbitrageOpportunity & { sport?: string })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingSports, setLoadingSports] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch available sports on component mount
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoadingSports(true);
        const response = await fetch('/api/sports');
        if (!response.ok) {
          throw new Error('Failed to fetch available sports');
        }
        const data = await response.json();
        const sports: Sport[] = data.sports || [];
        setAvailableSports(sports);
        
        // Filter to only active sports and validate against API response
        const activeSportKeys = new Set(sports.filter(s => s.active).map(s => s.key));
        const sportsToSelect = initialSports && initialSports.length > 0 ? initialSports : DEFAULT_SPORTS;
        const validSports = sportsToSelect.filter(key => activeSportKeys.has(key));
        setSelectedSports(validSports);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sports');
        console.error('Error fetching sports:', err);
      } finally {
        setLoadingSports(false);
      }
    };

    fetchSports();
  }, [initialSports]);

  const fetchOpportunities = async () => {
    if (selectedSports.length === 0) {
      setError('Please select at least one sport');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log('Fetching opportunities for sports:', selectedSports);
      const response = await fetch('/api/arbitrage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sports: selectedSports,
          commenceTimeFrom: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch arbitrage opportunities: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received opportunities:', data);
      
      if (data.errors && data.errors.length > 0) {
        console.warn('API returned some errors:', data.errors);
        // Show errors but don't block if we got some opportunities
        if (data.opportunities && data.opportunities.length === 0) {
          setError(`Error fetching some sports: ${data.errors.join('; ')}`);
        }
      }
      
      setOpportunities(data.opportunities || []);
      
      if (data.opportunities && data.opportunities.length === 0 && !data.errors) {
        setError('No arbitrage opportunities found. Try selecting different sports or check back later.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching opportunities:', err);
      setOpportunities([]); // Clear opportunities on error
    } finally {
      setLoading(false);
    }
  };

  const handleSportToggle = (sportKey: string) => {
    setSelectedSports(prev => 
      prev.includes(sportKey)
        ? prev.filter(key => key !== sportKey)
        : [...prev, sportKey]
    );
  };

  const handleSelectAll = () => {
    const activeSports = availableSports
      .filter(sport => sport.active)
      .map(sport => sport.key);
    setSelectedSports(activeSports);
  };

  const handleDeselectAll = () => {
    setSelectedSports([]);
  };

  if (loadingSports) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading available sports...</div>
      </div>
    );
  }

  const activeSports = availableSports.filter(sport => sport.active);

  return (
    <div className="space-y-6">
      {/* Sports Selection Section */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-900">Select Sports</h2>
            <span className="text-xs text-gray-500">
              ({selectedSports.length} of {activeSports.length} selected)
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleSelectAll}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              None
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-1 max-h-48 overflow-y-auto">
          {activeSports.map(sport => (
            <label
              key={sport.key}
              className="flex items-center space-x-1.5 cursor-pointer hover:bg-gray-50 py-1 px-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedSports.includes(sport.key)}
                onChange={() => handleSportToggle(sport.key)}
                className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">{sport.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Opportunities Section */}
      {!hasSearched && opportunities.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-600 mb-4">
            {selectedSports.length === 0
              ? 'Please select at least one sport to search for opportunities'
              : 'Click the button below to find arbitrage opportunities'}
          </div>
          <button
            onClick={fetchOpportunities}
            disabled={loading || selectedSports.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {loading ? 'Loading...' : 'Find Arbitrage Opportunities'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `Found ${opportunities.length} opportunit${opportunities.length !== 1 ? 'ies' : 'y'}`}
            </h2>
            <button
              onClick={fetchOpportunities}
              disabled={loading || selectedSports.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {error && error.includes('No arbitrage opportunities found') && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
              {error}
            </div>
          )}

          {error && !error.includes('No arbitrage opportunities found') && !error.includes('Please select') && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {opportunities.length > 0 ? (
            <div className="grid gap-6">
              {opportunities.map((opp, index) => (
                <ArbitrageCard key={index} opportunity={opp} />
              ))}
            </div>
          ) : hasSearched && !loading && !error && (
            <div className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
              No arbitrage opportunities found. Try selecting different sports or check back later.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

