// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Types
export interface Country {
  _id?: string;
  code: string;
  name: string;
  flag: string;
  isOriginCountry?: boolean;
  isDestinationCountry?: boolean;
  supportedUserTypes?: string[];
  dialingCode?: string;
  currency?: {
    code: string;
    symbol: string;
    name: string;
  };
  metadata?: {
    region: string;
    subRegion?: string;
    capital?: string;
  };
}

export interface VisaType {
  _id: string;
  name: string;
  code: string;
  category: string;
  originCountry: string;
  destinationCountry: string;
  description: string;
  overview: string;
  eligibility: string[];
  processingTime: {
    min: number;
    max: number;
    unit: string;
  };
  fees: {
    visaFee: {
      amount: number;
      currency: string;
    };
    additionalFees?: Array<{
      name: string;
      amount: number;
      currency: string;
      description?: string;
      isOptional: boolean;
    }>;
  };
  requirements: {
    documents: Array<{
      _id?: string;
      name: string;
      description: string;
      isRequired: boolean;
      category: string;
      validityPeriod?: string;
      format?: string;
    }>;
    financialEvidence?: {
      maintenanceFunds?: {
        london?: { amount: number; currency: string; period: string };
        outsideLondon?: { amount: number; currency: string; period: string };
      };
    };
  };
  applicationProcess: {
    steps: Array<{
      _id?: string;
      stepNumber: number;
      title: string;
      description: string;
      action: string;
      evidence?: string;
      estimatedTime?: string;
    }>;
    applicationMethod: string;
    interviewRequired: boolean;
  };
  officialLinks: Array<{
    _id?: string;
    title: string;
    url: string;
    description?: string;
    category: string;
  }>;
  commonMistakes?: string[];
  personalization?: {
    casRequired: boolean;
    atasRequired: boolean;
    tbTestRequired: boolean;
  };
}

export interface ProgressData {
  email: string;
  originCountry: string;
  destinationCountry: string;
  userType?: string;
  visaType?: string;
  personalizationData?: {
    hasCAS: boolean;
    casDate?: string;
  };
  checklist?: Record<string, boolean>;
  stepCompletion?: Record<string, boolean>;
  timestamps: Record<string, string>;
}

// API Helper Functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Country API Functions
export const getOriginCountries = async (): Promise<Country[]> => {
  try {
    const response = await apiRequest('/countries/origins');
    return response.data.countries;
  } catch (error) {
    console.error('Failed to fetch origin countries:', error);
    // Fallback to hardcoded data if API fails
    return [
      { code: "IN", name: "India", flag: "🇮🇳", isOriginCountry: true },
      { code: "NG", name: "Nigeria", flag: "🇳🇬", isOriginCountry: true },
    ];
  }
};

export const getDestinationCountries = async (): Promise<Country[]> => {
  try {
    const response = await apiRequest('/countries/destinations');
    return response.data.countries;
  } catch (error) {
    console.error('Failed to fetch destination countries:', error);
    // Fallback to hardcoded data if API fails
    return [
      { code: "GB", name: "United Kingdom", flag: "🇬🇧", isDestinationCountry: true },
      { code: "US", name: "United States", flag: "🇺🇸", isDestinationCountry: true },
      { code: "CA", name: "Canada", flag: "🇨🇦", isDestinationCountry: true },
      { code: "AU", name: "Australia", flag: "🇦🇺", isDestinationCountry: true },
    ];
  }
};

export const checkRouteSupport = async (origin: string, destination: string): Promise<boolean> => {
  try {
    const response = await apiRequest(`/countries/route/${origin}/${destination}`);
    return response.data.isSupported;
  } catch (error) {
    console.error('Failed to check route support:', error);
    // Fallback: only support IN->GB for now
    return origin === 'IN' && destination === 'GB';
  }
};

// Visa Type API Functions
export const getVisaTypesByRoute = async (origin: string, destination: string, category?: string): Promise<VisaType[]> => {
  try {
    const queryParams = category ? `?category=${category}` : '';
    const response = await apiRequest(`/visa-types/route/${origin}/${destination}${queryParams}`);
    return response.data.visaTypes;
  } catch (error) {
    console.error('Failed to fetch visa types:', error);
    return [];
  }
};

export const getVisaTypeById = async (id: string, personalization?: any): Promise<VisaType | null> => {
  try {
    const queryParams = personalization ? `?personalization=${encodeURIComponent(JSON.stringify(personalization))}` : '';
    const response = await apiRequest(`/visa-types/${id}${queryParams}`);
    return response.data.visaType;
  } catch (error) {
    console.error('Failed to fetch visa type:', error);
    return null;
  }
};

export const getVisaRequirements = async (visaTypeId: string, userResponses: any = {}): Promise<any> => {
  try {
    const response = await apiRequest(`/visa-types/${visaTypeId}/requirements`, {
      method: 'POST',
      body: JSON.stringify(userResponses),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch visa requirements:', error);
    return null;
  }
};

export const getVisaChecklist = async (visaTypeId: string, userResponses: any = {}): Promise<any> => {
  try {
    const response = await apiRequest(`/visa-types/${visaTypeId}/checklist`, {
      method: 'POST',
      body: JSON.stringify(userResponses),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch visa checklist:', error);
    return null;
  }
};

// Progress API Functions
export const saveProgress = async (payload: ProgressData) => {
  try {
    // Try to save to backend first
    const response = await apiRequest('/journeys/progress', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to save progress to backend, falling back to localStorage:', error);
    
    // Fallback to localStorage
    try {
      const existingData = localStorage.getItem('visamap_progress');
      const data = existingData ? JSON.parse(existingData) : {};
      
      const updatedData = {
        ...data,
        [payload.email]: {
          ...data[payload.email],
          ...payload,
          lastUpdated: new Date().toISOString()
        }
      };
      
      localStorage.setItem('visamap_progress', JSON.stringify(updatedData));
      return { success: true };
    } catch (localError) {
      console.error('Failed to save progress to localStorage:', localError);
      return { success: false, error: localError };
    }
  }
};

export const loadProgress = async (email: string): Promise<ProgressData | null> => {
  try {
    // Try to load from backend first
    const response = await apiRequest(`/journeys/progress/${encodeURIComponent(email)}`);
    return response.data.progress;
  } catch (error) {
    console.error('Failed to load progress from backend, falling back to localStorage:', error);
    
    // Fallback to localStorage
    try {
      const existingData = localStorage.getItem('visamap_progress');
      if (!existingData) return null;
      
      const data = JSON.parse(existingData);
      return data[email] || null;
    } catch (localError) {
      console.error('Failed to load progress from localStorage:', localError);
      return null;
    }
  }
};