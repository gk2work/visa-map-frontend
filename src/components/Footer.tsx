import { VisaMonkLogo } from "@/components/VisaMonkLogo";
import { Mail, Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 shadow-2xl mt-auto">
      <div className="bg-slate-900/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="order-2 md:order-1">
              <VisaMonkLogo className="mb-4" />
            <p className="text-slate-400 text-sm max-w-md">
              Your trusted companion for visa guidance and application support worldwide.
            </p>
            </div>
            
            <div className="flex items-center gap-8 order-1 md:order-2">
              <a
                href="mailto:reet.foreignadmits@gmail.com?subject=VisaMap%20Enquiry%20from%20Student&body=Hello%20Counselor%2C%20I%20would%20like%20to%20know%20more%20about%20my%20visa%20process."
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors font-medium group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Contact Us</span>
              </a>
              <a
                href="/about"
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors font-medium group"
              >
                <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>About</span>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 VisaMap. All rights reserved. | Empowering visa journeys worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}