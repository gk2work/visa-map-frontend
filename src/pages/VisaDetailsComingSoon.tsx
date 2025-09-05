import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { VisaMonkLogo } from "@/components/VisaMonkLogo";
import { VisaFlowState } from "@/types/visa";

interface VisaDetailsComingSoonProps {
  onBack: () => void;
  flowState: VisaFlowState;
}

const getCountryName = (code: string | null) => {
  const countries: Record<string, string> = {
    "IN": "India",
    "GB": "United Kingdom",
    "US": "United States",
    "CA": "Canada",
    "AU": "Australia",
    "DE": "Germany",
    "FR": "France",
    "NL": "Netherlands",
    "SG": "Singapore",
    "NZ": "New Zealand",
    "IE": "Ireland",
    "IT": "Italy",
    "ES": "Spain",
    "SE": "Sweden",
    "NO": "Norway",
    "DK": "Denmark",
    "FI": "Finland",
    "CH": "Switzerland",
    "AT": "Austria",
    "BE": "Belgium",
    "LU": "Luxembourg",
    "JP": "Japan",
    "KR": "South Korea",
    "HK": "Hong Kong",
    "MY": "Malaysia",
    "TH": "Thailand",
    "ID": "Indonesia",
    "PH": "Philippines",
    "VN": "Vietnam",
    "BD": "Bangladesh",
    "PK": "Pakistan",
    "LK": "Sri Lanka",
    "NP": "Nepal",
    "BT": "Bhutan",
    "MV": "Maldives",
    "AE": "United Arab Emirates",
    "SA": "Saudi Arabia",
    "QA": "Qatar",
    "KW": "Kuwait",
    "BH": "Bahrain",
    "OM": "Oman",
    "JO": "Jordan",
    "LB": "Lebanon",
    "EG": "Egypt",
    "MA": "Morocco",
    "TN": "Tunisia",
    "DZ": "Algeria",
    "ZA": "South Africa",
    "KE": "Kenya",
    "UG": "Uganda",
    "TZ": "Tanzania",
    "RW": "Rwanda",
    "ET": "Ethiopia",
    "GH": "Ghana",
    "NG": "Nigeria",
    "BR": "Brazil",
    "AR": "Argentina",
    "CL": "Chile",
    "CO": "Colombia",
    "PE": "Peru",
    "MX": "Mexico"
  };
  return countries[code || ""] || code || "Unknown";
};

export default function VisaDetailsComingSoon({ onBack, flowState }: VisaDetailsComingSoonProps) {
  const fromCountryName = getCountryName(flowState.fromCountry);
  const toCountryName = getCountryName(flowState.toCountry);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <VisaMonkLogo />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">Coming Soon</CardTitle>
              <p className="text-muted-foreground mt-2">
                The visa flow for {fromCountryName} → {toCountryName} is currently under development
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Selected Route</h3>
              <div className="flex items-center justify-center space-x-3 text-sm">
                <span className="font-medium text-foreground">{fromCountryName}</span>
                <div className="w-8 h-px bg-border" />
                <span className="text-muted-foreground">to</span>
                <div className="w-8 h-px bg-border" />
                <span className="font-medium text-foreground">{toCountryName}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                We're working hard to bring you comprehensive visa guidance for this route.
              </p>
              <p className="text-sm text-muted-foreground">
                In the meantime, you can try selecting India → United Kingdom for a complete visa flow experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={onBack} variant="outline">
                Select Different Countries
              </Button>
              <Button 
                onClick={() => window.open('https://visamonk.com', '_blank')} 
                variant="default"
              >
                Visit VisaMonk.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}