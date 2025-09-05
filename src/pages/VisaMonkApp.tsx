import { useState } from "react";
import SelectCountries from "./SelectCountries";
import SelectUserType from "./SelectUserType";
import SelectVisaType from "./SelectVisaType";
import VisaDetails from "./VisaDetails";
import VisaDetailsComingSoon from "./VisaDetailsComingSoon";
import { Footer } from "@/components/Footer";
import { VisaFlowState, UserFormData, PersonalizationData } from "@/types/visa";

export default function VisaMonkApp() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowState, setFlowState] = useState<VisaFlowState>({
    fromCountry: null,
    toCountry: null,
    userType: null,
    visaType: null,
  });
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);

  const handleCountriesNext = (fromCountry: string, toCountry: string, userData: UserFormData) => {
    setFlowState(prev => ({
      ...prev,
      fromCountry,
      toCountry,
    }));
    setUserFormData(userData);
    setCurrentStep(2);
  };

  const handleUserTypeNext = (userType: string) => {
    setFlowState(prev => ({
      ...prev,
      userType,
    }));
    setCurrentStep(3);
  };

  const handleVisaTypeNext = (visaType: string, personalization: PersonalizationData) => {
    setFlowState(prev => ({
      ...prev,
      visaType,
    }));
    setPersonalizationData(personalization);
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setFlowState({
      fromCountry: null,
      toCountry: null,
      userType: null,
      visaType: null,
    });
    setUserFormData(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {(() => {
          switch (currentStep) {
            case 1:
              return <SelectCountries onNext={handleCountriesNext} />;
            case 2:
              return <SelectUserType onNext={handleUserTypeNext} onBack={handleBack} />;
            case 3:
              return <SelectVisaType onNext={handleVisaTypeNext} onBack={handleBack} />;
            case 4:
              // Check if this is the supported India → UK flow
              if (flowState.fromCountry === "IN" && flowState.toCountry === "GB") {
                return <VisaDetails onBack={handleBack} userFormData={userFormData} personalizationData={personalizationData} />;
              } else {
                return <VisaDetailsComingSoon onBack={handleBack} flowState={flowState} />;
              }
            default:
              return <SelectCountries onNext={handleCountriesNext} />;
          }
        })()}
      </div>
      <Footer />
    </div>
  );
}