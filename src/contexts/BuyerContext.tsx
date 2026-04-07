import { createContext, useContext, useState, ReactNode } from "react";

export interface BuyerData {
  id: string;
  name: string;
  company: string;
  owner: string;
  vertical: string;
  tier: string;
  stage: string;
  stageColor: string;
  active: boolean;
  inDate: string;
  liveDate: string;
  daysInStage: number;
}

export const FUNNEL_STEPS = ["Buyer Created", "Paperwork", "Creative Submission", "Technical Setup", "Live"] as const;

export const STAGE_COLUMN_MAP: Record<string, string> = {
  "Buyer Created": "buyer_created",
  "Paperwork": "paperwork",
  "Creative Submission": "creative",
  "Technical Setup": "technical",
  "Live": "live",
};

export const COLUMN_STAGE_MAP: Record<string, string> = {
  buyer_created: "Buyer Created",
  paperwork: "Paperwork",
  creative: "Creative Submission",
  technical: "Technical Setup",
  live: "Live",
};

export const VERTICALS = [
  "Insurance",
  "Home Improvement",
  "Financial Services",
  "Credit Score",
  "Nutra",
  "Sweepstakes",
  "Legal",
  "Firearms & Safety",
  "Rewards",
  "Travel",
  "Education",
  "Ecommerce",
  "Other",
] as const;

export const TEAM_MEMBERS = [
  "Nayeem Ahmad",
  "Daniela Navarrete",
  "Mariela Perez",
  "Joe Austin",
  "Ripon Kumar",
  "Dan Davies",
] as const;

const initialBuyers: BuyerData[] = [
  { id: "b1", name: "Alexander Wright", company: "Stellar Dynamics Inc.", owner: "Nayeem Ahmad", vertical: "Insurance", tier: "Direct Buyer", stage: "Live", stageColor: "bg-primary-container", active: true, inDate: "Oct 12, 2023", liveDate: "Oct 15, 2023", daysInStage: 0 },
  { id: "b2", name: "Elena Rodriguez", company: "Vortex Systems", owner: "Daniela Navarrete", vertical: "Financial Services", tier: "Network", stage: "Paperwork", stageColor: "bg-primary-container", active: true, inDate: "Nov 01, 2023", liveDate: "Pending...", daysInStage: 5 },
  { id: "b3", name: "Marcus Chen", company: "GreenLeaf Logistics", owner: "Mariela Perez", vertical: "Home Improvement", tier: "Broker", stage: "Buyer Created", stageColor: "bg-tertiary", active: false, inDate: "Sept 15, 2023", liveDate: "Oct 01, 2023", daysInStage: 7 },
  { id: "b4", name: "Sophia Miller", company: "Miller-Direct Marketing", owner: "Nayeem Ahmad", vertical: "Ecommerce", tier: "Aggregator", stage: "Live", stageColor: "bg-primary-container", active: true, inDate: "Nov 05, 2023", liveDate: "Nov 10, 2023", daysInStage: 0 },
  { id: "b5", name: "Jameson Ford", company: "AutoLink International", owner: "Daniela Navarrete", vertical: "Credit Score", tier: "Agency", stage: "Creative Submission", stageColor: "bg-primary-container", active: true, inDate: "Oct 30, 2023", liveDate: "Reviewing...", daysInStage: 6 },
  { id: "b6", name: "Lila Thorne", company: "Bloom AI", owner: "Joe Austin", vertical: "Education", tier: "Direct Buyer", stage: "Technical Setup", stageColor: "bg-primary-container", active: true, inDate: "Oct 05, 2023", liveDate: "Oct 08, 2023", daysInStage: 3 },
  { id: "b7", name: "Robert King", company: "RealEstate Hub", owner: "Ripon Kumar", vertical: "Insurance", tier: "Network", stage: "Technical Setup", stageColor: "bg-primary-container", active: true, inDate: "Nov 12, 2023", liveDate: "ETA: Nov 18", daysInStage: 4 },
  { id: "b8", name: "Catherine Wu", company: "Pacific Bio", owner: "Dan Davies", vertical: "Nutra", tier: "Agency", stage: "Live", stageColor: "bg-primary-container", active: true, inDate: "Oct 20, 2023", liveDate: "Oct 25, 2023", daysInStage: 0 },
  { id: "b9", name: "Lumina Flow", company: "Lumina Flow", owner: "Nayeem Ahmad", vertical: "Financial Services", tier: "Direct Buyer", stage: "Buyer Created", stageColor: "bg-tertiary", active: true, inDate: "Nov 15, 2023", liveDate: "Pending...", daysInStage: 4 },
  { id: "b10", name: "Vortex Digital", company: "Vortex Digital", owner: "Daniela Navarrete", vertical: "Sweepstakes", tier: "Agency", stage: "Buyer Created", stageColor: "bg-tertiary", active: true, inDate: "Nov 17, 2023", liveDate: "Pending...", daysInStage: 2 },
  { id: "b11", name: "Helix Logistics", company: "Helix Logistics", owner: "Joe Austin", vertical: "Travel", tier: "Network", stage: "Paperwork", stageColor: "bg-primary-container", active: true, inDate: "Nov 08, 2023", liveDate: "Pending...", daysInStage: 11 },
  { id: "b12", name: "Quantum Media", company: "Quantum Media", owner: "Ripon Kumar", vertical: "Legal", tier: "Direct Buyer", stage: "Paperwork", stageColor: "bg-primary-container", active: true, inDate: "Nov 14, 2023", liveDate: "Pending...", daysInStage: 5 },
];

interface BuyerContextType {
  buyers: BuyerData[];
  addBuyer: (buyer: Omit<BuyerData, "id">) => void;
  updateBuyer: (updated: BuyerData) => void;
  updateBuyerStage: (buyerId: string, newStage: string) => void;
}

const BuyerContext = createContext<BuyerContextType | null>(null);

export function BuyerProvider({ children }: { children: ReactNode }) {
  const [buyers, setBuyers] = useState<BuyerData[]>(initialBuyers);

  const addBuyer = (buyer: Omit<BuyerData, "id">) => {
    setBuyers((prev) => [
      ...prev,
      { ...buyer, id: `b${Date.now()}` },
    ]);
  };

  const updateBuyer = (updated: BuyerData) => {
    setBuyers((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const updateBuyerStage = (buyerId: string, newStage: string) => {
    setBuyers((prev) =>
      prev.map((b) =>
        b.id === buyerId
          ? { ...b, stage: newStage, daysInStage: 0, liveDate: newStage === "Live" ? new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : b.liveDate }
          : b
      )
    );
  };

  return (
    <BuyerContext.Provider value={{ buyers, addBuyer, updateBuyer, updateBuyerStage }}>
      {children}
    </BuyerContext.Provider>
  );
}

export function useBuyers() {
  const ctx = useContext(BuyerContext);
  if (!ctx) throw new Error("useBuyers must be used within BuyerProvider");
  return ctx;
}
