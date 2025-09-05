// Mapping between timeline step IDs and checklist item indices
export const STEP_TO_CHECKLIST_MAP: Record<string, number> = {
  "unconditional-offer": 0,  // "Got Unconditional Offer and CAS issued"
  "cas": 0,                  // "Got Unconditional Offer and CAS issued" 
  "atas": 1,                 // "ATAS obtained (if required)"
  "tb-test": 2,              // "TB certificate obtained (if required)"
  "financial-docs": 3,       // "Financial evidence prepared (maintenance + tuition shortfall; correct format/recency)"
  "visa-application": 4,     // "Online application submitted (Student visa, outside UK)"
  "decision": 9,             // "Decision received; UKVI account set up; eVisa accessible"
};