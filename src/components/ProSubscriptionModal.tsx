import React from 'react';
import {
  Crown,
  X,
  Check,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';

interface ProSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProUser: boolean;
  onTogglePro: () => void;
}

export const ProSubscriptionModal: React.FC<ProSubscriptionModalProps> = ({
  isOpen,
  onClose,
  isProUser,
  onTogglePro,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Developer & Agent Professional Tier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Accurate Singapore Launch Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Why PropertySeek subscribers pay: Instant access to accurate URA data, unreleased developer stacks, and client presentation tools.
          </p>
        </div>

        {/* Pricing Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Free Buyer Plan */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Home Buyer
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">
                Free
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Essential tools for home buyers to shortlist new launches.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Browse all Singapore new launch projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sector, MRT & school proximity filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Compare up to 3 floor plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shortlist up to 3 developments</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 text-slate-300">✕</span>
                  <span>No raw URA caveat data export</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <span className="w-full block py-2 text-center text-xs font-bold text-slate-600 bg-slate-200/70 rounded-lg">
                Included By Default
              </span>
            </div>
          </div>

          {/* Pro Developer & Agent Plan */}
          <div className="border-2 border-emerald-600 rounded-xl p-5 bg-white shadow-md relative flex flex-col justify-between">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Team One Pro</span>
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Developer & Real Estate Agent
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-extrabold text-slate-900">$68</span>
                <span className="text-xs text-slate-500">SGD / month</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Unlimited access to real-time developer pricing & sales velocity.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900">
                    Unlimited Shortlists & Floor Plan Comparisons
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant WhatsApp notifications on Star Buys</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Developer Land Bid Breakeven Calculator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full URA Caveats CSV Transaction Download</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>White-label PDF Client Pitch Deck Generator</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  onTogglePro();
                  onClose();
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>
                  {isProUser ? 'Currently Active (Click to Revert)' : 'Activate Pro Subscription'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-center text-[11px] text-slate-400">
          Source data verified directly against official URA Singapore planning permissions and master plan gazettes.
        </div>
      </div>
    </div>
  );
};
