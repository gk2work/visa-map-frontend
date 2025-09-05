import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfficialLink } from "@/types/visa";

const officialLinks: OfficialLink[] = [
  {
    id: "apply-online",
    title: "Apply online — UK Student visa (outside UK)",
    url: "https://www.gov.uk/student-visa/apply",
    description: "Official UK government visa application portal",
  },
  {
    id: "maintenance-money",
    title: "Money you need (maintenance & evidence formats)",
    url: "https://www.gov.uk/student-visa/money",
    description: "Financial requirements and acceptable evidence",
  },
  {
    id: "ihs-calculator",
    title: "IHS — how much you pay",
    url: "https://www.immigration-health-surcharge.service.gov.uk/checker/type",
    description: "Calculate your Immigration Health Surcharge",
  },
  {
    id: "english-knowledge",
    title: "Knowledge of English (levels & how to prove)",
    url: "https://www.gov.uk/student-visa/knowledge-of-english",
    description: "English language requirements and accepted tests",
  },
  {
    id: "tb-clinics",
    title: "TB clinics in India (approved list)",
    url: "https://www.gov.uk/tb-test-visa/approved-test-centres",
    description: "Find approved tuberculosis testing centers",
  },
  {
    id: "atas-guidance",
    title: "ATAS guidance",
    url: "https://www.gov.uk/guidance/academic-technology-approval-scheme",
    description: "Academic Technology Approval Scheme information",
  },
  {
    id: "vfs-centers",
    title: "Find a UK visa application centre (India • VFS)",
    url: "https://www.vfsglobal.co.uk/in/en",
    description: "Visa application centers and biometric appointments",
  },
  {
    id: "evisa-account",
    title: "eVisa / UKVI account (manage status)",
    url: "https://www.gov.uk/manage-your-uk-visa",
    description: "Access your digital visa and status updates",
  },
];

export function OfficialLinksPanel() {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Official Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-96 overflow-y-auto space-y-3">
          {officialLinks.map((link) => (
            <Button
              key={link.id}
              variant="outline"
              className="w-full justify-start h-auto p-3 text-left"
              onClick={() => window.open(link.url, "_blank")}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 mr-2">
                  <div className="font-medium text-sm leading-tight mb-1">
                    {link.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {link.description}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}