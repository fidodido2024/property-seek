import React, { useState } from 'react';
import {
  Scale,
  X,
  Plus,
  Check,
  Calculator,
  Compass,
  Maximize2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Property, FloorPlan } from '../types/property';
import { MOCK_PROPERTIES } from '../data/mockProperties';

interface FloorPlanCompareProps {
  selectedPlans: { property: Property; floorPlan: FloorPlan }[];
  onRemovePlan: (index: number) => void;
  onAddPlan: (property: Property, floorPlan: FloorPlan) => void;
  onClose: () => void;
  onToggleShortlist: (property: Property) => void;
  shortlistIds: string[];
}

export const FloorPlanCompare: React.FC<FloorPlanCompareProps> = ({
  selectedPlans,
  onRemovePlan,
  onAddPlan,
  onClose,
  onToggleShortlist,
  shortlistIds,
}) => {
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<'matrix' | 'visual' | 'mortgage'>('matrix');

  // Calculate Singapore monthly mortgage (75% LTV)
  const calculateMortgage = (price: number) => {
    const loanAmount = price * 0.75;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTenureYears * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    return Math.round(monthlyPayment);
  };

  const calculateDownpayment = (price: number) => {
    const minCash5 = price * 0.05;
    const cpfOrCash20 = price * 0.20;
    return { minCash5, cpfOrCash20, total25: price * 0.25 };
  };

  // Quick picker for adding another plan
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPropId, setPickerPropId] = useState<string>(MOCK_PROPERTIES[0].id);

  const activePickerProperty =
    MOCK_PROPERTIES.find((p) => p.id === pickerPropId) || MOCK_PROPERTIES[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
      {/* Header bar */}
      <div className="bg-emerald-900 text-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Floor Plan Comparison Studio
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              Side-by-side architectural layout efficiency, room dimensions, & mortgage comparison
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub tabs */}
          <div className="bg-emerald-800/80 p-1 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Specs Matrix
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                activeTab === 'visual'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Blueprint View
            </button>
            <button
              onClick={() => setActiveTab('mortgage')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                activeTab === 'mortgage'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Mortgage & Downpayment
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            aria-label="Close comparison view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Comparison Body */}
      <div className="p-4 sm:p-6">
        {selectedPlans.length === 0 ? (
          <div className="text-center py-12 px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No Floor Plans Selected Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Pick 2 or 3 unit types from any development to compare layout efficiency, dumbbell hallway savings, and monthly installments.
            </p>
            <button
              onClick={() => setPickerOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Select First Floor Plan</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Top slot selector cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {selectedPlans.map((item, index) => (
                <div
                  key={`${item.property.id}-${item.floorPlan.id}-${index}`}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative"
                >
                  <button
                    onClick={() => onRemovePlan(index)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide mb-1">
                    Slot {index + 1}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {item.property.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2">
                    {item.floorPlan.code} ({item.floorPlan.bedroomCount} BR / {item.floorPlan.bathroomCount} Bath)
                  </p>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400">Indicative: </span>
                      <strong className="text-slate-900 font-extrabold text-sm">
                        ${(item.floorPlan.indicativePrice / 1000000).toFixed(2)}M
                      </strong>
                    </div>
                    <div className="text-emerald-700 font-semibold">
                      ${item.floorPlan.psf.toLocaleString()} psf
                    </div>
                  </div>
                </div>
              ))}

              {/* Add slot placeholder if under 3 */}
              {selectedPlans.length < 3 && (
                <div
                  onClick={() => setPickerOpen(true)}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors cursor-pointer min-h-[120px]"
                >
                  <Plus className="w-6 h-6 text-emerald-700 mb-1" />
                  <span className="text-xs font-bold text-slate-700">
                    Add Floor Plan to Compare
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Up to 3 side-by-side
                  </span>
                </div>
              )}
            </div>

            {/* TAB 1: Specs Matrix */}
            {activeTab === 'matrix' && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-44">Feature / Metric</th>
                      {selectedPlans.map((item, idx) => (
                        <th key={idx} className="py-3 px-4 min-w-[200px]">
                          {item.property.name} - {item.floorPlan.code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Total Floor Area
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-bold text-slate-900">
                          {item.floorPlan.areaSqft} sqft ({item.floorPlan.areaSqm} sqm)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Layout Efficiency Score
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-emerald-700 text-base">
                              {item.floorPlan.efficiencyScore}%
                            </span>
                            <span className="text-[11px] text-slate-500">
                              (Hallway vs Usable Living)
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Layout Architecture Style
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                            {item.floorPlan.layoutStyle}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Kitchen Architecture
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-medium">
                          {item.floorPlan.kitchenType}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Balcony Orientation
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-medium flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{item.floorPlan.balconyOrientation}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Master Bedroom Size
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-mono font-medium">
                          {item.floorPlan.dimensions.masterBed}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Living & Dining Frontage
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-mono font-medium">
                          {item.floorPlan.dimensions.livingDining}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        MRT Distance & Station
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-medium">
                          {item.property.mrtDistanceMinutes} min walk ({item.property.mrtStation})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Primary School (&lt; 1km)
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-medium text-emerald-800">
                          {item.property.primarySchoolsWithin1km.join(', ')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50/70">
                        Key Layout Highlights
                      </td>
                      {selectedPlans.map((item, idx) => (
                        <td key={idx} className="py-3 px-4">
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                            {item.floorPlan.features.map((feat, fidx) => (
                              <li key={fidx}>{feat}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: Visual Architectural Blueprint */}
            {activeTab === 'visual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedPlans.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.property.name} · {item.floorPlan.code}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700">
                          {item.floorPlan.areaSqft} sqft
                        </span>
                      </div>

                      {/* Interactive Architectural Blueprint SVG Diagram */}
                      <div className="bg-slate-900 rounded-lg p-3 text-slate-100 my-2 aspect-4/3 flex flex-col justify-between relative overflow-hidden border border-slate-800 font-mono text-[11px]">
                        {/* Blueprint grid background */}
                        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:14px_14px]" />

                        {/* Top: Balcony & Living */}
                        <div className="relative z-10 flex flex-col gap-1.5 h-full justify-between">
                          <div className="border border-dashed border-emerald-400 bg-emerald-950/40 p-2 rounded text-center">
                            <span className="text-emerald-300 font-semibold block">
                              BALCONY ({item.floorPlan.dimensions.balcony})
                            </span>
                            <span className="text-[10px] text-emerald-400/80">
                              Orientation: {item.floorPlan.balconyOrientation}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 flex-1 my-1">
                            {/* Living & Dining */}
                            <div className="border border-sky-500/60 bg-sky-950/40 p-2 rounded flex flex-col justify-center text-center">
                              <span className="text-sky-300 font-bold block">
                                LIVING & DINING
                              </span>
                              <span className="text-[10px] text-sky-400">
                                {item.floorPlan.dimensions.livingDining}
                              </span>
                            </div>

                            {/* Master Bedroom */}
                            <div className="border border-amber-500/60 bg-amber-950/40 p-2 rounded flex flex-col justify-center text-center">
                              <span className="text-amber-300 font-bold block">
                                MASTER BEDROOM
                              </span>
                              <span className="text-[10px] text-amber-400">
                                {item.floorPlan.dimensions.masterBed}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {/* Kitchen */}
                            <div className="border border-teal-500/50 bg-teal-950/40 p-1.5 rounded text-center">
                              <span className="text-teal-300 font-medium block">
                                {item.floorPlan.kitchenType}
                              </span>
                              <span className="text-[9px] text-teal-400">
                                {item.floorPlan.dimensions.kitchen}
                              </span>
                            </div>

                            {/* Bath & Dumbbell Zone */}
                            <div className="border border-slate-600 bg-slate-800/60 p-1.5 rounded text-center">
                              <span className="text-slate-300 font-medium block">
                                BATH ({item.floorPlan.bathroomCount}) & AC Ledge
                              </span>
                              <span className="text-[9px] text-slate-400">
                                Efficiency: {item.floorPlan.efficiencyScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 italic">
                        &quot;{item.floorPlan.description}&quot;
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => onToggleShortlist(item.property)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          shortlistIds.includes(item.property.id)
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {shortlistIds.includes(item.property.id)
                          ? 'In Shortlist'
                          : 'Save Property'}
                      </button>

                      <a
                        href={`https://wa.me/6591234567?text=Hi%2C+I+want+to+enquire+about+${encodeURIComponent(
                          item.property.name
                        )}+floor+plan+${encodeURIComponent(item.floorPlan.code)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                      >
                        Enquire Layout
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Mortgage & Downpayment Breakdown */}
            {activeTab === 'mortgage' && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Singapore MAS Mortgage Loan Parameters
                      </h4>
                      <p className="text-xs text-slate-500">
                        Standard MAS regulatory ceiling: Max 75% LTV, 5% cash min, 20% CPF OA / Cash
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <label htmlFor="interest-rate">Interest:</label>
                      <input
                        id="interest-rate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 3.5)}
                        className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center text-xs font-bold"
                      />
                      <span>% p.a.</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <label htmlFor="loan-tenure">Tenure:</label>
                      <select
                        id="loan-tenure"
                        value={loanTenureYears}
                        onChange={(e) => setLoanTenureYears(parseInt(e.target.value, 10))}
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                      >
                        <option value="25">25 Years</option>
                        <option value="30">30 Years</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedPlans.map((item, idx) => {
                    const price = item.floorPlan.indicativePrice;
                    const monthly = calculateMortgage(price);
                    const dp = calculateDownpayment(price);

                    return (
                      <div
                        key={idx}
                        className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs"
                      >
                        <h4 className="font-bold text-slate-900 text-sm mb-1">
                          {item.property.name} ({item.floorPlan.code})
                        </h4>
                        <div className="text-xl font-extrabold text-emerald-700 mb-3">
                          ${(price / 1000000).toFixed(2)}M SGD
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Est. Monthly Mortgage</span>
                            <span className="font-extrabold text-slate-900 text-sm">
                              ${monthly.toLocaleString()} / mo
                            </span>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Min 5% Cash Downpayment</span>
                            <span className="font-semibold text-slate-800">
                              ${dp.minCash5.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">20% CPF OA / Cash</span>
                            <span className="font-semibold text-slate-800">
                              ${dp.cpfOrCash20.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Total 25% Initial Capital</span>
                            <span className="font-bold text-emerald-800">
                              ${dp.total25.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-500">75% Loan Quantum</span>
                            <span className="font-semibold text-slate-800">
                              ${(price * 0.75).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floor Plan Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Choose Floor Plan to Compare
              </h3>
              <button
                onClick={() => setPickerOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Development */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Step 1: Select Development
              </label>
              <select
                value={pickerPropId}
                onChange={(e) => setPickerPropId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold"
              >
                {MOCK_PROPERTIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.district} - {p.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Unit Type */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-600 block mb-2">
                Step 2: Choose Unit Layout
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {activePickerProperty.floorPlans.map((fp) => (
                  <button
                    key={fp.id}
                    onClick={() => {
                      onAddPlan(activePickerProperty, fp);
                      setPickerOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-900">
                        {fp.code} · {fp.bedroomCount} Bedroom ({fp.areaSqft} sqft)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {fp.layoutStyle} · {fp.kitchenType}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-xs text-emerald-700">
                        ${(fp.indicativePrice / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ${fp.psf.toLocaleString()} psf
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
