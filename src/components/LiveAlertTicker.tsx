import React from 'react';
import { Bell, TrendingDown, Sparkles, ChevronRight } from 'lucide-react';

interface LiveAlertTickerProps {
  onOpenAlerts: () => void;
  recentAlertText: string;
}

export const LiveAlertTicker: React.FC<LiveAlertTickerProps> = ({
  onOpenAlerts,
  recentAlertText,
}) => {
  return (
    <div className="bg-emerald-50 border-y border-emerald-200/60 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
          <span className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded text-[11px] shrink-0">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
            <span>REAL-TIME ALERT</span>
          </span>
          <span className="text-slate-800 font-medium truncate">
            {recentAlertText ||
              '🔥 Grand Dunman: Star Buy #12-08 just released with $52,000 developer discount!'}
          </span>
        </div>

        <button
          onClick={onOpenAlerts}
          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Set Custom Price Alert</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
