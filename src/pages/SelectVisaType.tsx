import { useState, useEffect } from "react";
import { ArrowRight, Clock, DollarSign, Calendar, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Navbar } from "@/components/Navbar";
import { VisaMonkLogo } from "@/components/VisaMonkLogo";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { VisaType, PersonalizationData } from "@/types/visa";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getVisaTypesByRoute, VisaType as ApiVisaType } from "@/lib/api";

const studentVisaTypes: VisaType[] = [
  {
    id: "student-visa",
    name: "Student visa",
    description: "For full-time study at a licensed UK student sponsor institution",
    category: "Long-term study",
    processingTime: "3-6 weeks",
    fee: "£524",
  },
  {
    id: "child-student-visa",
    name: "Child Student visa",
    description: "For children aged 4-17 studying at independent schools",
    category: "Child education",
    processingTime: "3-6 weeks", 
    fee: "£524",
  },
  {
    id: "short-term-study",
    name: "Short-term study visa",
    description: "English language courses lasting 6-11 months",
    category: "Language study",
    processingTime: "3 weeks",
    fee: "£200",
  },
  {
    id: "standard-visitor-study",
    name: "Standard Visitor (study)",
    description: "Short courses up to 6 months without visa requirement",
    category: "Short courses",
    processingTime: "3 weeks",
    fee: "£115",
  },
];

interface SelectVisaTypeProps {
  onNext: (visaType: string, personalization: PersonalizationData) => void;
  onBack: () => void;
  flowState: {
    fromCountry: string | null;
    toCountry: string | null;
    userType: string | null;
  };
}

export default function SelectVisaType({ onNext, onBack, flowState }: SelectVisaTypeProps) {
  const [showPersonalizationModal, setShowPersonalizationModal] = useState(false);
  const [showCASInfoModal, setShowCASInfoModal] = useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState<string>("");
  const [hasCAS, setHasCAS] = useState<string>("");
  const [casDate, setCasDate] = useState<Date>();
  
  // Dynamic visa types state
  const [visaTypes, setVisaTypes] = useState<ApiVisaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Load visa types based on route and user type
  useEffect(() => {
    const loadVisaTypes = async () => {
      if (!flowState.fromCountry || !flowState.toCountry || !flowState.userType) {
        setError("Missing route or user type information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        const apiVisaTypes = await getVisaTypesByRoute(
          flowState.fromCountry, 
          flowState.toCountry, 
          flowState.userType
        );
        
        setVisaTypes(apiVisaTypes);
        
        // If no visa types found from API, use fallback data
        if (apiVisaTypes.length === 0) {
          console.warn('No visa types found from API, using fallback data');
          // Convert fallback data to API format
          const fallbackApiTypes: ApiVisaType[] = studentVisaTypes.map(visa => ({
            _id: visa.id,
            name: visa.name,
            code: visa.id,
            category: visa.category,
            originCountry: flowState.fromCountry!,
            destinationCountry: flowState.toCountry!,
            description: visa.description,
            overview: visa.description,
            eligibility: [],
            processingTime: {
              min: 3,
              max: 6,
              unit: 'weeks'
            },
            fees: {
              visaFee: {
                amount: parseInt(visa.fee.replace(/[£$]/g, '')),
                currency: 'GBP'
              }
            },
            requirements: {
              documents: []
            },
            applicationProcess: {
              steps: [],
              applicationMethod: 'online',
              interviewRequired: false
            },
            officialLinks: [],
            commonMistakes: [],
            personalization: {
              casRequired: visa.id === 'student-visa',
              atasRequired: false,
              tbTestRequired: false
            }
          }));
          setVisaTypes(fallbackApiTypes);
        }
        
      } catch (error) {
        console.error('Failed to load visa types:', error);
        setError("Failed to load visa types. Please try again.");
        
        // Use fallback data on error
        const fallbackApiTypes: ApiVisaType[] = studentVisaTypes.map(visa => ({
          _id: visa.id,
          name: visa.name,
          code: visa.id,
          category: visa.category,
          originCountry: flowState.fromCountry!,
          destinationCountry: flowState.toCountry!,
          description: visa.description,
          overview: visa.description,
          eligibility: [],
          processingTime: {
            min: 3,
            max: 6,
            unit: 'weeks'
          },
          fees: {
            visaFee: {
              amount: parseInt(visa.fee.replace(/[£$]/g, '')),
              currency: 'GBP'
            }
          },
          requirements: {
            documents: []
          },
          applicationProcess: {
            steps: [],
            applicationMethod: 'online',
            interviewRequired: false
          },
          officialLinks: [],
          commonMistakes: [],
          personalization: {
            casRequired: visa.id === 'student-visa',
            atasRequired: false,
            tbTestRequired: false
          }
        }));
        setVisaTypes(fallbackApiTypes);
      } finally {
        setLoading(false);
      }
    };

    loadVisaTypes();
  }, [flowState.fromCountry, flowState.toCountry, flowState.userType]);

  const handleVisaSelection = (visaId: string) => {
    setSelectedVisaType(visaId);
    setShowPersonalizationModal(true);
  };

  const handlePersonalizationSubmit = () => {
    const personalizationData: PersonalizationData = {
      hasCAS: hasCAS === "yes",
      casDate: hasCAS === "yes" && casDate ? format(casDate, "dd/MM/yyyy") : undefined,
    };
    
    setShowPersonalizationModal(false);
    onNext(selectedVisaType, personalizationData);
  };

  const handleCancel = () => {
    setShowPersonalizationModal(false);
    setSelectedVisaType("");
    setHasCAS("");
    setCasDate(undefined);
  };

  const canSubmit = hasCAS && (hasCAS === "no" || (hasCAS === "yes" && casDate));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col items-center mb-6 lg:mb-8">
          <VisaMonkLogo className="mb-6 lg:mb-8 animate-fade-in" />
          
          <ProgressIndicator 
            currentStep={3} 
            totalSteps={4} 
            steps={["Countries", "User Type", "Visa Type", "Details"]}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Choose your student visa type
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Select the visa category that matches your study plans in the United Kingdom.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {loading ? (
              <div className="col-span-2 flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-lg text-muted-foreground">Loading visa types...</span>
                </div>
              </div>
            ) : error ? (
              <div className="col-span-2 flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              visaTypes.map((visa) => {
                const isPrimary = visa.code === "student-visa" || visa.category === "student";
                const isDisabled = false; // All visa types are now enabled
                
                // Format processing time
                const processingTime = visa.processingTime.min === visa.processingTime.max 
                  ? `${visa.processingTime.min} ${visa.processingTime.unit}`
                  : `${visa.processingTime.min}-${visa.processingTime.max} ${visa.processingTime.unit}`;
                
                // Format fee
                const fee = `${visa.fees.visaFee.currency} ${visa.fees.visaFee.amount}`;
              
                return (
                  <Button
                    key={visa._id}
                    variant="card"
                    onClick={() => !isDisabled && handleVisaSelection(visa._id)}
                    disabled={isDisabled}
                    className={`relative transition-all duration-300 p-4 lg:p-6 h-auto ${
                      isDisabled 
                        ? "opacity-60 cursor-not-allowed hover:ring-0 hover:shadow-none hover:scale-100" 
                        : "hover:ring-2 hover:ring-primary hover:shadow-branded hover:scale-105"
                    } ${
                      isPrimary 
                        ? "border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5" 
                        : ""
                    }`}
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2">
                            {visa.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge 
                              variant={isPrimary ? "default" : "secondary"}
                            >
                              {visa.category}
                            </Badge>
                            {isDisabled && (
                              <Badge variant="outline" className="text-muted-foreground">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                        {isPrimary && (
                          <Badge variant="destructive" className="bg-accent text-accent-foreground">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed text-left">
                        {visa.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {processingTime}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <DollarSign className="w-4 h-4" />
                          {fee}
                        </div>
                      </div>
                  </div>
                  </Button>
                );
              })
            )}
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={onBack}
              variant="outline" 
              size="lg"
              className="h-12 px-8"
            >
              Back
            </Button>
          </div>
        </div>

        {/* Personalization Modal */}
        <Dialog open={showPersonalizationModal} onOpenChange={setShowPersonalizationModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Personalize your journey</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">
                    Have you received your CAS and unconditional offer letter? *
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCASInfoModal(true)}
                    className="p-1 h-auto hover:bg-muted/50"
                  >
                    <Info className="w-4 h-4 text-primary hover:text-primary/80" />
                  </Button>
                </div>
                <RadioGroup value={hasCAS} onValueChange={setHasCAS}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="cas-yes" />
                    <Label htmlFor="cas-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cas-no" />
                    <Label htmlFor="cas-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {hasCAS === "yes" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Date received *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !casDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {casDate ? format(casDate, "dd/MM/yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={casDate}
                        onSelect={setCasDate}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handlePersonalizationSubmit} 
                  disabled={!canSubmit}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* CAS Information Modal */}
        <Dialog open={showCASInfoModal} onOpenChange={setShowCASInfoModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>What is CAS (Confirmation of Acceptance for Studies)?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                CAS is a unique reference number issued by a UK university that confirms you have an offer to study at that institution.
              </p>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Why is CAS needed?</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    It's required to apply for your UK Student Visa. The CAS confirms that the university has accepted you as a student and that you meet all the entry requirements for your course.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">How do you get a CAS?</h4>
                  <ul className="text-sm space-y-1 leading-relaxed text-muted-foreground ml-4">
                    <li>• After receiving your unconditional offer letter from a UK university, you will request a CAS number.</li>
                    <li>• The university will issue the CAS after confirming your academic qualifications and proof of funds.</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                <p className="text-sm font-medium text-destructive">
                  Important: You cannot apply for a UK student visa without a CAS.
                </p>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowCASInfoModal(false)}>
                  Got it
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}