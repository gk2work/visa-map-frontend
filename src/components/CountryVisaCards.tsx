import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, DollarSign, FileText, Users, Clock } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface VisaRequirement {
  icon: any;
  text: string;
  highlight?: boolean;
  isLink?: boolean;
}

interface CountryCard {
  country: string;
  flag: string;
  image: string;
  requirements: VisaRequirement[];
  visaFee: string;
  processingTime: string;
}

const countryData: CountryCard[] = [
  {
    country: "United States",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=240&fit=crop",
    visaFee: "$185",
    processingTime: "3-5 weeks",
    requirements: [
      { icon: DollarSign, text: "US visa application fee: $185" },
      { icon: FileText, text: "DS-160 form completion required" },
      { icon: Users, text: "US visa interview practice with VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "SEVIS fee for student visas" },
    ]
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=240&fit=crop",
    visaFee: "£115",
    processingTime: "3 weeks",
    requirements: [
      { icon: DollarSign, text: "UK standard visitor visa: £115" },
      { icon: FileText, text: "CAS Letter from UK institution" },
      { icon: Users, text: "UK visa interview preparation via VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "IELTS/UKVI test requirements" },
    ]
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=240&fit=crop",
    visaFee: "CAD $150",
    processingTime: "2-4 weeks",
    requirements: [
      { icon: DollarSign, text: "Canada visitor visa fee: CAD $150" },
      { icon: FileText, text: "GIC Account setup required" },
      { icon: Users, text: "Canada visa interview practice with VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "Biometrics enrollment mandatory" },
    ]
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=240&fit=crop",
    visaFee: "€80",
    processingTime: "15 days",
    requirements: [
      { icon: DollarSign, text: "Germany Schengen visa fee: €80" },
      { icon: FileText, text: "APS Certificate from German institution" },
      { icon: Users, text: "German consulate interview prep with VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "Blocked account (Sperrkonto) proof" },
    ]
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop",
    visaFee: "AUD $650",
    processingTime: "1-4 weeks",
    requirements: [
      { icon: DollarSign, text: "Australia student visa fee: AUD $650" },
      { icon: FileText, text: "COE (Confirmation of Enrollment)" },
      { icon: Users, text: "Australia visa interview skills with VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "OSHC health insurance required" },
    ]
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=240&fit=crop",
    visaFee: "Free",
    processingTime: "5-7 days",
    requirements: [
      { icon: DollarSign, text: "Japan tourist visa: No fee required" },
      { icon: FileText, text: "COE (Certificate of Eligibility)" },
      { icon: Users, text: "Japan visa cultural training via VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "JLPT proficiency test scores" },
    ]
  },
  {
    country: "France",
    flag: "🇫🇷",
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=240&fit=crop",
    visaFee: "€99",
    processingTime: "15 days",
    requirements: [
      { icon: DollarSign, text: "France student visa fee: €99" },
      { icon: FileText, text: "Campus France registration" },
      { icon: Users, text: "French consulate prep with VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "TCF/TEF French language test" },
    ]
  },
  {
    country: "Singapore",
    flag: "🇸🇬",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=240&fit=crop",
    visaFee: "SGD $90",
    processingTime: "3 days",
    requirements: [
      { icon: DollarSign, text: "Singapore student pass fee: SGD $90" },
      { icon: FileText, text: "IPA (In-Principle Approval) letter" },
      { icon: Users, text: "Singapore entry interview prep via VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "MOE tuition grant eligibility" },
    ]
  },
  {
    country: "Dubai (UAE)",
    flag: "🇦🇪",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=240&fit=crop",
    visaFee: "AED 3,000",
    processingTime: "3-4 days",
    requirements: [
      { icon: DollarSign, text: "UAE student visa fee: AED 3,000" },
      { icon: FileText, text: "UAE university admission letter" },
      { icon: Users, text: "UAE cultural etiquette training with VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "IELTS/TOEFL scores required" },
    ]
  },
  {
    country: "Switzerland",
    flag: "🇨🇭",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop",
    visaFee: "CHF 90",
    processingTime: "8-12 weeks",
    requirements: [
      { icon: DollarSign, text: "Switzerland student visa fee: CHF 90" },
      { icon: FileText, text: "Swiss university acceptance letter" },
      { icon: Users, text: "Swiss embassy interview with VisaMonk", highlight: true, isLink: true },
      { icon: FileText, text: "Financial guarantee CHF 21,000" },
    ]
  },
];

interface CountryVisaCardsProps {
  onCountrySelect?: (countryCode: string) => void;
}

export function CountryVisaCards({ onCountrySelect }: CountryVisaCardsProps) {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const getCountryCode = (countryName: string): string => {
    const countryMap: { [key: string]: string } = {
      "United States": "US",
      "United Kingdom": "GB", 
      "Canada": "CA",
      "Germany": "DE",
      "Australia": "AU",
      "Japan": "JP",
      "France": "FR",
      "Singapore": "SG",
      "Dubai (UAE)": "AE",
      "Switzerland": "CH"
    };
    return countryMap[countryName] || "";
  };

  const handleCardClick = (country: CountryCard) => {
    const countryCode = getCountryCode(country.country);
    if (onCountrySelect) {
      onCountrySelect(countryCode);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Popular Visa Destinations
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Explore visa requirements for top destinations worldwide. Get detailed information about fees, 
            documents, and preparation tips for your dream destination.
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-7xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4">
            {countryData.map((country, index) => (
              <CarouselItem key={country.country} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card 
                  className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-card/95 backdrop-blur-sm overflow-hidden h-full"
                  onClick={() => handleCardClick(country)}
                >
              <div className="relative">
                <img 
                  src={country.image} 
                  alt={`${country.country} landmark`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-3xl bg-white/90 rounded-full p-2 shadow-md">
                  {country.flag}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-bold text-xl">{country.country}</h3>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="font-semibold text-success">{country.visaFee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm text-muted-foreground">{country.processingTime}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {country.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="flex items-start gap-3 text-sm">
                      <req.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        req.highlight ? "text-primary" : "text-muted-foreground"
                      }`} />
                      {req.isLink ? (
                        <a 
                          href="https://www.visamonk.ai/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary"
                        >
                          {req.text}
                        </a>
                      ) : (
                        <span className={req.highlight ? "text-primary font-medium" : "text-foreground/80"}>
                          {req.text}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm mb-4">
            Need help with visa interviews? Practice with VisaMonk's AI-powered platform.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            onClick={() => window.open('https://www.visamonk.ai/', '_blank')}
          >
            Start Your Visa Journey
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}