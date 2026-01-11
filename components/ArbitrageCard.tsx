'use client';

import { ArbitrageOpportunity } from '@/types/odds';
import { format } from 'date-fns';

interface ArbitrageCardProps {
  opportunity: ArbitrageOpportunity & { sport?: string };
}

export default function ArbitrageCard({ opportunity }: ArbitrageCardProps) {
  const commenceDate = new Date(opportunity.commenceTime);
  const formattedDate = format(commenceDate, 'MMM dd, yyyy h:mm a');
  
  // Calculate total investment from bet amounts (more accurate than hardcoded value)
  const totalInvestment = opportunity.bets.reduce((sum, bet) => sum + bet.betAmount, 0);

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {opportunity.match}
          </h3>
          {opportunity.sport && (
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {opportunity.sport.replace(/_/g, ' ')}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            {formattedDate}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            +${opportunity.profit.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            {(opportunity.profitPercentage).toFixed(2)}% profit
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Betting Strategy:
        </h4>
        <div className="space-y-2">
          {opportunity.bets.map((bet, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{bet.outcome}</div>
                <div className="text-sm text-gray-600">{bet.bookmaker}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${bet.betAmount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Odds: {bet.odds.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-600">
        <span>Total Investment: ${totalInvestment.toFixed(2)}</span>
        <span>Guaranteed Return: ${opportunity.guaranteedReturn.toFixed(2)}</span>
      </div>
    </div>
  );
}

