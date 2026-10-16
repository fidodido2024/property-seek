import React, { useState } from 'react';
import {
  X,
  MapPin,
  Train,
  GraduationCap,
  Navigation,
  Scale,
  Bell,
  Heart,
  MessageCircle,
  Building,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Property, FloorPlan } from '../types/property';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (property: Property) => void;
  onSelectFloorPlanCompare: (property: Property, floorPlan: FloorPlan) => void;
  onOpenPriceAlert: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onSelectFloorPlanCompare,
  onOpenPriceAlert,
}) => {
  if (!isOpen || !property) return null;

  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-700 text-white">
                {property.region} · {property.district}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {property.tenure}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              {property.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(property)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-600'
              }`}
              title={isShortlisted ? 'Saved to Shortlist' : 'Add to Shortlist'}
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="h-64 sm:h-96 rounded-xl overflow-hidden bg-slate-900 relative">
              <img
                src={property.images[activePhoto]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md">
                Photo {activePhoto + 1} of {property.images.length}
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                      activePhoto === idx ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Starting Price</span>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">
                ${(property.priceFrom / 1000000).toFixed(2)}M SGD
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Average PSF</span>
              <div className="text-base sm:text-lg font-extrabold text-emerald-800">
                ${property.psfAverage.toLocaleString()} psf
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Available Units</span>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">
                {property.unitsAvailable} / {property.totalUnits}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Est. TOP Date</span>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">
                {property.estTop}
              </div>
            </div>
          </div>

          {/* Location & Proximity Criteria Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Location & Proximity Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Train className="w-4 h-4 text-emerald-700" />
                  <span>MRT Proximity</span>
                </div>
                <p className="text-slate-600">
                  {property.mrtDistanceMinutes} minutes sheltered walk to {property.mrtStation} ({property.mrtLine})
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>Primary Schools (&lt; 1km & 1-2km)</span>
                </div>
                <p className="text-slate-600">
                  <strong>Within 1km:</strong> {property.primarySchoolsWithin1km.join(', ')}
                </p>
                <p className="text-slate-500 mt-1">
                  <strong>Within 2km:</strong> {property.primarySchoolsWithin2km.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Navigation className="w-4 h-4 text-emerald-700" />
                  <span>Expressways</span>
                </div>
                <p className="text-slate-600">
                  Immediate arterial access to {property.expressways.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Building className="w-4 h-4 text-emerald-700" />
                  <span>Nearby Amenities & Lifestyle</span>
                </div>
                <p className="text-slate-600">
                  {property.amenities.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* Unit Layouts & Floor Plans */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Unit Floor Plans ({property.floorPlans.length} Types)
              </h3>
              <span className="text-xs text-emerald-700 font-semibold">
                Click any layout to compare
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.floorPlans.map((fp) => (
                <div
                  key={fp.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 text-sm font-bold">
                        {fp.code} · {fp.bedroomCount} Bedroom ({fp.bathroomCount} Bath)
                      </strong>
                      <span className="text-emerald-800 font-extrabold text-sm">
                        ${(fp.indicativePrice / 1000000).toFixed(2)}M
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span>{fp.areaSqft} sqft ({fp.areaSqm} sqm)</span>
                      <span>·</span>
                      <span>${fp.psf.toLocaleString()} psf</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">{fp.layoutStyle}</span>
                    </div>

                    <p className="text-xs text-slate-600 mb-2">
                      {fp.description}
                    </p>

                    <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-600 space-y-0.5">
                      <div>Master Bed: <strong>{fp.dimensions.masterBed}</strong></div>
                      <div>Living/Dining: <strong>{fp.dimensions.livingDining}</strong></div>
                      <div>Balcony: <strong>{fp.dimensions.balcony}</strong> ({fp.balconyOrientation})</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelectFloorPlanCompare(property, fp);
                        onClose();
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Compare This Layout</span>
                    </button>

                    <a
                      href={`https://wa.me/6591234567?text=Hi%2C+I+want+to+enquire+about+${encodeURIComponent(
                        property.name
                      )}+${encodeURIComponent(fp.code)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-700 hover:text-emerald-800"
                    >
                      Request Floor Plan PDF →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official URA Transaction History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Recent URA Caveats & Developer Transactions</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-800">
                Data: URA SINGAPORE
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Unit Type</th>
                    <th className="py-2 px-3">Area (sqft)</th>
                    <th className="py-2 px-3">Transacted Price</th>
                    <th className="py-2 px-3">PSF</th>
                    <th className="py-2 px-3">Floor Level</th>
                    <th className="py-2 px-3">Buyer Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {property.uraTransactionHistory.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-500 font-medium">{tx.date}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{tx.unitType}</td>
                      <td className="py-2 px-3">{tx.areaSqft} sqft</td>
                      <td className="py-2 px-3 font-bold text-emerald-800">
                        ${tx.price.toLocaleString()}
                      </td>
                      <td className="py-2 px-3">${tx.psf.toLocaleString()} psf</td>
                      <td className="py-2 px-3 text-slate-500">Floor {tx.floorRange}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                          {tx.buyerType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPriceAlert(property)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-emerald-700" />
              <span>Set Real-Time Price Alert</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/6591234567?text=Hi%2C+I+would+like+to+book+a+showflat+viewing+for+${encodeURIComponent(
                property.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book Showflat Viewing</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
