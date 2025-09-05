interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between relative px-4">
        {/* Progress line */}
        <div className="absolute top-5 left-6 right-8 h-1 bg-muted/60 rounded-full">
          <div 
            className="h-full bg-gradient-hero transition-all duration-700 ease-smooth rounded-full"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        
        {/* Step indicators */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center relative z-6 min-w-0 flex-1 mx-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-primary text-primary-foreground border-primary shadow-branded"
                    : isCurrent
                    ? "bg-primary text-primary-foreground border-primary shadow-branded ring-2 ring-primary/30"
                    : "bg-card text-muted-foreground border-muted"
                }`}
              >
                {stepNumber}
              </div>
              <span className={`mt-6 text-base font-semibold text-center px-3 leading-tight ${
                isCurrent ? "text-primary" : "text-muted-foreground"
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}