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

export interface UserType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface VisaType {
  id: string;
  name: string;
  description: string;
  category: string;
  processingTime: string;
  fee: string;
}

export interface VisaFlowState {
  fromCountry: string | null;
  toCountry: string | null;
  userType: string | null;
  visaType: string | null;
}

export interface PersonalizationData {
  hasCAS: boolean;
  casDate?: string; // dd/mm/yyyy format
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  dialingCode?: string;
}

export interface StepData {
  id: string;
  title: string;
  description: string;
  action: string;
  evidence: string;
  completed?: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  description: string;
}

export interface OfficialLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface VisaDetail {
  overview: string;
  eligibility: string[];
  fees: {
    visaFee: string;
    ihsFee: string;
    maintenance: {
      london: string;
      outsideLondon: string;
    };
  };
  steps: StepData[];
  documents: DocumentItem[];
  officialLinks: OfficialLink[];
  commonMistakes: string[];
  checklist: string[];
}