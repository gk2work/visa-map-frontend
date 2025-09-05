import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Clock, AlertTriangle, Circle, X } from "lucide-react";
import { StepStatus } from "./TimelineStep";

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

interface StepDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: {
    id: string;
    title: string;
    status: StepStatus;
    dueBy?: string;
    description?: string;
    action?: string;
    documents?: string;
    links?: Array<{ url: string; title: string; description?: string }>;
  };
  onMarkComplete?: (stepId: string) => void;
}

export function StepDetailsModal({ isOpen, onClose, step, onMarkComplete }: StepDetailsModalProps) {
  const config = statusConfig[step.status];
  const Icon = config.icon;
  const isCompleted = step.status === "completed";

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete(step.id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold pr-8">
            {step.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Due Date */}
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-primary" />
            <Badge className={config.color}>
              {config.label}
            </Badge>
            {step.dueBy && (
              <Badge variant="outline" className="text-sm">
                Due by: {step.dueBy}
              </Badge>
            )}
          </div>

          {/* Description */}
          {step.description && (
            <div>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          )}

          {/* Action Plan */}
          {step.action && (
            <div>
              <h4 className="font-semibold text-lg mb-3 text-foreground">Action Plan</h4>
              <div 
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: step.action }}
              />
            </div>
          )}
          
          {/* Required Documents */}
          {step.documents && (
            <div>
              <h4 className="font-semibold text-lg mb-3 text-foreground">Required Documents</h4>
              <div 
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: step.documents }}
              />
            </div>
          )}
          
          {/* Official Links */}
          {step.links && step.links.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 text-foreground">Official Links & Resources</h4>
              <div className="space-y-3">
                {step.links.map((link, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      {link.title}
                    </a>
                    {link.description && (
                      <p className="text-sm text-muted-foreground mt-2">{link.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!isCompleted && onMarkComplete && (
            <Button onClick={handleMarkComplete} className="bg-green-500 hover:bg-green-600">
              Mark Complete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}