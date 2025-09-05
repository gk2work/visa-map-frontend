import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, Circle } from "lucide-react";
import { StepDetailsModal } from "./StepDetailsModal";
import { useState } from "react";

export type StepStatus = "completed" | "in-progress" | "pending" | "due-soon" | "blocked";

interface TimelineStepProps {
  id: string;
  title: string;
  status: StepStatus;
  dueBy?: string;
  description?: string;
  action?: string;
  documents?: string;
  links?: Array<{ url: string; title: string; description?: string }>;
  onMarkComplete?: (stepId: string) => void;
}

const statusConfig = {
  completed: {
    color: "bg-green-500 text-white",
    icon: CheckCircle2,
    label: "Completed"
  },
  "in-progress": {
    color: "bg-primary text-primary-foreground",
    icon: Clock,
    label: "In Progress"
  },
  pending: {
    color: "bg-muted text-muted-foreground",
    icon: Circle,
    label: "Pending"
  },
  "due-soon": {
    color: "bg-amber-500 text-white",
    icon: AlertTriangle,
    label: "Due Soon"
  },
  blocked: {
    color: "bg-destructive text-destructive-foreground",
    icon: AlertTriangle,
    label: "Blocked"
  }
};

export function TimelineStep({ 
  id, 
  title, 
  status, 
  dueBy, 
  description, 
  action,
  documents,
  links = [],
  onMarkComplete
}: TimelineStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const config = statusConfig[status];
  const Icon = config.icon;
  const hasDetailedContent = action || documents || links.length > 0;
  const isCompleted = status === "completed";

  return (
    <>
      <div className="border border-border rounded-lg mb-4">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">{title}</h3>
                {hasDetailedContent && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="h-auto p-0 text-primary hover:underline text-sm font-normal"
                  >
                    Explore more
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge className={config.color}>
                  {config.label}
                </Badge>
                {dueBy && (
                  <Badge variant="outline" className="text-xs">
                    Due by: {dueBy}
                  </Badge>
                )}
              </div>
              
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {hasDetailedContent && (
        <StepDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          step={{
            id,
            title,
            status,
            dueBy,
            description,
            action,
            documents,
            links
          }}
          onMarkComplete={onMarkComplete}
        />
      )}
    </>
  );
}