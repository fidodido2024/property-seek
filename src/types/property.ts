export type Region = 'CCR' | 'RCR' | 'OCR';
export type Tenure = '99-year Leasehold' | 'Freehold' | '999-year Leasehold';

export interface FloorPlanDimensions {
  masterBed: string;
  livingDining: string;
  bed2?: string;
  bed3?: string;
  balcony: string;
  kitchen: string;
}

export interface FloorPlan {
  id: string;
  code: string;
  bedroomCount: number;
  bathroomCount: number;
  areaSqft: number;
  areaSqm: number;
  indicativePrice: number;
  psf: number;
  layoutStyle: 'Dumbbell (Zero Hallway Waste)' | 'Corner Unit' | 'Dual Key' | 'Private Lift Foyer' | 'Standard Efficient';
  kitchenType: 'Enclosed Kitchen' | 'Open Concept' | 'Wet & Dry Kitchen';
  balconyOrientation: 'North-South Facing' | 'East Facing' | 'Panoramic Skyline View' | 'Pool View';
  efficiencyScore: number; // percentage, e.g. 92
  dimensions: FloorPlanDimensions;
  description: string;
  features: string[];
}

export interface UraTransaction {
  id: string;
  date: string;
  unitType: string;
  areaSqft: number;
  price: number;
  psf: number;
  floorRange: string;
  buyerType: 'Singaporean' | 'Permanent Resident' | 'Foreigner' | 'Company';
}

export interface StarBuyPromo {
  unitNumber: string;
  type: string;
  areaSqft: number;
  originalPrice: number;
  promoPrice: number;
  discountAmt: number;
  stack: string;
}

export interface Property {
  id: string;
  name: string;
  tagline: string;
  developer: string;
  district: string; // e.g. D15, D26, D05
  region: Region;
  sector: string; // e.g. "East Coast / Marine Parade", "Lentor / Thomson"
  address: string;
  tenure: Tenure;
  estTop: string;
  totalUnits: number;
  unitsAvailable: number;
  soldPercentage: number;
  priceFrom: number;
  priceTo: number;
  psfAverage: number;
  psfMin: number;
  psfMax: number;
  mrtStation: string;
  mrtDistanceMinutes: number; // walking minutes
  mrtLine: string; // e.g. "Circle Line (CC8)", "Thomson-East Coast (TE5)"
  primarySchoolsWithin1km: string[];
  primarySchoolsWithin2km: string[];
  expressways: string[];
  amenities: string[];
  images: string[];
  floorPlans: FloorPlan[];
  uraTransactionHistory: UraTransaction[];
  starBuyUnits: StarBuyPromo[];
  badge?: 'Newly Launched' | 'Top Seller' | 'Near TOP' | 'Star Buys Available' | 'Freehold Landmark';
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PriceAlert {
  id: string;
  propertyId: string;
  propertyName: string;
  bedroomFilter: string;
  triggerType: 'price_drop' | 'new_stack' | 'star_buy' | 'target_psf';
  thresholdValue: number;
  recipientContact: string;
  channel: 'Email' | 'WhatsApp';
  active: boolean;
  createdAt: string;
  lastNotified?: string;
  history: {
    date: string;
    message: string;
    oldPrice?: number;
    newPrice?: number;
  }[];
}

export interface FilterState {
  searchQuery: string;
  region: string; // 'all' | 'CCR' | 'RCR' | 'OCR'
  district: string;
  mrtStation: string;
  maxMrtWalkMinutes: number; // 5, 10, 15, or 0 (any)
  primarySchool: string;
  schoolProximity: '1km' | '2km' | 'any';
  expressway: string;
  minPrice: number;
  maxPrice: number;
  minPsf: number;
  maxPsf: number;
  bedrooms: number[];
  tenure: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'psf_asc' | 'mrt_proximity' | 'top_date';
}
