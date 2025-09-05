import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Rocket } from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromCountry: string;
  toCountry: string;
}

export function ComingSoonModal({ isOpen, onClose, fromCountry, toCountry }: ComingSoonModalProps) {
  if (!isOpen) return null;

  const getCountryName = (code: string) => {
    const countries: { [key: string]: string } = {
      "IN": "India",
      "NG": "Nigeria", 
      "US": "United States",
      "GB": "United Kingdom",
      "CA": "Canada",
      "AU": "Australia",
      "DE": "Germany",
      "FR": "France",
      "JP": "Japan",
      "SG": "Singapore",
      "AE": "UAE",
      "CH": "Switzerland"
    };
    return countries[code] || code;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Coming Soon!
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 hover:bg-muted/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl mb-4">
            😢→😊
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {getCountryName(fromCountry)} → {getCountryName(toCountry)} Journey
            </h3>
            <p className="text-muted-foreground">
              We're working hard to bring this visa journey soon! 🚀
            </p>
            <p className="text-muted-foreground mt-2">
              Stay tuned for comprehensive guidance on your dream destination.
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-primary font-medium">
              💡 Currently available: India → UK visa guidance
            </p>
          </div>
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-hero hover:bg-gradient-hero/90 text-white"
          >
            Explore Available Routes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}