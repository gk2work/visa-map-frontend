import { useState, useEffect } from "react";
import { ArrowLeft, Clock, DollarSign, CheckCircle2, AlertTriangle, ExternalLink, Info } from "lucide-react";
import { CASStatusInput } from "@/components/CASStatusInput";
import { TimelineStep, StepStatus } from "@/components/TimelineStep";
import { saveProgress } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { VisaMonkLogo } from "@/components/VisaMonkLogo";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { InteractiveChecklist } from "@/components/InteractiveChecklist";
import { OfficialLinksPanel } from "@/components/OfficialLinksPanel";
import { UserFormData, PersonalizationData } from "@/types/visa";
import { addDays, addWeeks, format, parse } from "date-fns";
import { STEP_TO_CHECKLIST_MAP } from "@/constants/stepChecklistMapping";

// Extend Window interface for switchToTab function
declare global {
  interface Window {
    switchToTab?: (tabId: string, anchorId?: string) => void;
  }
}

interface VisaDetailsProps {
  onBack: () => void;
  userFormData?: UserFormData | null;
  personalizationData?: PersonalizationData | null;
}

const steps = [
  {
    id: "unconditional-offer",
    title: "Step 1: Conditional Offer Letter → Unconditional Offer Letter",
    action: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">
          Converting to Unconditional Offer Letter 
          <button onclick="window.switchToTab && window.switchToTab('overview', 'conditional-offer')" class="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </h4>
        
        <h4 class="font-semibold text-sm mb-2 text-foreground">How to Convert to Unconditional Offer Letter:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>Once you meet all the conditions outlined in the <strong>Conditional Offer Letter</strong>, the university will convert your offer into an <strong>Unconditional Offer Letter</strong>.</li>
          <li>The conversion to <strong>unconditional</strong> occurs after you submit proof (e.g., passing required exams or providing additional documentation).</li>
        </ul>
        
        <h4 class="font-semibold text-sm mb-2 text-foreground">Where to Submit Documents:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li><strong>Universities</strong> will typically request these documents via email or <strong>student portal</strong>. You'll need to upload them as part of the application or as directed by the university.</li>
        </ul>
      </div>
    `,
    documents: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Documents Required for the Unconditional Offer Letter:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>Proof of academic qualifications</strong> (degree certificates, transcripts).</li>
          <li><strong>Proof of English language proficiency</strong> (IELTS, TOEFL).</li>
          <li><strong>Passport copy</strong> (for identification).</li>
          <li><strong>Reference letters</strong> (if required by the university).</li>
          <li><strong>Financial Documents:</strong> Include proof of maintenance funds (bank statements, sponsor letters, tuition payment receipts) even before CAS request to ensure all prerequisites for unconditional offer are complete.</li>
          <li><strong>Other documents</strong> (e.g., medical reports, police clearance certificates) based on the university's requirements.</li>
        </ul>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    links: []
  },
  {
    id: "atas",
    title: "Step 2: ATAS Certificate (if required)",
    action: `
      <div>
        <div class="mb-4 p-3 bg-muted border border-border rounded-lg">
          <p class="text-sm text-foreground font-medium">
            <strong>Note:</strong> ATAS should be obtained <strong>after receiving the unconditional offer letter</strong> from the university, before submitting the visa application.
          </p>
        </div>
        
        <h4 class="font-semibold text-sm mb-2 text-foreground">
          Who Needs ATAS?
          <button onclick="window.switchToTab && window.switchToTab('overview', 'atas')" class="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </h4>
        <p class="text-sm text-muted-foreground mb-2">Postgraduate students (Masters or PhD) in the following areas:</p>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mb-4">
          <li>Advanced materials</li>
          <li>Aerospace engineering</li>
          <li>Chemical, biological, radiological, or nuclear materials</li>
          <li>Energy and propulsion systems</li>
          <li>Electronics</li>
          <li>Computer science (certain specializations)</li>
          <li>Mathematics and statistics (specific areas)</li>
          <li>Military technology</li>
          <li>Physics</li>
        </ul>
        <p class="text-sm text-muted-foreground mb-4 font-medium"><strong>Check the official ATAS subject list</strong> to confirm if your course requires clearance.</p>

        <h4 class="font-semibold text-sm mb-2 text-foreground">How and Where to Apply</h4>
        <ol class="list-decimal list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>Go to the <strong>official FCDO ATAS portal</strong>: <a href="https://www.gov.uk/academic-technology-approval-scheme" target="_blank" rel="noopener noreferrer" class="text-primary underline">ATAS Application Portal</a></li>
          <li>Complete the <strong>online application form</strong>:
            <ul class="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
              <li>Include all course details, research areas, methodology, and modules.</li>
            </ul>
          </li>
          <li>Upload the <strong>required supporting documents</strong>.</li>
          <li>Submit the application and <strong>wait 20 working days</strong> for processing.</li>
          <li>There is <strong>no fee</strong> for the ATAS application.</li>
        </ol>

        <h4 class="font-semibold text-sm mb-2 text-foreground">Required Documents</h4>
        <p class="text-sm text-muted-foreground mb-2 font-medium"><strong>Mandatory Documents:</strong></p>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Passport copy (personal details page)</li>
          <li>Unconditional offer letter from UK university</li>
          <li>Detailed course description including modules, research areas, methodology</li>
          <li>Academic CV/Resume</li>
          <li>Research proposal (for PhD students)</li>
          <li>Supervisor details (name, contact, research background)</li>
          <li>University details (name, address, contact info)</li>
        </ul>
        <p class="text-sm text-muted-foreground mb-2 font-medium"><strong>Optional / situational:</strong></p>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>Any other documentation requested by the university for ATAS verification</li>
        </ul>

        <h4 class="font-semibold text-sm mb-2 text-foreground">Submission & Approval Process</h4>
        <ol class="list-decimal list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>Submit the online application with <strong>all supporting documents</strong>.</li>
          <li>Wait for <strong>approval or rejection</strong> notification via email.</li>
          <li>If approved, you will receive an <strong>ATAS certificate</strong> with a <strong>reference number</strong>.</li>
          <li>Include this certificate and reference number in your <strong>UK student visa application</strong>.</li>
        </ol>

        <h4 class="font-semibold text-sm mb-2 text-foreground">Important Notes</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>ATAS is only required for <strong>specific postgraduate courses</strong>.</li>
          <li>Always <strong>check the official subject list</strong> before applying.</li>
          <li>Apply <strong>well in advance</strong> to avoid delays in visa processing.</li>
        </ul>
      </div>
    `,
    documents: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Required Documents for ATAS Application:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>Passport copy</strong> (personal details page).</li>
          <li><strong>Unconditional offer letter</strong> from the UK university.</li>
          <li><strong>Detailed course description</strong> including modules, research areas, and methodology.</li>
          <li><strong>Academic CV/Resume</strong> with educational and research background.</li>
          <li><strong>Research proposal</strong> (if applicable for PhD students).</li>
          <li><strong>Supervisor details</strong> (name, contact, research background).</li>
          <li><strong>University details</strong> (name, address, contact information).</li>
        </ul>

         <h4 class="font-semibold text-sm mb-2 text-foreground">Additional Documents/Recommendations:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>Make sure the course description is detailed enough (include modules, methodology, and research areas).</strong></li>
          <li><strong>The research proposal is mandatory only if the course is research-based (e.g., MSc Research, PhD).</strong></li>
          <li><strong>ATAS is only needed for courses in sensitive subjects as per the official subject list.</strong></li>
          <li><strong>No additional documents are typically required beyond these unless the university specifically requests something extra.</strong></li>
        </ul>
        
        <div class="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
          <strong>Important:</strong> ATAS is only required for specific postgraduate courses. Check the official subject list before applying.
        </div>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    links: [
      { title: "ATAS Application Portal", url: "https://www.academic-technology-approval.service.gov.uk/" },
      { title: "Official link", url: "https://www.academic-technology-approval.service.gov.uk/" }
    ]
  }, {
    id: "tb-test",
    title: "Step 3: TB Test",
    action: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">
          TB Test Requirements
          <button onclick="window.switchToTab && window.switchToTab('overview', 'tb-test')" class="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </h4>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">Who Needs a TB Test?</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Students from <strong>India</strong> applying for visas longer than <strong>6 months</strong>.</li>
          <li>Required before submitting your visa application.</li>
        </ul>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">Where to Take the TB Test:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Must be conducted at <strong>Home Office-approved clinics</strong>.</li>
          <li>Find approved clinics using the official government website.</li>
        </ul>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">TB Test Process:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>Book an appointment at an approved clinic.</li>
          <li>Bring your <strong>passport</strong> and <strong>photo ID</strong>.</li>
          <li>Complete the <strong>chest X-ray</strong> and medical examination.</li>
          <li>Receive your <strong>TB certificate</strong> (valid for 6 months).</li>
        </ul>
      </div>
    `,
    documents: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Documents Required for TB Test:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>Passport</strong> (original).</li>
          <li><strong>Photo ID</strong> (driver's license or Aadhaar card).</li>
          <li><strong>Passport-sized photographs</strong> (2-3 copies).</li>
          <li><strong>Clinic appointment confirmation</strong>.</li>
        </ul>
        
        <div class="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
          <strong>Important:</strong> TB test certificate is valid for 6 months from the test date. Plan accordingly.
        </div>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    links: [
      { title: "Official link", url: "https://www.gov.uk/government/publications/tuberculosis-test-for-a-uk-visa-clinics-in-india/tuberculosis-testing-in-india#:~:text=Help%20and%20services%20around%20the,you%20should%20bring%20with%20you" }
    ]
  },
  {
    id: "cas", 
    title: "Step 4: CAS (Confirmation of Acceptance for Studies)",
    action: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">
          CAS Request and Issuance Process 
          <button onclick="window.switchToTab && window.switchToTab('overview', 'cas')" class="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </h4>
        
        <h4 class="font-semibold text-sm mb-2 text-foreground">CAS Request Form Process:</h4>
        <p class="text-sm text-muted-foreground mb-2"><strong>How is the CAS Request Form Sent?</strong></p>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li><strong>Once your Unconditional Offer Letter</strong> is received, you will need to request a <strong>CAS</strong> from the university. The <strong>CAS request form</strong> is typically available on the <strong>university's student portal</strong>.</li>
          <li>If no portal is provided, you can <strong>contact the university's admissions office</strong> or international student office to request the CAS form.</li>
        </ul>
        
        <h4 class="font-semibold text-sm mb-2 text-foreground">Where is the CAS Issued?</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>After submitting the CAS request form with required details, <strong>the university will issue the CAS</strong> number once they've verified all details and required documentation.</li>
          <li>You'll receive the CAS number through <strong>email</strong> or in your <strong>student portal</strong>. This number will be required when applying for the UK student visa.</li>
          <li>You may also have to submit the amount receipt (if any fees apply) as part of the CAS verification.</li>
        </ul>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    documents: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Details Asked in the CAS Request Form:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>Full Name (as per passport)</strong></li>
          <li><strong>Passport details</strong> (number, issue, and expiry date).</li>
          <li><strong>Date of birth</strong>.</li>
          <li><strong>Course details</strong> (program name, duration, tuition fee).</li>
          <li><strong>Proof of previous qualifications</strong>.</li>
          <li><strong>English language test scores</strong> (e.g., IELTS, TOEFL).</li>
          <li><strong>Financial evidence</strong> (bank statement, sponsor letter).</li>
          <li><strong>Accommodation plans</strong> (if required by the university).</li>
        </ul>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    links: []
  },
  {
    id: "visa-application",
    title: "Step 5: Apply Online for Your UK Student Visa",
    action: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Step 4.1: Online Application (UKVI Form & Submission)</h4>
        <p class="text-sm text-muted-foreground mb-3"><strong>Goal:</strong> Complete UKVI student visa form and pay fees.</p>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">Actions:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Visit official <a href="https://www.gov.uk/apply-uk-visa" target="_blank" rel="noopener noreferrer" class="text-primary underline">UKVI Apply for a UK Visa</a></li>
          <li>Create a UKVI account (verify your email)</li>
          <li>Start the Student Visa (long-term study) application</li>
          <li>Fill out form (personal details, passport info, CAS details, travel history)</li>
          <li>Upload documents:
            <ul class="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
              <li>CAS letter</li>
              <li>Passport</li>
              <li>Financial proof (bank statement, loan, or sponsor letter)
              <button onclick="window.switchToTab && window.switchToTab('eligibility', 'Finance')" class="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
              </li>
              <li>English proficiency test certificate</li>
              <li>TB test certificate (if required)</li>
              <li>ATAS certificate (if required)</li>
            </ul>
          </li>
          <li>Pay fees:
            <ul class="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
              <li>Immigration Health Surcharge (IHS) first</li>
              <li>Visa fee second (~£348)</li>
            </ul>
          </li>
          <li>Submit online application</li>
          <li>Receive confirmation + biometric booking instructions</li>
        </ul>

        <h4 class="font-semibold text-sm mb-2 text-foreground mt-6">Step 4.2: Biometric Appointment (VFS Global)</h4>
        <p class="text-sm text-muted-foreground mb-3"><strong>Goal:</strong> Verify identity and submit biometrics.</p>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">Actions:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Book appointment at <a href="https://www.vfsglobal.com/en/individuals/index.html" target="_blank" rel="noopener noreferrer" class="text-primary underline">VFS Global UK Visa Centres</a> using application number</li>
          <li>Attend with passport + appointment confirmation</li>
          <li>Provide fingerprints and photograph</li>
          <li>Submit additional documents if requested</li>
          <li>Receive acknowledgement of biometric submission</li>
        </ul>

        <h4 class="font-semibold text-sm mb-2 text-foreground mt-6">Step 4.3: UKVI Account Access & Tracking</h4>
        <p class="text-sm text-muted-foreground mb-3"><strong>Goal:</strong> Track your visa application status.</p>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">Actions:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Log in to your UKVI account</li>
          <li>Monitor progress updates</li>
          <li>Await decision email + visa issuance instructions</li>
        </ul>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    documents: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Documents Listed Only Under Step 4.1:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>CAS letter</strong></li>
          <li><strong>Passport</strong></li>
          <li><strong>Financial proof</strong> (bank statement, loan, or sponsor letter)
          <button onclick="window.switchToTab && window.switchToTab('eligibility', 'Finance')" class="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </li>
          <li><strong>Education Proof
            <button onclick="window.switchToTab && window.switchToTab('eligibility', 'edu')" class="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </li>
          <li><strong>English proficiency test certificate</strong></li>
          <li><strong>TB test certificate</strong></li>
          <li><strong>ATAS certificate</strong> (if required)</li>
        </ul>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    links: [
      { title: "Guide to Setting Up Your UKVI Account (PDF)", url: "https://www.swansea.ac.uk/media/e-Visas-step-by-step-guide.pdf?utm_source=chatgpt.com", description: "Download: Guide to Setting Up Your UKVI Account (PDF)" },
      { title: "Official UK Gov — Documents You Must Provide", url: "https://www.gov.uk/student-visa/documents-you-must-provide" },
      { title: "VFS Global UK Visa Centres", url: "https://www.vfsglobal.com/en/individuals/index.html" }
    ]
  },
  {
    id: "processing-wait",
    title: "Step 6: Processing & Wait Period",
    action: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Processing Times & What to Expect</h4>
        <p class="text-sm text-muted-foreground mb-3"><strong>Goal:</strong> Understand processing timelines and stay informed about your application status.</p>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">Standard Processing Times:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li><strong>From India:</strong> Typically <strong>3-6 weeks</strong> for standard service.</li>
          <li><strong>Priority service:</strong> <strong>5-10 working days</strong> (additional fee applies).</li>
          <li><strong>Super Priority service:</strong> <strong>1-2 working days</strong> (highest additional fee).</li>
        </ul>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">How to Track Your Application:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Use your <strong>application reference number</strong> to track status online.</li>
          <li>Check your <strong>email regularly</strong> for updates from UKVI.</li>
          <li>Log into your <strong>UKVI account</strong> for application updates.</li>
        </ul>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">What Happens During Processing:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>UKVI reviews all your <strong>submitted documents</strong>.</li>
          <li><strong>Background checks</strong> and verification process.</li>
          <li>Possible <strong>interview</strong> (if required - rare but possible).</li>
          <li>Final <strong>decision notification</strong> via email.</li>
        </ul>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    documents: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Items to Keep Ready During Processing:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>Application reference number</strong> for tracking purposes.</li>
          <li><strong>Contact information</strong> updated in your UKVI account.</li>
          <li><strong>Backup documents</strong> in case additional information is requested.</li>
          <li><strong>Passport</strong> readily available (you may need to submit it).</li>
        </ul>
      </div>
    `,
    links: []
  },
  {
    id: "decision-visa-issuance",
    title: "Step 7: Decision & Visa Issuance",
    action: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Step 7.1: Accessing the eVisa</h4>
        <p class="text-sm text-muted-foreground mb-3"><strong>Goal:</strong> Access and manage your digital visa (eVisa) after approval.</p>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">What is an eVisa?</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>A <strong>digital visa</strong> that replaces physical visa vignettes and BRP cards.</li>
          <li>Available through your <strong>UKVI account</strong> after visa approval.</li>
          <li>Shows your <strong>immigration status</strong> and right to live, work, or study in the UK.</li>
        </ul>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">How to Access Your eVisa:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Log into your <strong>UKVI account</strong>: <a href="https://apply-to-visit-or-stay-in-the-uk.homeoffice.gov.uk/sorted/brp-decision-1-november-2024/sar_in_uk?uid=297aa4d7-2f23-4818-a1be-4882aa784f34&cookiesPreferencesURL=https%3A%2F%2Fapply-to-visit-or-stay-in-the-uk.homeoffice.gov.uk%2Fdashboard%2Fcookies&cookiesPolicyDomain=apply-to-visit-or-stay-in-the-uk.homeoffice.gov.uk&analytics=true&marketing=true" target="_blank" rel="noopener noreferrer" class="text-primary underline">Setup your UKVI account</a></li>
          <li>Navigate to the <strong>"View my eVisa"</strong> section.</li>
          <li><strong>Download</strong> or <strong>print</strong> your eVisa for travel purposes.</li>
        </ul>
        
        <h4 class="font-semibold text-sm mb-2 text-foreground">Step 7.2 — Document Verification / Interview Flow</h4>
        <p class="text-sm text-muted-foreground mb-3">In rare cases, you may be called for an interview or additional document verification.</p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h5 class="font-semibold text-blue-900 mb-2">Interview Preparation</h5>
              <p class="text-blue-800 text-sm mb-2">You can practice for the interview using this link:</p>
              <a href="https://www.visamonk.ai/#student-counsellors" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Practice Interview
              </a>
            </div>
          </div>
        </div>
        
        <h5 class="font-medium text-sm mb-2 text-foreground">What to Expect if Called for Interview:</h5>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>Questions about your <strong>course</strong> and <strong>university</strong>.</li>
          <li>Verification of your <strong>financial capacity</strong>.</li>
          <li>Discussion about your <strong>study plans</strong> and <strong>career goals</strong>.</li>
          <li>Clarification on any <strong>documents</strong> or <strong>information</strong> provided.</li>
        </ul>
      </div>
    `,
    documents: `
      <div>
        <h4 class="font-semibold text-sm mb-2 text-foreground">Documents to Keep Ready:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>All original documents</strong> submitted in your application.</li>
          <li><strong>University correspondence</strong> and offer letters.</li>
          <li><strong>Financial documents</strong> and evidence.</li>
          <li><strong>Course information</strong> and study plan details.</li>
        </ul>

        <div class="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p class="text-xs text-muted-foreground">
            <strong>Note:</strong> This content has been verified against official UK Government sources, but we cannot guarantee 100% accuracy. Please always cross-check with the official UK Government website before taking action.
          </p>
        </div>
      </div>
    `,
    links: [
      { title: "Setup your UKVI account", url: "https://apply-to-visit-or-stay-in-the-uk.homeoffice.gov.uk/sorted/brp-decision-1-november-2024/sar_in_uk?uid=297aa4d7-2f23-4818-a1be-4882aa784f34&cookiesPreferencesURL=https%3A%2F%2Fapply-to-visit-or-stay-in-the-uk.homeoffice.gov.uk%2Fdashboard%2Fcookies&cookiesPolicyDomain=apply-to-visit-or-stay-in-the-uk.homeoffice.gov.uk&analytics=true&marketing=true" }
    ]
  }
];

const documents = [
  "Passport (valid for full stay)",
  "CAS (enter CAS number in application; details pull into form)",
  "Financial evidence (maintenance by location + any tuition shortfall; correct formats; covering last 28 consecutive days)",
  "TB certificate (if required, from Home Office-approved clinic)",
  "ATAS certificate (if required for course)",
  "English-language proof (only if not confirmed by CAS or sponsor)",
  "Photo and any extra items prompted by the application (accommodation proof, sponsor letters, research proposal if applicable)",
  "Academic qualifications (degree certificates, official transcripts, medium of instruction if required)",
  "Sponsorship or scholarship evidence (if applicable)",
];

const commonMistakes = [
  "Using wrong maintenance amount for the city (London vs outside)",
  "Missing TB certificate from an approved clinic",
  "Skipping ATAS where the course requires it",
  "Submitting financial evidence too old or in wrong format",
  "Not allowing enough processing time before course start date",
  "Entering incorrect or incomplete CAS number",
  "Uploading uncertified or non-English copies of documents",
  "Failing to prepare documents for biometric appointment (originals required)",
  "Overlooking English-language proof if CAS/sponsor does not confirm exemption",
  "Submitting incomplete or inconsistent academic transcripts or qualifications",
];

const masterDocumentChecklist = [
  "Valid passport (with minimum 6 months validity)",
  "Unconditional offer letter from university",
  "CAS (Confirmation of Acceptance for Studies) number",
  "ATAS certificate (if required for your course)",
  "Academic qualifications and transcripts",
  "English language proficiency test results (IELTS/TOEFL)",
  "Financial evidence - bank statements (last 28 days)",
  "Financial evidence - loan sanction letter (if applicable)",
  "Financial evidence - sponsorship letter (if applicable)",
  "TB test certificate (for stays longer than 6 months)",
  "Passport-size photographs",
  "Previous passport (if any)",
  "Academic gap explanation letter (if applicable)",
  "Work experience certificates (if required)",
  "Medical certificates (if applicable)",
  "Police clearance certificate (if applicable)",
  "Marriage certificate (if applicable)",
  "Birth certificate (if required)",
  "Name change documents (if applicable)",
  "Additional academic documents for verification",
  "Research proposal (for PhD students)",
  "Portfolio/creative work samples (for creative courses)",
  "Professional qualifications certificates",
  "Military service records/exemption (if applicable)",
  "Immigration history documents",
  "Property documents (if showing as financial evidence)",
  "Income tax returns (if self-employed or showing income)",
  "Relationship evidence (for dependents)"
];

export default function VisaDetails({ onBack, userFormData, personalizationData }: VisaDetailsProps) {
  const [stepCompletion, setStepCompletion] = useState<Record<string, boolean>>({});
  const [casStatus, setCasStatus] = useState<{hasCAS: boolean, casDate?: string}>({
    hasCAS: personalizationData?.hasCAS || false,
    casDate: personalizationData?.casDate
  });
  const [activeTab, setActiveTab] = useState("process");
  const [allTabsVisited, setAllTabsVisited] = useState(false);
  const [hasDocumentIssues, setHasDocumentIssues] = useState<boolean | null>(null);
  const [hasFacingIssues, setHasFacingIssues] = useState<boolean | null>(null);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [currentScenarioDocuments, setCurrentScenarioDocuments] = useState<string[]>([]);
  const [currentScenarioName, setCurrentScenarioName] = useState("");
  const [additionalDocuments, setAdditionalDocuments] = useState<Array<{scenario: string, documents: string[]}>>([]);

  // Define scenarios with their required documents
  const specialCaseScenarios = [
    {
      category: "Academic Background Verification",
      items: [
        {
          text: "Gap in education: Letter explaining academic or employment gaps longer than 6 months",
          documents: ["Gap explanation letter", "Employment certificates for gap periods", "Affidavit explaining gap reasons"]
        },
        {
          text: "Multiple degrees: All academic transcripts and degree certificates",
          documents: ["All degree certificates", "Complete academic transcripts", "University verification letters"]
        },
        {
          text: "Institution not recognized: Additional verification from educational authorities",
          documents: ["Educational board verification", "Institution accreditation proof", "Equivalency certificates"]
        },
        {
          text: "Grade conversion: Official grade conversion scale if your institution uses a different grading system",
          documents: ["Official grade conversion scale", "University grading system documentation", "Academic equivalency certificate"]
        }
      ]
    },
    {
      category: "Financial Complexity",
      items: [
        {
          text: "Multiple funding sources: Detailed breakdown of how funds are allocated",
          documents: ["Detailed fund allocation breakdown", "Multiple bank statements", "Source of funds declaration"]
        },
        {
          text: "Sponsorship from organization: Official sponsorship letter with contact verification",
          documents: ["Official sponsorship letter", "Organization registration documents", "Sponsor's financial proof"]
        },
        {
          text: "Education loan: Loan sanction letter with disbursement schedule",
          documents: ["Loan sanction letter", "Disbursement schedule", "Bank loan agreement", "Collateral documents"]
        },
        {
          text: "Scholarship funding: Official scholarship award letter and payment confirmation",
          documents: ["Scholarship award letter", "Scholarship payment confirmation", "Scholarship terms and conditions"]
        },
        {
          text: "Joint account holders: Relationship proof and consent letter from account holders",
          documents: ["Joint account holder consent letters", "Relationship proof documents", "Account holder ID proofs"]
        }
      ]
    },
    {
      category: "Personal Circumstances",
      items: [
        {
          text: "Previous visa refusals: Detailed explanation letter addressing previous refusal reasons",
          documents: ["Visa refusal explanation letter", "Previous refusal documentation", "Improved circumstances proof"]
        },
        {
          text: "Name discrepancies: Legal name change documents or affidavit",
          documents: ["Name change certificate", "Gazette notification", "Legal affidavit for name discrepancy"]
        },
        {
          text: "Medical conditions: Medical clearance if condition affects studies",
          documents: ["Medical clearance certificate", "Doctor's fitness letter", "Medical treatment records"]
        },
        {
          text: "Criminal history: Police clearance certificate and court documents (if applicable)",
          documents: ["Police clearance certificate", "Court documents", "Character certificate"]
        },
        {
          text: "Military service: Military service records or exemption certificate",
          documents: ["Military service certificate", "Military exemption certificate", "Service discharge papers"]
        }
      ]
    },
    {
      category: "Course-Specific Requirements",
      items: [
        {
          text: "Research-based programs: Detailed research proposal and supervisor confirmation",
          documents: ["Detailed research proposal", "Supervisor confirmation letter", "Research methodology documentation"]
        },
        {
          text: "Professional courses: Relevant work experience certificates",
          documents: ["Work experience certificates", "Professional qualification certificates", "Industry training certificates"]
        },
        {
          text: "Creative fields: Portfolio submission or creative work samples",
          documents: ["Creative portfolio", "Work samples documentation", "Creative project certificates"]
        },
        {
          text: "Healthcare programs: Additional health screening or immunization records",
          documents: ["Health screening reports", "Immunization records", "Medical fitness certificate"]
        },
        {
          text: "STEM subjects requiring ATAS: Complete research methodology and equipment details",
          documents: ["Research methodology details", "Equipment usage documentation", "ATAS certificate", "Research collaboration letters"]
        }
      ]
    },
    {
      category: "Travel History Considerations",
      items: [
        {
          text: "Extensive travel history: Detailed travel timeline with purpose explanation",
          documents: ["Travel history documentation", "Travel purpose letters", "Previous visa copies"]
        },
        {
          text: "Visits to high-risk countries: Additional security screening documentation",
          documents: ["Security clearance documents", "Travel purpose justification", "Host country documentation"]
        },
        {
          text: "Long-term stays abroad: Proof of legal status during extended stays",
          documents: ["Legal status proof abroad", "Residence permits", "Employment authorization documents"]
        },
        {
          text: "Frequent visa applications: Pattern explanation and purpose justification",
          documents: ["Application pattern explanation", "Travel justification letters", "Previous successful visa documentation"]
        }
      ]
    }
  ];

  const handleScenarioSelection = (scenarioText: string, documents: string[]) => {
    setCurrentScenarioDocuments(documents);
    setCurrentScenarioName(scenarioText);
    setShowDocumentPopup(true);
  };

  const handleScenarioCheck = (scenarioText: string, checked: boolean) => {
    if (checked) {
      setSelectedScenarios(prev => [...prev, scenarioText]);
    } else {
      setSelectedScenarios(prev => prev.filter(s => s !== scenarioText));
    }
  };

  // Update additional documents based on selected scenarios
  useEffect(() => {
    const newAdditionalDocs: Array<{scenario: string, documents: string[]}> = [];
    
    selectedScenarios.forEach(scenarioText => {
      // Find the scenario in specialCaseScenarios
      for (const category of specialCaseScenarios) {
        const item = category.items.find(item => item.text === scenarioText);
        if (item) {
          newAdditionalDocs.push({ scenario: scenarioText, documents: item.documents });
          break;
        }
      }
    });
    
    setAdditionalDocuments(newAdditionalDocs);
  }, [selectedScenarios]);

  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };


  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (!allTabsVisited) {
      const tabOrder = ["overview", "eligibility", "fees", "process", "special-cases"];
      const currentIndex = tabOrder.indexOf(value);
      if (currentIndex === tabOrder.length - 1) {
        setAllTabsVisited(true);
      }
    }
  };

  // Add switchToTab function to window for info buttons
  useEffect(() => {
    window.switchToTab = (tabId: string, anchorId?: string) => {
      setActiveTab(tabId);
      if (anchorId) {
        // Small delay to allow tab content to render before scrolling
        setTimeout(() => {
          const element = document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    // Cleanup function
    return () => {
      delete window.switchToTab;
    };
  }, []);

  // Handle step completion and sync with checklist
  const handleStepComplete = async (stepId: string) => {
    // Mark step as completed
    const newStepCompletion = { ...stepCompletion, [stepId]: true };
    setStepCompletion(newStepCompletion);
    
    // Sync with checklist using the mapping
    const checklistIndex = STEP_TO_CHECKLIST_MAP[stepId];
    if (checklistIndex !== undefined) {
      // Update checklist via custom event
      const checklistUpdateEvent = new CustomEvent('updateChecklist', { 
        detail: { index: checklistIndex, checked: true } 
      });
      window.dispatchEvent(checklistUpdateEvent);
    }
    
    // Save to backend with updated checklist state
    if (userFormData?.email) {
      const updatedChecklistState: Record<string, boolean> = {};
      // Include the current step's checklist mapping
      if (checklistIndex !== undefined) {
        updatedChecklistState[checklistIndex.toString()] = true;
      }
      
      await saveProgress({
        email: userFormData.email,
        originCountry: "India",
        destinationCountry: "UK", 
        personalizationData: casStatus,
        stepCompletion: newStepCompletion,
        checklist: updatedChecklistState,
        timestamps: { stepCompleted: new Date().toISOString() }
      });
    }
  };

  // Handle CAS auto-completions when CAS is received
  useEffect(() => {
    if (casStatus.hasCAS) {
      const preCompletedSteps = ["unconditional-offer", "cas"];
      let hasUpdates = false;
      const newStepCompletion = { ...stepCompletion };
      
      preCompletedSteps.forEach(stepId => {
        if (!stepCompletion[stepId]) {
          newStepCompletion[stepId] = true;
          hasUpdates = true;
          
          // Sync with checklist
          const checklistIndex = STEP_TO_CHECKLIST_MAP[stepId];
          if (checklistIndex !== undefined) {
            const checklistUpdateEvent = new CustomEvent('updateChecklist', { 
              detail: { index: checklistIndex, checked: true } 
            });
            window.dispatchEvent(checklistUpdateEvent);
          }
        }
      });
      
      if (hasUpdates) {
        setStepCompletion(newStepCompletion);
        // Save the auto-completed steps
        if (userFormData?.email) {
          saveProgress({
            email: userFormData.email,
            originCountry: "India",
            destinationCountry: "UK", 
            personalizationData: casStatus,
            stepCompletion: newStepCompletion,
            timestamps: { casAutoCompleted: new Date().toISOString() }
          });
        }
      }
    }
  }, [casStatus.hasCAS, stepCompletion, userFormData?.email]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Student Visa
            </h1>
            <Badge variant="secondary" className="text-xs">
              Current Route
            </Badge>
          </div>
        </div>

        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <Badge variant="outline" className="text-xs font-medium">
              Route Selected
            </Badge>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl lg:text-2xl font-semibold mb-2">
              Complete Visa Application Guide
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg">
              Complete step-by-step guidance for your visa application
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-5 text-sm lg:text-base overflow-hidden">
                  <TabsTrigger value="overview" className="whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1.5 lg:px-3">Info & Guide</TabsTrigger>
                  <TabsTrigger value="eligibility" className="whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1.5 lg:px-3">Eligibility</TabsTrigger>
                  <TabsTrigger value="fees" className="whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1.5 lg:px-3">Fees & Costs</TabsTrigger>
                  <TabsTrigger value="process" className="whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1.5 lg:px-3">Step-by-Step</TabsTrigger>
                  <TabsTrigger value="special-cases" className="whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1.5 lg:px-3">Special Cases</TabsTrigger>
                </TabsList>

                {/* Overview & Knowledge Hub */}
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground leading-relaxed">
                          Visa for full-time study at a licensed UK student sponsor. Apply online from India; 
                          prove identity via the UK Immigration: ID Check app or VFS biometrics.
                        </p>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Knowledge Hub</h2>
                      
                      <Card id="conditional-offer">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is a Conditional Offer Letter?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> A Conditional Offer Letter is the first offer made by the university. It's conditional on meeting specific requirements (academic qualifications, language proficiency, etc.).</p>
                            <p><strong>How it becomes unconditional:</strong> Once you meet all the conditions outlined in the Conditional Offer Letter, the university will convert your offer into an Unconditional Offer Letter.</p>
                            <p><strong>When conversion happens:</strong> The conversion to unconditional occurs after you submit proof (e.g., passing required exams or providing additional documentation).</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="atas">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is ATAS (Academic Technology Approval Scheme)?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> ATAS is a certificate required for postgraduate courses in certain sensitive subjects.</p>
                            <p><strong>Purpose:</strong> It is a pre-clearance needed before applying for a UK student visa to ensure the course or research does not pose a risk to UK national security.</p>
                            <p><strong>Who needs it:</strong> Postgraduate students (Masters or PhD) in specific subject areas including advanced materials, aerospace engineering, computer science, physics, and other sensitive fields.</p>
                            <p><strong>Application:</strong> Apply through the official FCDO ATAS portal with no fee, processing takes ~20 working days.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="cas">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is CAS (Confirmation of Acceptance for Studies)?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> CAS is a unique reference number issued by a licensed university (a UKVI-approved institution) confirming your acceptance into a program.</p>
                            <p><strong>Why required:</strong> It is required to apply for a UK student visa.</p>
                            <p><strong>How to obtain:</strong> After receiving an unconditional offer, request your CAS number from the university's international office or admissions team via their student portal or by contacting them directly.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="tb-test">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is TB Test (Tuberculosis Test)?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> TB Test is a medical screening for tuberculosis required for UK visa applications.</p>
                            <p><strong>Who needs it:</strong> Required for stays longer than 6 months from countries including India.</p>
                            <p><strong>Where to take it:</strong> Must be conducted at Home Office-approved clinics.</p>
                            <p><strong>Validity:</strong> Valid for 6 months from the test date.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="ukvi">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is UKVI (UK Visas and Immigration)?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> UKVI is a division of the Home Office that processes and evaluates UK visa applications.</p>
                            <p><strong>Why set up UKVI:</strong> Students must create a UKVI account during their visa application to track and manage their visa processing.</p>
                            <p><strong>When to set up:</strong> Set up your UKVI account once you are ready to apply for your visa and have your CAS number.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="biometric-appointment">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is a Biometric Appointment?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> A biometric appointment is a required appointment where you provide fingerprints and photograph for visa processing.</p>
                            <p><strong>Where to book:</strong> At VFS Global Visa Application Centers or other approved locations.</p>
                            <p><strong>What to bring:</strong> Passport, visa application confirmation, and any additional documents requested.</p>
                            <p><strong>Purpose:</strong> To verify your identity and complete your visa application process.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="evisa">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is an eVisa?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> An eVisa is a digital visa that replaces physical visa vignettes and Biometric Residence Permits (BRPs).</p>
                            <p><strong>Access:</strong> Available through your UKVI account after visa approval.</p>
                            <p><strong>Purpose:</strong> Proves your immigration status and right to live, work, or study in the UK.</p>
                            <p><strong>Travel:</strong> You can download and print your eVisa for travel and immigration purposes.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="financial-evidence">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">What is Financial Evidence?</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>Definition:</strong> Documentation proving you have sufficient funds to cover tuition and living expenses in the UK.</p>
                            <p><strong>Required amount:</strong> For London: £1,483/month; Outside London: £1,136/month.</p>
                            <p><strong>Types:</strong> Bank statements, loan sanction letters, sponsorship letters, scholarship awards.</p>
                            <p><strong>Timeline:</strong> Must cover the last 28 consecutive days before application submission.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Additional Key Terms</h3>
                          <div className="space-y-3 text-muted-foreground">
                            <p><strong>IHS (Immigration Health Surcharge):</strong> Fee paid to access the UK's National Health Service during your stay (~£776 per year for students).</p>
                            <p><strong>VFS Global:</strong> Official partner for UK visa application centers where you submit biometric data and documents.</p>
                            <p><strong>Licensed Sponsor:</strong> Universities and institutions approved by UKVI to sponsor international students.</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Eligibility */}
                <TabsContent value="eligibility">
                  <Card>
                    <CardContent className="p-6">
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Passport (validity for next 5 years , with 4-5 blank pages in passport)</li>
                        <li>Unconditional offer + CAS number from a licensed sponsor</li>
                        <li>Financial requirement (maintenance + any unpaid tuition)</li>
                        <li>English level: typically CEFR B2 (degree level)</li>
                        <li>TB test required for stays &gt; 6 months (India)</li>
                        <li>ATAS only if your course is on sensitive subject lists (offer/CAS will state it)</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <br></br>
                  <Card id="edu">
                    <CardContent className="p-6">
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                     <h2><b>Educational Eligibility Documents List:</b></h2>
                        <h3>Confirmation of Acceptance for Studies (CAS)</h3>
                          <li>Issued by your UK educational institution upon acceptance.</li>
                          <li>Must include the CAS reference number and details of your course.</li>
                        <h3>Academic Qualifications</h3>
                          <li>Original certificates and transcripts.</li>
                          <li>Translations if documents are not in English.</li>
                        <h3>English Language Proficiency</h3>
                          <li>IELTS, TOEFL, or other approved tests.</li>
                          <li>If the qualification was taught in English, provide proof of this.</li>
                        <h3>Academic Technology Approval Scheme (ATAS) Certificate</h3>
                          <li>Required for certain postgraduate courses in sensitive subjects.</li>
                          <li>Apply through the UK government website if needed.</li>

                        <h3>TB Test Certificate</h3>
                          <li>Mandatory for applicants from certain countries, including India.</li>
                          <li>Must be from an approved clinic.</li>                      

                        <h3>Parental Consent (if under 18)</h3>
                          <li>Written consent from both parents or legal guardians.</li>
                          <li>Should include consent for visa application, living arrangements, and travel to the UK.</li>                      

                        <h3>Proof of Relationship to Parent or Guardian (if under 18)</h3>
                          <li>Birth certificate or other official documents showing parental relationship.</li>

                        <h3>Letter of Consent from Parents (if under 18 or sponsored by parents)</h3>
                          <li>Required if parents are financially sponsoring the applicant.</li>
                          <li>Should confirm their consent for visa application and financial support.</li>                      

                      </ul>
                    </CardContent>
                  </Card>
                  <br></br>
                  <Card id="Finance">
                    <CardContent className="p-6">
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <h2><b>Financial Eligibility Documents List:</b></h2>
                        <h3>Bank Statements</h3>
                          <li>Must show sufficient funds for tuition fees and living costs.</li>
                          <li>Should cover a consecutive 28-day period ending within 31 days of the application.</li>
                        <h3>Bank Balance Certificate</h3>
                          <li>Official letter from the bank confirming account balance.</li>
                          <li>Should include bank manager's contact details and be sealed.</li>
                        <h3>Income Tax Returns (ITR)</h3>
                          <li>ITRs for the last 3 years to demonstrate financial stability.</li>
                        <h3>Net Worth Statement of Parents</h3>
                          <li>Required if no loan is taken.</li>
                          <li>Should include assets, liabilities, and overall net worth.</li>

                        <h3>Financial Sponsorship Letter</h3>
                          <li>If sponsored by a third party, provide a letter confirming sponsorship.</li>
                          <li>Should include sponsor's details and the amount covered..</li>                      

                        <h3>Loan Sanction Letter</h3>
                          <li>If a loan is taken, provide the official sanction letter.</li>
                          <li>Should include loan amount, terms, and repayment details.</li>
                        <h3>Salary Slips</h3>
                          <li>Recent salary slips (last 3 months) to demonstrate income.</li>

                        <h3>Property Documents</h3>
                          <li>If assets are used as collateral for loans, provide property documents.</li>
                        <h3>Affidavit of Support</h3>
                          <li>Notarized affidavit from the sponsor confirming financial support.</li>
                        <h3>Net Worth Certificate</h3>
                          <li>Certified document from a chartered accountant detailing the sponsor's net worth.</li>

                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Fees & Costs */}
                <TabsContent value="fees">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Visa Fee</span>
                          </div>
                          <p className="text-2xl font-bold text-foreground">£348</p>
                          <p className="text-sm text-muted-foreground">Application fee</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span className="font-semibold">IHS Fee</span>
                          </div>
                          <p className="text-2xl font-bold text-foreground">£776</p>
                          <p className="text-sm text-muted-foreground">Per year</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Maintenance (living costs):</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>London: £1,483 / month (up to 9 months)</li>
                        <li>Outside London: £1,136 / month (up to 9 months)</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Step-by-Step Process */}
                <TabsContent value="process">
                  <div className="space-y-6">
                    {/* CAS Status Input */}
                    <CASStatusInput
                      hasCAS={casStatus.hasCAS}
                      casDate={casStatus.casDate}
                      onUpdate={async (hasCAS, casDate) => {
                        const newCasStatus = { hasCAS, casDate };
                        setCasStatus(newCasStatus);
                        
                        // Save to backend
                        if (userFormData?.email) {
                          await saveProgress({
                            email: userFormData.email,
                            originCountry: "India", // from flow state
                            destinationCountry: "UK", // from flow state
                            personalizationData: newCasStatus,
                            stepCompletion,
                            timestamps: { casStatusUpdated: new Date().toISOString() }
                          });
                        }
                      }}
                    />

                    {/* Timeline Steps */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Your Visa Journey Timeline</h2>
                      
                      {steps.map((step, index) => (
                        <TimelineStep
                          key={step.id}
                          id={step.id}
                          title={step.title}
                          status={getStepStatus(step.id, index, casStatus)}
                          dueBy={getDueByText(step.id, casStatus)}
                          description={getStepDescription(step.id)}
                          action={step.action}
                          documents={step.documents}
                          links={step.links}
                          onMarkComplete={handleStepComplete}
                        />
                      ))}
                    </div>
                     
                     {/* Common Mistakes section only - Documents Checklist moved to sidebar */}
                     <div className="space-y-4 mt-6">
                       <Card>
                         <CardHeader>
                           <CardTitle className="text-lg flex items-center gap-2">
                             <AlertTriangle className="w-5 h-5 text-destructive" />
                             Common Mistakes to Avoid
                           </CardTitle>
                         </CardHeader>
                         <CardContent>
                           <ul className="space-y-2">
                             {commonMistakes.map((mistake, index) => (
                               <li key={index} className="flex items-start gap-3">
                                 <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                 <span className="text-sm text-muted-foreground">{mistake}</span>
                               </li>
                             ))}
                           </ul>
                         </CardContent>
                       </Card>
                      </div>
                   </div>
                 </TabsContent>

                  {/* Special Cases */}
                  <TabsContent value="special-cases">
                    <div className="space-y-6">
                      <Card>
                        <CardContent className="p-6">
                          {/* Initial Question */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">
                              Among the mentioned scenarios, are you facing any issues? Yes or No.
                            </h3>
                            
                            <div className="flex gap-4 mb-6">
                              <Button
                                variant={hasFacingIssues === true ? "default" : "outline"}
                                onClick={() => setHasFacingIssues(true)}
                                className="px-8"
                              >
                                Yes
                              </Button>
                              <Button
                                variant={hasFacingIssues === false ? "default" : "outline"}
                                onClick={() => {
                                  setHasFacingIssues(false);
                                  setSelectedScenarios([]);
                                  setAdditionalDocuments([]);
                                }}
                                className="px-8"
                              >
                                No
                              </Button>
                            </div>
                          </div>

                          {/* Scenarios with checkboxes */}
                          <p className="text-muted-foreground leading-relaxed mb-6">
                            In some cases, you may be asked to provide extra information or documents in addition to the standard checklist. Here are the most common scenarios where this applies.
                          </p>
                          
                          <div className="space-y-6">
                            {specialCaseScenarios.map((category, categoryIndex) => (
                              <div key={categoryIndex}>
                                <h3 className="text-lg font-semibold mb-3">{category.category}</h3>
                                <ul className="space-y-3">
                                  {category.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-3">
                                      <Checkbox
                                        id={`scenario-${categoryIndex}-${itemIndex}`}
                                        disabled={hasFacingIssues !== true}
                                        checked={selectedScenarios.includes(item.text)}
                                        onCheckedChange={(checked) => {
                                          handleScenarioCheck(item.text, !!checked);
                                          if (checked) {
                                            handleScenarioSelection(item.text, item.documents);
                                          }
                                        }}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`scenario-${categoryIndex}-${itemIndex}`}
                                        className={`text-sm leading-relaxed ${
                                          hasFacingIssues === true ? 'cursor-pointer text-foreground' : 'cursor-not-allowed text-muted-foreground/60'
                                        }`}
                                      >
                                        {item.text}
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* No scenarios message - displayed immediately below question */}
                          {hasFacingIssues === false && (
                            <div className="mb-6">
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 font-medium">
                                  Great! Please follow the general flow of steps for your application.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Important Guidance */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                            <div className="flex items-start gap-3">
                              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Important Guidance</h4>
                                <p className="text-blue-800 text-sm">
                                  These are supplementary requirements that may apply to your specific situation. The standard document checklist remains your primary requirement. If any of these scenarios apply to you, prepare the additional documentation proactively to avoid delays in processing.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Document Popup Dialog */}
                      <Dialog open={showDocumentPopup} onOpenChange={setShowDocumentPopup}>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Required Documents</DialogTitle>
                          </DialogHeader>
                          <div>
                            <p className="text-muted-foreground mb-4">
                              Based on the scenario you selected, the following documents are required:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                              {currentScenarioDocuments.map((doc, index) => (
                                <li key={index} className="text-sm text-foreground">
                                  {doc}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800 text-sm font-medium">
                                ✓ These documents have been automatically added to your checklist
                              </p>
                            </div>
                            <Button 
                              onClick={() => setShowDocumentPopup(false)} 
                              className="w-full mt-4"
                            >
                              Got it
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                    </div>
                  </TabsContent>
               </Tabs>

              <Button 
                onClick={onBack}
                variant="outline" 
                size="lg"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Visa Types
              </Button>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <InteractiveChecklist 
                userFormData={userFormData} 
                personalizationData={personalizationData}
                allTabsVisited={allTabsVisited}
                stepDetails={steps}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {documents.map((doc, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Checkbox id={`sidebar-doc-${index}`} className="mt-0.5" />
                        <label htmlFor={`sidebar-doc-${index}`} className="text-sm text-muted-foreground cursor-pointer">
                          {doc}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share Checklist
                  </Button>
                </CardContent>
              </Card>
              
              {/* Additional Documents Checklist - Only show when user selected Yes and has scenarios */}
              {hasFacingIssues === true && additionalDocuments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {additionalDocuments.map((item, scenarioIndex) => (
                        <div key={scenarioIndex}>
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Required for: {item.scenario}
                          </h4>
                          <ul className="space-y-2 mb-4">
                            {item.documents.map((doc, docIndex) => (
                              <li key={docIndex} className="flex items-start gap-3">
                                <Checkbox id={`additional-doc-${scenarioIndex}-${docIndex}`} className="mt-0.5" />
                                <label 
                                  htmlFor={`additional-doc-${scenarioIndex}-${docIndex}`} 
                                  className="text-sm text-muted-foreground cursor-pointer"
                                >
                                  {doc}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share Additional Checklist
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <OfficialLinksPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper functions for timeline logic
  function getStepStatus(stepId: string, index: number, casStatus: {hasCAS: boolean, casDate?: string}): StepStatus {
    // If step is manually completed
    if (stepCompletion[stepId]) {
      return "completed";
    }

    // Define step phases
    const preCasSteps = ["unconditional-offer", "atas", "cas"];
    const postCasSteps = ["visa-application", "processing-wait", "tb-test", "decision-visa-issuance"];

    // CAS-based logic
    if (casStatus.hasCAS && casStatus.casDate) {
      // CAS = Yes (date provided): All Pre-CAS steps → Completed
      if (preCasSteps.includes(stepId)) {
        return "completed";
      }
      
      // First Post-CAS step → In Progress
      if (stepId === "visa-application") {
        return "in-progress";
      }
      
      // Check due soon status for post-CAS steps
      const casDate = new Date(casStatus.casDate.split('/').reverse().join('-'));
      const now = new Date();
      
      if (postCasSteps.includes(stepId)) {
        // Calculate if due soon (within 7 days of calculated due date)
        const dueDate = getDueDateForStep(stepId, casDate);
        if (dueDate && (dueDate.getTime() - now.getTime()) <= 7 * 24 * 60 * 60 * 1000 && dueDate > now) {
          return "due-soon";
        }
        return "pending";
      }
    } else {
      // CAS = No: Pre-CAS steps remain Pending, first one In Progress
      if (stepId === "unconditional-offer") {
        return "in-progress";
      }
      if (preCasSteps.includes(stepId) && stepId !== "unconditional-offer") {
        return "pending";
      }
      if (postCasSteps.includes(stepId)) {
        return "pending";
      }
    }

    return "pending";
  }

  function getDueDateForStep(stepId: string, casDate: Date): Date | null {
    switch (stepId) {
      case "visa-application":
        return addDays(casDate, 30); // 30 days from CAS
      case "processing-wait":
        return addWeeks(casDate, 8); // ~6-8 weeks for processing
      case "tb-test":
        return addDays(casDate, 15); // Should be done before visa application
      case "decision-visa-issuance":
        return addWeeks(casDate, 10); // After processing
      default:
        return null;
    }
  }

  function getDueByText(stepId: string, casStatus: {hasCAS: boolean, casDate?: string}): string {
    // For completed steps, show "Completed"
    if (stepCompletion[stepId]) {
      return "Completed";
    }

    const preCasSteps = ["unconditional-offer", "atas", "cas"];
    
    if (casStatus.hasCAS && casStatus.casDate) {
      const casDate = new Date(casStatus.casDate.split('/').reverse().join('-'));
      
      // Pre-CAS steps are completed when CAS is received
      if (preCasSteps.includes(stepId)) {
        return "Completed";
      }
      
      // Post-CAS steps show calculated due dates
      const dueDate = getDueDateForStep(stepId, casDate);
      if (dueDate) {
        return `${format(dueDate, 'dd MMM yyyy')}`;
      }
      
      return "After CAS";
    }
    
    // No CAS yet - show relative timing
    switch (stepId) {
      case "unconditional-offer":
        return "Due by: Before CAS";
      case "atas":
        return "Due by: After Unconditional Offer";
      case "cas":
        return "Due by: After Requirements Met";
      case "visa-application":
      case "processing-wait":
      case "tb-test":
      case "decision-visa-issuance":
        return "Due by: After CAS";
      default:
        return "TBD";
    }
  }

  function getStepDescription(stepId: string): string {
    switch (stepId) {
      case "unconditional-offer":
        return "Convert your conditional offer to unconditional by meeting all requirements";
      case "atas":
        return "Required for specific postgraduate courses in sensitive subjects";
      case "cas":
        return "Request CAS from your university after unconditional offer";
      case "visa-application":
        return "Submit your visa application with all required documents";
      default:
        return "";
    }
  }
}
