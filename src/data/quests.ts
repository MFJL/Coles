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

// Three demo quests with specific barcodes to recognize
// NOTE: Update these barcodes with the actual barcodes from your products
export const DEMO_QUESTS: Quest[] = [
  {
    id: "quest-1",
    title: "Scan Pauls Plus+ Protein Chocolate",
    description: "Find and scan the Pauls Plus+ Protein Chocolate to unlock a special discount!",
    barcode: "9310036228509",
    productName: "Pauls Plus+ Protein Chocolate",
    discount: "$1.50 OFF",
    flybuysPoints: 5,
    completed: false,
  },
  {
    id: "quest-2",
    title: "Scan Coca-Cola Zero Lime",
    description: "Find and scan the Coca-Cola Zero Lime to earn bonus Flybuys points!",
    barcode: "9300675094962",
    productName: "Coca-Cola Zero Lime",
    discount: "$0.50 OFF",
    flybuysPoints: 5,
    completed: false,
  },
  {
    id: "quest-3",
    title: "Scan Dettol Healthy Touch",
    description: "Find and scan the Dettol Healthy Touch Liquid Antibacterial to complete this quest!",
    barcode: "93554190",
    productName: "Dettol Healthy Touch Liquid Antibacterial",
    discount: "$1.00 OFF",
    flybuysPoints: 5,
    completed: false,
  },
];
