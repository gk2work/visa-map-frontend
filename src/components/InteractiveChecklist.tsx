import { useState, useEffect } from "react";
import { Check, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserFormData, PersonalizationData } from "@/types/visa";
import { jsPDF } from 'jspdf';

const defaultChecklist = [
  "Got Unconditional Offer and CAS issued",
  "ATAS obtained (if required)",
  "TB certificate obtained (if required)",
  "Financial evidence prepared (maintenance + tuition shortfall; correct format/recency)",
  "Online application submitted (Student visa, outside UK)",
  "Visa fee £524 + IHS £776/year paid",
  "Identity verified (ID Check app or VFS biometrics)",
  "All documents uploaded / VFS scanning done",
  "Interview attended (only if UKVI asks)",
  "Decision received; UKVI account set up; eVisa accessible",
  "Travel booked (on/after visa start; ≤1 month before course start)",
];

interface InteractiveChecklistProps {
  userFormData?: UserFormData | null;
  personalizationData?: PersonalizationData | null;
  allTabsVisited?: boolean;
  stepDetails?: Array<{
    id: string;
    title: string;
    action: string;
    documents: string;
    links: Array<{ title: string; url: string }>;
  }>;
}

export function InteractiveChecklist({ userFormData, personalizationData, allTabsVisited = false, stepDetails = [] }: InteractiveChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  // Listen for external updates from timeline steps
  useEffect(() => {
    const handleChecklistUpdate = (event: CustomEvent) => {
      const { index, checked } = event.detail;
      setCheckedItems(prev => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(index);
        } else {
          newSet.delete(index);
        }
        return newSet;
      });
      
      // Also update checklistState for persistence
      setChecklistState(prev => ({
        ...prev,
        [index.toString()]: checked
      }));
    };

    window.addEventListener('updateChecklist', handleChecklistUpdate as EventListener);
    return () => window.removeEventListener('updateChecklist', handleChecklistUpdate as EventListener);
  }, []);

  const handleItemToggle = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  const progress = Math.round((checkedItems.size / defaultChecklist.length) * 100);

  const handleExportPDF = () => {
    if (!allTabsVisited) return;

    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;

    // Helper function to add text with word wrapping and page breaks
    const addText = (text: string, fontSize = 10, isBold = false, leftMargin = 20) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }

      const lines = doc.splitTextToSize(text, 170);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, leftMargin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Header
    addText("UK STUDENT VISA - PERSONALIZED CHECKLIST", 16, true);
    yPosition += 5;
    
    // User information
    if (userFormData) {
      addText("Applicant Information:", 12, true);
      addText(`Name: ${userFormData.firstName} ${userFormData.lastName}`);
      if (userFormData.email) {
        addText(`Email: ${userFormData.email}`);
      }
      if (userFormData.mobile) {
        addText(`Mobile/WhatsApp: ${userFormData.mobile}`);
      }
      if (personalizationData) {
        addText(`CAS/Unconditional offer received: ${personalizationData.hasCAS ? 'Yes' : 'No'}`);
        if (personalizationData.casDate) {
          addText(`Date received: ${personalizationData.casDate}`);
        }
      }
      yPosition += 10;
    }

    // Get unchecked items
    const uncheckedItems = defaultChecklist
      .map((item, index) => ({ item, index, checked: checkedItems.has(index) }))
      .filter(({ checked }) => !checked);

    // Remaining tasks section
    addText("REMAINING TASKS - DETAILED INSTRUCTIONS", 14, true);
    yPosition += 5;
    
    if (uncheckedItems.length === 0) {
      addText("🎉 CONGRATULATIONS! All checklist items have been completed.");
      yPosition += 10;
    } else {
      addText(`You have ${uncheckedItems.length} remaining tasks to complete:`);
      yPosition += 5;
      
      uncheckedItems.forEach(({ item, index }, i) => {
        addText(`${i + 1}. ❌ ${item}`, 11, true);
        
        // Map checklist items to step details
        const stepMapping: { [key: number]: string } = {
          0: "cas", 1: "atas", 2: "tb-test", 3: "financial-docs",
          4: "visa-application", 5: "visa-application", 6: "visa-application",
          7: "visa-application", 8: "decision", 9: "decision", 10: "decision",
        };

        const relatedStepId = stepMapping[index];
        const relatedStep = stepDetails.find(step => step.id === relatedStepId);
        
        if (relatedStep) {
          addText("📋 DETAILED INSTRUCTIONS:", 10, true, 30);
          addText(`Step: ${relatedStep.title}`, 10, false, 30);
          yPosition += 2;
          
          // Clean HTML content
          const cleanedAction = relatedStep.action
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\n\s*\n/g, '\n')
            .trim();
          
          const cleanedDocs = relatedStep.documents
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\n\s*\n/g, '\n')
            .trim();

          addText(cleanedAction, 10, false, 30);
          
          if (cleanedDocs) {
            yPosition += 2;
            addText("📄 REQUIRED DOCUMENTS:", 10, true, 30);
            addText(cleanedDocs, 10, false, 30);
          }
          
          if (relatedStep.links.length > 0) {
            yPosition += 2;
            addText("🔗 OFFICIAL LINKS:", 10, true, 30);
            relatedStep.links.forEach(link => {
              addText(`• ${link.title}: ${link.url}`, 10, false, 30);
            });
          }
        }
        
        yPosition += 10;
      });
    }

    // Completed tasks section
    if (checkedItems.size > 0) {
      addText("COMPLETED TASKS", 12, true);
      yPosition += 2;
      defaultChecklist.forEach((item, index) => {
        if (checkedItems.has(index)) {
          addText(`✅ ${item}`);
        }
      });
      yPosition += 10;
    }

    // Quick reference checklist
    addText("QUICK REFERENCE CHECKLIST", 12, true);
    yPosition += 2;
    defaultChecklist.forEach((item, index) => {
      addText(`${checkedItems.has(index) ? "✅" : "❌"} ${item}`);
    });

    yPosition += 10;
    addText("---", 10, false);
    addText("Generated by VisaMonk - Your UK Student Visa Guide");
    addText(`Date: ${new Date().toLocaleDateString()}`);

    // Save the PDF
    doc.save(`uk-student-visa-personalized-checklist-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // You could also implement a proper share dialog here
  };

  return (
    <TooltipProvider>
      <Card className="top-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Checklist</span>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    disabled={!allTabsVisited}
                    className="px-3"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{allTabsVisited ? "Download personalized checklist PDF" : "Visit all tabs to download the PDF"}</p>
                </TooltipContent>
              </Tooltip>
              <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold">
                {progress}%
              </div>
            </div>
          </CardTitle>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-hero h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {defaultChecklist.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Checkbox
                  id={`checklist-${index}`}
                  checked={checkedItems.has(index)}
                  onCheckedChange={() => handleItemToggle(index)}
                  className="mt-1"
                />
                <label
                  htmlFor={`checklist-${index}`}
                  className={`text-sm leading-relaxed cursor-pointer ${
                    checkedItems.has(index) ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}