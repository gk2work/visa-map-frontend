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

export const saveProgress = async (payload: ProgressData) => {
  // This would normally call a backend API
  // For now, store in localStorage
  try {
    const existingData = localStorage.getItem('visamap_progress');
    const data = existingData ? JSON.parse(existingData) : {};
    
    // Update with new payload
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
  } catch (error) {
    console.error('Failed to save progress:', error);
    return { success: false, error };
  }
};

export const loadProgress = async (email: string): Promise<ProgressData | null> => {
  try {
    const existingData = localStorage.getItem('visamap_progress');
    if (!existingData) return null;
    
    const data = JSON.parse(existingData);
    return data[email] || null;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
};