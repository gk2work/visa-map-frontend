import { useState } from "react";
import { ArrowRight, ArrowLeftRight, X, MapPin, Plane } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisaMonkLogo } from "@/components/VisaMonkLogo";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CountryVisaCards } from "@/components/CountryVisaCards";
import { StatsSection } from "@/components/StatsSection";
import { PlaceholderSection } from "@/components/PlaceholderSection";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { Country, UserFormData } from "@/types/visa";
import { Toaster } from "@/components/ui/sonner";
import { saveProgress } from "@/lib/api";

const countries: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
];

const dialingCodes = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
];

interface SelectCountriesProps {
  onNext: (fromCountry: string, toCountry: string, userData: UserFormData) => void;
}

export default function SelectCountries({ onNext }: SelectCountriesProps) {
  const [fromCountry, setFromCountry] = useState<string>("");
  const [toCountry, setToCountry] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showComingSoon, setShowComingSoon] = useState<boolean>(false);
  const [comingSoonCountries, setComingSoonCountries] = useState<{from: string, to: string}>({from: "", to: ""});
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dialingCode: "+91",
  });
  const [formError, setFormError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const handleSwap = () => {
    const temp = fromCountry;
    setFromCountry(toCountry);
    setToCountry(temp);
    setError("");
  };

  const handleContinue = () => {
    if (!fromCountry || !toCountry) {
      setError("Please select both countries");
      return;
    }
    if (fromCountry === toCountry) {
      setError("Origin and destination countries cannot be the same");
      return;
    }
    setError("");
    setShowForm(true);
  };

  const validateEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else if (!email) {
      setEmailError("Email is required");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({ ...prev, mobile: phone }));
  };

  const handleFormSubmit = () => {
    let hasErrors = false;
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError("First name and last name are required");
      hasErrors = true;
    } else {
      setFormError("");
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    } else {
      setEmailError("");
    }
    
    if (!formData.mobile || !validatePhone(formData.mobile)) {
      setFormError("Please enter a valid phone number");
      hasErrors = true;
    }
    
    if (hasErrors) return;
    
    // Save progress
    if (formData.email) {
      const progressData = {
        email: formData.email,
        originCountry: fromCountry,
        destinationCountry: toCountry,
        timestamps: {
          countrySelection: new Date().toISOString()
        }
      };
      saveProgress(progressData);
    }
    
    // Check if this is a supported country combination
    const isSupported = fromCountry === "IN" && toCountry === "GB";
    
    if (!isSupported) {
      setComingSoonCountries({from: fromCountry, to: toCountry});
      setShowComingSoon(true);
      setShowForm(false);
      return;
    }
    
    onNext(fromCountry, toCountry, formData);
  };

  const getCountryDisplayName = (code: string) => {
    const country = countries.find(c => c.code === code);
    if (country && country.code === "GB") {
      return "UK";
    }
    return country?.name || "";
  };

  const getCountryFlag = (code: string) => {
    return countries.find(c => c.code === code)?.flag || "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return false;
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleCountryCardSelect = (countryCode: string) => {
    setToCountry(countryCode);
    // Scroll to country selection section
    document.querySelector('[data-country-selection]')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const getDepartureCountries = () => {
    return countries.filter(country => country.code === "IN" || country.code === "NG");
  };

  const getDestinationCountries = () => {
    if (!fromCountry) return countries;
    return countries.filter(country => country.code !== fromCountry);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-muted/50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col mb-6 lg:mb-8">
          <div className="mb-6 lg:mb-8 animate-fade-in">
            <ProgressIndicator 
              currentStep={1} 
              totalSteps={4} 
              steps={["Countries", "User Type", "Visa Type", "Details"]}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 lg:mb-10">
            <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              Where are you traveling?
            </h1>
            <p className="text-muted-foreground text-lg lg:text-l max-w-1xl mx-auto">
              Select your origin and destination countries to get started with your visa application guide.
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm" data-country-selection>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-semibold text-foreground/90">
                Travel Route Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row items-end gap-6 lg:gap-8 mb-8">
                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <label className="text-base font-semibold text-foreground">
                      Origin Country
                    </label>
                  </div>
                  <Select value={fromCountry} onValueChange={setFromCountry}>
                    <SelectTrigger className="w-full h-14 bg-gradient-to-r from-muted/40 to-muted/30 text-foreground border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="🌍 Select your departure country" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-sm border-border/50">
                      {getDepartureCountries().map((country) => (
                        <SelectItem 
                          key={country.code} 
                          value={country.code}
                          className="hover:bg-primary/5 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="font-medium">{country.code === "GB" ? "UK" : country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center lg:mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSwap}
                    className="w-12 h-12 bg-gradient-hero rounded-full hover:bg-gradient-hero/90 shadow-branded hover:shadow-lg transition-all duration-300 group"
                    aria-label="Swap origin and destination"
                  >
                    <ArrowLeftRight className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
                  </Button>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Plane className="w-5 h-5 text-primary" />
                    <label className="text-base font-semibold text-foreground">
                      Destination Country
                    </label>
                  </div>
                  <Select value={toCountry} onValueChange={setToCountry}>
                    <SelectTrigger className="w-full h-14 bg-gradient-to-r from-muted/40 to-muted/30 text-foreground border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="🎯 Select your destination country" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-sm border-border/50">
                      {getDestinationCountries().map((country) => (
                        <SelectItem 
                          key={country.code} 
                          value={country.code}
                          className="hover:bg-primary/5 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="font-medium">{country.code === "GB" ? "UK" : country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 animate-fade-in">
                  <p className="text-destructive text-sm font-medium text-center">{error}</p>
                </div>
              )}

              <Button 
                onClick={handleContinue}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-hero hover:bg-gradient-hero/90 text-white shadow-branded hover:shadow-lg transition-all duration-300 rounded-xl"
                disabled={!fromCountry || !toCountry}
              >
                Continue Your Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Country Visa Cards Section */}
        <CountryVisaCards onCountrySelect={handleCountryCardSelect} />
        
        {/* Stats Section */}
        <StatsSection />
        
        {/* Placeholder Section */}
        <PlaceholderSection />
      </div>

      {/* Enhanced Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold">Your Information</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 p-0 hover:bg-muted/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    className="mt-1 h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    className="mt-1 h-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Enter email address"
                  className={`mt-1 h-11 ${emailError ? "border-destructive" : ""}`}
                />
                {emailError && (
                  <p className="text-destructive text-xs mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile" className="text-sm font-medium">Mobile/WhatsApp *</Label>
                <div className="flex gap-2 mt-1">
                  <Select 
                    value={formData.dialingCode} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dialingCode: value }))}
                  >
                    <SelectTrigger className="w-32 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dialingCodes.map((dialingCode, index) => (
                        <SelectItem key={`${dialingCode.code}-${index}`} value={dialingCode.code}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{dialingCode.flag}</span>
                            <span>{dialingCode.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Enter mobile number"
                    className="flex-1 h-11"
                  />
                </div>
              </div>

              {(formError || emailError) && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {formError && <p className="text-destructive text-sm font-medium">{formError}</p>}
                  {emailError && <p className="text-destructive text-sm font-medium">{emailError}</p>}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFormSubmit}
                  className="flex-1 h-11 bg-gradient-hero hover:bg-gradient-hero/90 text-white"
                >
                  Register & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        fromCountry={comingSoonCountries.from}
        toCountry={comingSoonCountries.to}
      />
      
      <Toaster />
    </div>
  );
}