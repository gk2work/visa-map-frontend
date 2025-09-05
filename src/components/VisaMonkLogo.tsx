import { Compass } from "lucide-react";

interface VisaMonkLogoProps {
  className?: string;
  showText?: boolean;
}

export function VisaMonkLogo({ className = "", showText = true }: VisaMonkLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center shadow-branded">
        <Compass className="w-6 h-6 text-white" />
      </div>
      {showText && (
        <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          VisaMap
        </span>
      )}
    </div>
  );
}