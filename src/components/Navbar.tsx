import { Button } from "@/components/ui/button";
import { VisaMonkLogo } from "@/components/VisaMonkLogo";
import { Globe, ExternalLink, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <VisaMonkLogo className="flex-shrink-0" />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              About
            </a>
            <a
              href="mailto:reet.foreignadmits@gmail.com?subject=VisaMap%20Enquiry%20from%20Student&body=Hello%20Counselor%2C%20I%20would%20like%20to%20know%20more%20about%20my%20visa%20process."
              className="text-foreground/80 hover:text-foreground transition-colors font-medium px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              Contact Us
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              className="bg-gradient-hero hover:bg-gradient-hero/70 text-white shadow-branded hover:shadow-lg transition-all duration-300 gap-2 px-6 py-3 text-sm font-semibold"
              onClick={() => window.open('https://www.visamonk.ai/', '_blank')}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">Practice your visa interview using VisaMonk</span>
              <span className="md:hidden">Visa Practice</span>
              <ExternalLink className="w-2 h-2" />
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-8">
                  <a
                    href="/"
                    className="text-foreground hover:text-primary transition-colors font-medium text-lg py-3 border-b border-border/20"
                  >
                    Home
                  </a>
                  <a
                    href="/about"
                    className="text-foreground hover:text-primary transition-colors font-medium text-lg py-3 border-b border-border/20"
                  >
                    About
                  </a>
                  <a
                    href="mailto:reet.foreignadmits@gmail.com?subject=VisaMap%20Enquiry%20from%20John%20Doe&body=Hello%20Counselor%2C%20I%20am%20John%20Doe%2C%20I%20would%20like%20to%20know%20more%20about%20my%20visa%20process."
                    className="text-foreground/80 hover:text-foreground transition-colors font-medium px-3 py-2 rounded-lg hover:bg-muted/50"
                  >
                    Contact Us
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}