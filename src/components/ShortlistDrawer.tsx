import React, { useState } from 'react';
import {
  Bookmark,
  X,
  Trash2,
  Share2,
  ExternalLink,
  Calculator,
  Building,
  Train,
  GraduationCap,
  Scale,
  Sparkles,
  Download,
} from 'lucide-react';
import { Property, FloorPlan } from '../types/property';

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistedProperties: Property[];
  onRemoveShortlist: (id: string) => void;
  onSelectFloorPlanCompare: (property: Property, floorPlan?: FloorPlan) => void;
  onViewDetails: (property: Property) => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  onClose,
  shortlistedProperties,
  onRemoveShortlist,
  onSelectFloorPlanCompare,
  onViewDetails,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'list' | 'matrix' | 'stamp_duty'>('list');
  const [buyerProfile, setBuyerProfile] = useState<'citizen_1' | 'citizen_2' | 'pr_1' | 'foreigner'>('citizen_1');
  const [stampDutyPrice, setStampDutyPrice] = useState<number>(
    shortlistedProperties[0]?.priceFrom || 1600000
  );

  // Calculate Singapore Buyer's Stamp Duty (BSD)
  const calculateBSD = (price: number) => {
    let bsd = 0;
    if (price > 3000000) {
      bsd += (price - 3000000) * 0.06;
      price = 3000000;
    }
    if (price > 1500000) {
      bsd += (price - 1500000) * 0.05;
      price = 1500000;
    }
    if (price > 1000000) {
      bsd += (price - 1000000) * 0.04;
      price = 1000000;
    }
    if (price > 360000) {
      bsd += (price - 360000) * 0.03;
      price = 360000;
    }
    if (price > 180000) {
      bsd += (price - 180000) * 0.02;
      price = 180000;
    }
    bsd += price * 0.01;
    return Math.round(bsd);
  };

  // Calculate Singapore ABSD
  const calculateABSD = (price: number) => {
    switch (buyerProfile) {
      case 'citizen_1':
        return 0; // 0%
      case 'citizen_2':
        return Math.round(price * 0.20); // 20%
      case 'pr_1':
        return Math.round(price * 0.05); // 5%
      case 'foreigner':
        return Math.round(price * 0.60); // 60%
      default:
        return 0;
    }
  };

  const bsdAmount = calculateBSD(stampDutyPrice);
  const absdAmount = calculateABSD(stampDutyPrice);
  const totalTax = bsdAmount + absdAmount;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-emerald-300" />
            <div>
              <h2 className="text-lg font-bold">
                My Shortlisted Launches ({shortlistedProperties.length})
              </h2>
              <p className="text-xs text-emerald-200">
                Compare shortlisted projects & calculate Singapore stamp duty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'list'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Developments
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'matrix'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Side-by-Side Matrix
          </button>
          <button
            onClick={() => setActiveTab('stamp_duty')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'stamp_duty'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            IRAS Stamp Duty (BSD & ABSD)
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {shortlistedProperties.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Your Shortlist is Empty
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Click the heart icon on any new launch property card to save it here for side-by-side comparison.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
              >
                Browse New Launches
              </button>
            </div>
          ) : activeTab === 'list' ? (
            <div className="space-y-4">
              {shortlistedProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs hover:border-emerald-500 transition-all flex flex-col sm:flex-row gap-3"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.name}
                    className="w-full sm:w-28 h-24 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {prop.name}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {prop.region} · {prop.district} · {prop.tenure}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveShortlist(prop.id)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Remove from shortlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-emerald-800 font-extrabold text-sm">
                          From ${(prop.priceFrom / 1000000).toFixed(2)}M
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Avg ${prop.psfAverage} psf
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                        <Train className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>
                          {prop.mrtDistanceMinutes} min walk to {prop.mrtStation}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          onSelectFloorPlanCompare(prop);
                          onClose();
                        }}
                        className="text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Compare Layouts</span>
                      </button>

                      <button
                        onClick={() => {
                          onViewDetails(prop);
                          onClose();
                        }}
                        className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        View Full Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'matrix' ? (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Criteria</th>
                    {shortlistedProperties.map((p) => (
                      <th key={p.id} className="py-2.5 px-3 min-w-[140px] font-bold">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 px-3 font-semibold bg-slate-50">Starting Price</td>
                    {shortlistedProperties.map((p) => (
                      <td key={p.id} className="py-2 px-3 font-bold text-emerald-800">
                        ${(p.priceFrom / 1000000).toFixed(2)}M
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold bg-slate-50">Average PSF</td>
                    {shortlistedProperties.map((p) => (
                      <td key={p.id} className="py-2 px-3">
                        ${p.psfAverage} psf
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold bg-slate-50">MRT Distance</td>
                    {shortlistedProperties.map((p) => (
                      <td key={p.id} className="py-2 px-3">
                        {p.mrtDistanceMinutes} min ({p.mrtStation})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold bg-slate-50">1km Schools</td>
                    {shortlistedProperties.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-slate-600">
                        {p.primarySchoolsWithin1km.slice(0, 2).join(', ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold bg-slate-50">Expressways</td>
                    {shortlistedProperties.map((p) => (
                      <td key={p.id} className="py-2 px-3">
                        {p.expressways.join(', ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold bg-slate-50">Tenure</td>
                    {shortlistedProperties.map((p) => (
                      <td key={p.id} className="py-2 px-3">
                        {p.tenure}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold bg-slate-50">Est. TOP</td>
                    {shortlistedProperties.map((p) => (
                      <td key={p.id} className="py-2 px-3">
                        {p.estTop}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* TAB: Stamp Duty Calculator */
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-emerald-800" />
                  <span className="font-bold text-emerald-900 text-sm">
                    Singapore IRAS Stamp Duty Calculator
                  </span>
                </div>
                <p className="text-slate-600 mb-3">
                  Calculate Buyer&apos;s Stamp Duty (BSD) and Additional Buyer&apos;s Stamp Duty (ABSD) for your new launch shortlist.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Purchase Price (SGD)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={stampDutyPrice}
                      onChange={(e) => setStampDutyPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Buyer Residency & Ownership Profile
                    </label>
                    <select
                      value={buyerProfile}
                      onChange={(e) =>
                        setBuyerProfile(
                          e.target.value as
                            | 'citizen_1'
                            | 'citizen_2'
                            | 'pr_1'
                            | 'foreigner'
                        )
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-800"
                    >
                      <option value="citizen_1">Singapore Citizen (1st Residential Property - 0% ABSD)</option>
                      <option value="citizen_2">Singapore Citizen (2nd Residential Property - 20% ABSD)</option>
                      <option value="pr_1">Singapore PR (1st Residential Property - 5% ABSD)</option>
                      <option value="foreigner">Foreigner (60% ABSD)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Buyer&apos;s Stamp Duty (BSD):</span>
                    <strong className="text-slate-900">${bsdAmount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Additional Buyer&apos;s Stamp Duty (ABSD):</span>
                    <strong className="text-slate-900">${absdAmount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-emerald-900 pt-2 border-t border-emerald-300">
                    <span>Total IRAS Stamp Duty Payable:</span>
                    <span>${totalTax.toLocaleString()} SGD</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Source credit */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Data: URA SINGAPORE</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Shortlist share link copied to clipboard!');
            }}
            className="flex items-center gap-1 text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Shortlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
