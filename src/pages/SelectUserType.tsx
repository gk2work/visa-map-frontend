import { useState } from "react";
import { ArrowRight, GraduationCap, Briefcase, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { VisaMonkLogo } from "@/components/VisaMonkLogo";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { UserType } from "@/types/visa";

const userTypes: UserType[] = [
  {
    id: "student",
    name: "Student",
    description: "Study at universities, colleges, or educational institutions",
    icon: "GraduationCap",
  },
  {
    id: "worker",
    name: "Worker",
    description: "Work temporarily or permanently with valid job offers",
    icon: "Briefcase",
  },
  {
    id: "visitor",
    name: "Visitor",
    description: "Tourism, business meetings, or visiting family and friends",
    icon: "Camera",
  },
];

const iconMap = {
  GraduationCap,
  Briefcase,
  Camera,
};

interface SelectUserTypeProps {
  onNext: (userType: string) => void;
  onBack: () => void;
}

export default function SelectUserType({ onNext, onBack }: SelectUserTypeProps) {
  const [selectedType, setSelectedType] = useState<string>("student");

  const handleContinue = () => {
    if (selectedType) {
      onNext(selectedType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col items-center mb-6 lg:mb-8">
          <VisaMonkLogo className="mb-6 lg:mb-8 animate-fade-in" />
          
          <ProgressIndicator 
            currentStep={2} 
            totalSteps={4} 
            steps={["Countries", "User Type", "Visa Type", "Details"]}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              What's your purpose of travel?
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Choose the category that best describes your intended visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {userTypes.map((type) => {
              const IconComponent = iconMap[type.icon as keyof typeof iconMap];
              const isSelected = selectedType === type.id;
              const isEnabled = type.id === "student"; // Only student enabled for v1
              
              return (
                <div
                  key={type.id}
                  className={`relative transition-all duration-300 border rounded-lg bg-card text-card-foreground shadow-sm ${
                    isSelected 
                      ? "ring-2 ring-primary shadow-branded" 
                      : ""
                  } ${
                    !isEnabled 
                      ? "opacity-50 cursor-not-allowed" 
                      : "cursor-pointer hover:shadow-md"
                  }`}
                  onClick={() => isEnabled && setSelectedType(type.id)}
                >
                  <div className="p-6 flex flex-col items-center text-center space-y-4 min-h-[200px]">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="w-full">
                      <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2">
                        {type.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                    {!isEnabled && (
                      <div className="absolute top-3 right-3 bg-warning text-warning-foreground text-xs px-2 py-1 rounded-full font-medium">
                        Coming Soon
                      </div>
                    )}
                  </div>
                  {isSelected && isEnabled && (
                    <div className="border-t border-border p-4">
                      <div className="flex gap-3">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onBack();
                          }}
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinue();
                          }}
                          size="sm"
                          className="flex-1"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}