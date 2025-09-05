import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, CheckCircle2 } from "lucide-react";

interface CASStatusInputProps {
  hasCAS: boolean;
  casDate?: string;
  onUpdate: (hasCAS: boolean, casDate?: string) => void;
}

export function CASStatusInput({ hasCAS, casDate, onUpdate }: CASStatusInputProps) {
  const [showDateInput, setShowDateInput] = useState(hasCAS && !casDate);

  const handleCASResponse = (received: boolean) => {
    if (received) {
      setShowDateInput(true);
      onUpdate(true, casDate);
    } else {
      setShowDateInput(false);
      onUpdate(false, undefined);
    }
  };

  const handleDateSubmit = (date: string) => {
    if (date) {
      onUpdate(true, date);
      setShowDateInput(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <Label className="text-lg font-semibold">Have you received your CAS?</Label>
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button
          variant={hasCAS ? "default" : "outline"}
          onClick={() => handleCASResponse(true)}
          className={hasCAS ? "bg-primary text-primary-foreground" : ""}
        >
          Yes
        </Button>
        <Button
          variant={!hasCAS ? "default" : "outline"}
          onClick={() => handleCASResponse(false)}
          className={!hasCAS ? "bg-primary text-primary-foreground" : ""}
        >
          No
        </Button>
      </div>

      {showDateInput && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">When did you receive your CAS? (DD/MM/YYYY)</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="DD/MM/YYYY"
              className="flex-1"
              onChange={(e) => {
                if (e.target.value) {
                  // Convert from YYYY-MM-DD to DD/MM/YYYY
                  const [year, month, day] = e.target.value.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  handleDateSubmit(formattedDate);
                }
              }}
            />
          </div>
        </div>
      )}

      {hasCAS && casDate && (
        <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary font-medium">
            <Calendar className="w-4 h-4 inline mr-1" />
            CAS received on: {casDate}
          </p>
        </div>
      )}
    </div>
  );
}