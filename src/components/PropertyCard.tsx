import React, { useState } from 'react';
import {
  Heart,
  Train,
  GraduationCap,
  Navigation,
  Scale,
  Bell,
  MessageCircle,
  Eye,
  Building,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import { Property, FloorPlan } from '../types/property';

interface PropertyCardProps {
  property: Property;
  isShortlisted: boolean;
  onToggleShortlist: (property: Property) => void;
  onSelectFloorPlanCompare: (property: Property, floorPlan?: FloorPlan) => void;
  onOpenPriceAlert: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isShortlisted,
  onToggleShortlist,
  onSelectFloorPlanCompare,
  onOpenPriceAlert,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
      {/* Property Image Gallery Section */}
      <div className="relative w-full md:w-80 lg:w-96 h-60 md:h-auto shrink-0 overflow-hidden bg-slate-900">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Image gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.badge && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-700 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {property.badge}
            </span>
          )}
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-900/80 backdrop-blur-xs text-white">
            {property.region} · {property.district}
          </span>
        </div>

        {/* Shortlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist(property);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
            isShortlisted
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-red-500'
          }`}
          title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          aria-label={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
        >
          <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Image slider arrows */}
        {property.images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="p-1 rounded-full bg-black/60 text-white pointer-events-auto hover:bg-black/90 transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="p-1 rounded-full bg-black/60 text-white pointer-events-auto hover:bg-black/90 transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom thumbnail indicators & TOP info */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white z-10 pointer-events-none">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs">
            TOP: {property.estTop}
          </span>
          <span className="text-[11px] text-slate-200">
            {currentImageIndex + 1} / {property.images.length} Photos
          </span>
        </div>
      </div>

      {/* Property Details Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
            <div>
              <span className="text-xs text-slate-500 font-medium">Starting from</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(property.priceFrom)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Avg URA PSF</span>
              <div className="text-sm sm:text-base font-bold text-emerald-700">
                ${property.psfAverage.toLocaleString()} psf
              </div>
            </div>
          </div>

          {/* Project Title & Developer */}
          <div className="mb-2.5">
            <h3
              onClick={() => onViewDetails(property)}
              className="text-lg font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer inline-block"
            >
              {property.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              By {property.developer} · {property.tenure}
            </p>
          </div>

          {/* Sector & Address */}
          <p className="text-xs text-slate-600 mb-3 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800">{property.sector}</span>
            <span className="text-slate-400">·</span>
            <span className="truncate text-slate-500">{property.address}</span>
          </p>

          {/* Key Selection Criteria Proximity Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
            {/* Proximity to MRT */}
            <div className="flex items-start gap-2">
              <Train className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">
                  {property.mrtDistanceMinutes} min walk
                </span>{' '}
                <span className="text-slate-500">to {property.mrtStation}</span>
              </div>
            </div>

            {/* Proximity to Elite Schools */}
            <div className="flex items-start gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">&lt; 1km: </span>
                <span className="text-slate-600">
                  {property.primarySchoolsWithin1km.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>

            {/* Proximity to Expressways */}
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-slate-600">
                <span className="font-semibold text-slate-800">Expressways: </span>
                {property.expressways.join(', ')}
              </div>
            </div>

            {/* Sold percentage / inventory */}
            <div className="flex items-center gap-2">
              <div className="w-full">
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Take-up: {property.soldPercentage}% sold</span>
                  <span className="text-emerald-800 font-semibold">
                    {property.unitsAvailable} left
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${property.soldPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Star Buy Highlight notice if exists */}
          {property.starBuyUnits.length > 0 && (
            <div className="mb-3 px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium">
                <TrendingDown className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Star Buy:</strong> {property.starBuyUnits[0].type} (
                  {property.starBuyUnits[0].unitNumber})
                </span>
              </div>
              <span className="font-bold text-amber-800">
                Save ${property.starBuyUnits[0].discountAmt.toLocaleString()}
              </span>
            </div>
          )}

          {/* Floor Plans Breakdown Pills */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5">
              <span>Unit Layouts Available:</span>
              <button
                onClick={() => onViewDetails(property)}
                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                View all {property.floorPlans.length} floor plans
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {property.floorPlans.map((fp) => (
                <button
                  key={fp.id}
                  onClick={() => onSelectFloorPlanCompare(property, fp)}
                  className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded text-xs text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>
                    {fp.bedroomCount}BR ({fp.areaSqft} sqft)
                  </span>
                  <span className="text-emerald-700 text-[10px] font-bold">
                    ${(fp.indicativePrice / 1000000).toFixed(2)}M
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Action Buttons (PropertyGuru Look & Feel) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Compare Floor Plans button */}
            <button
              onClick={() => onSelectFloorPlanCompare(property)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:border-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-700" />
              <span>Compare Floor Plans</span>
            </button>

            {/* Set Price Alert button */}
            <button
              onClick={() => onOpenPriceAlert(property)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:border-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-700" />
              <span>Price Alert</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Full Details view */}
            <button
              onClick={() => onViewDetails(property)}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            {/* WhatsApp / Agent CTA */}
            <a
              href={`https://wa.me/6591234567?text=Hi%2C+I+am+interested+in+shortlisting+${encodeURIComponent(
                property.name
              )}+via+PropertySeek+Singapore.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Agent</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
