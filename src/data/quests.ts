export interface Quest {
  id: string;
  title: string;
  description: string;
  barcode: string;
  productName: string;
  discount: string;
  flybuysPoints: number;
  completed: boolean;
}

// Three Easter-themed demo quests — barcodes unchanged for scanning
export const DEMO_QUESTS: Quest[] = [
  {
    id: "quest-1",
    title: "Egg-stra Points! Scan Cadbury Dairy Milk Easter Eggs",
    description: "Hunt down the Cadbury Easter Eggs and scan to crack open bonus Flybuys points!",
    barcode: "9310036228509",
    productName: "Cadbury Dairy Milk Easter Eggs",
    discount: "$2.00 OFF",
    flybuysPoints: 5,
    completed: false,
  },
  {
    id: "quest-2",
    title: "Hot Cross Run! Scan Coles Hot Cross Buns 6pk",
    description: "It's not Easter without them — find and scan to earn bonus points on this classic favourite!",
    barcode: "9300675094962",
    productName: "Coles Hot Cross Buns 6pk",
    discount: "$1.50 OFF",
    flybuysPoints: 5,
    completed: false,
  },
  {
    id: "quest-3",
    title: "Catch the Golden Bunny! Scan Lindt Gold Bunny",
    description: "The Lindt Gold Bunny is hiding in the chocolate aisle — scan to earn your Easter reward!",
    barcode: "93554190",
    productName: "Lindt Gold Bunny",
    discount: "$1.00 OFF",
    flybuysPoints: 5,
    completed: false,
  },
];
