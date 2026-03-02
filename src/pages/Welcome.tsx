import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronRight,
  Home,
  List,
  ShoppingBag,
  ShoppingCart,
  MoreHorizontal,
  Footprints,
  Clock,
  Info,
} from "lucide-react";
import { toast } from "sonner";

// ── Bottom tab bar ─────────────────────────────────────────────────────────────

interface TabItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function BottomTabBar({ tabs }: { tabs: TabItem[] }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-stretch h-[58px]">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={tab.onClick}
            className={`flex-1 flex flex-col items-center justify-center gap-[2px] text-[10px] font-medium transition-colors ${
              tab.active ? "text-red-600" : "text-gray-500"
            }`}
          >
            <span className={tab.active ? "text-red-600" : "text-gray-400"}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ── App header ─────────────────────────────────────────────────────────────────

function AppHeader() {
  return (
    <div className="bg-white border-b border-gray-100">
      {/* Delivery mode selector */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <button className="bg-gray-900 text-white text-xs font-semibold rounded-full px-4 py-1.5">
          In store
        </button>
        <button className="text-xs font-medium text-gray-600 px-3 py-1.5">
          Click &amp; Collect
        </button>
        <button className="text-xs font-medium text-gray-600 px-3 py-1.5">
          Delivery
        </button>
      </div>

      {/* Store selector */}
      <div className="px-4 pb-2">
        <button className="flex items-center gap-1.5 text-sm text-gray-800">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#dc2626">
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" opacity="0.2"/>
            <path d="M3 9.5L12 3l9 6.5M9 21V12h6v9" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="12" width="6" height="9" fill="#dc2626" opacity="0.9"/>
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">Coles Tuggeranong</span>
        </button>
      </div>

      {/* Search bar — light grey background like real Coles app */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ backgroundColor: "#F5F5F5" }}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="flex-1 text-sm text-gray-400">Search for products</span>
          <img src="/barcode.png" alt="Scan barcode" className="w-5 h-5 object-contain opacity-60" />
        </div>
      </div>
    </div>
  );
}

// ── Shared category circle wrapper ─────────────────────────────────────────────
// Every icon sits in a w-14 h-14 grey circle — same treatment for all categories.

function CategoryCircle({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#F0F0F0" }}
    >
      <img src={src} alt={alt} className="w-10 h-10 object-contain" />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const Welcome = () => {
  const navigate = useNavigate();

  // Clear in-progress session state on landing so each demo run starts fresh.
  // impactHistory is preserved so the Dashboard shows cumulative impact.
  useEffect(() => {
    localStorage.removeItem("stepGoal");
    localStorage.removeItem("selectedCharity");
    localStorage.removeItem("currentSteps");
  }, []);

  const handleFullReset = () => {
    localStorage.clear();
    toast.success("Demo reset — all data cleared");
  };

  // Pull Walk & Give points from localStorage history
  const history = (() => {
    try { return JSON.parse(localStorage.getItem("impactHistory") || "[]"); }
    catch { return []; }
  })();
  const walkGivePoints = history.reduce(
    (sum: number, item: { points?: number }) => sum + (item.points || 0),
    0
  );
  // Simulated Flybuys total — Walk & Give sits within it
  const flybuysTotal = 1624 + walkGivePoints;
  const flybuysValue = (flybuysTotal / 200).toFixed(2);

  // ── Tabs — real Coles app tabs ─────────────────────────────────────────────
  const tabs: TabItem[] = [
    { icon: <Home className="w-5 h-5" />, label: "Home", active: true },
    { icon: <List className="w-5 h-5" />, label: "Lists" },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Products" },
    { icon: <ShoppingCart className="w-5 h-5" />, label: "Trolley" },
    { icon: <MoreHorizontal className="w-5 h-5" />, label: "More" },
  ];

  // ── Category rows — matches real Coles app order ───────────────────────────
  // Row 1: Bought Before, Down Down, Bonus Credit Products, Meat & Seafood
  // Row 2: Fruit & Vegetables, Dairy Eggs & Fridge, Bakery, Deli
  const categoryRows = [
    [
      { src: "/Bought%20Before.png", alt: "Bought before", label: "Bought before" },
      { src: "/DownDown.png",        alt: "Down Down",     label: "Down Down" },
      { src: "/BonusCreditProducts.png", alt: "Bonus Credit Products", label: "Bonus Credit\nProducts" },
      { src: "/Meat&Seafood.png",  alt: "Meat & Seafood", label: "Meat & Seafood" },
    ],
    [
      { src: "/Banana.png",          alt: "Fruit & Vegetables", label: "Fruit &\nVegetables" },
      { src: "/dairy-products.png",  alt: "Dairy, Eggs & Fridge", label: "Dairy, Eggs\n& Fridge" },
      { src: "/Bakery.png",          alt: "Bakery",         label: "Bakery" },
      { src: "/Deli.png",            alt: "Deli",           label: "Deli" },
    ],
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-[58px]">

      {/* ── Top header ── */}
      <AppHeader />

      <div className="space-y-2">

        {/* ── Browse products + category circles ── */}
        <div className="bg-white">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-base">Browse products</span>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Category grid — 2 rows, 4 across */}
          <div className="px-4 pb-4">
            {categoryRows.map((row, ri) => (
              <div key={ri} className={`grid grid-cols-4 gap-2 ${ri > 0 ? "mt-4" : ""}`}>
                {row.map((cat, ci) => (
                  <button key={ci} className="flex flex-col items-center gap-1.5">
                    <CategoryCircle src={cat.src} alt={cat.alt} />
                    <span className="text-[10px] text-gray-700 text-center leading-tight font-medium w-full whitespace-pre-line">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Coles barcode / scan your barcode block ── */}
        <div className="bg-white px-4 py-4">
          <img src="/Coles_logo.svg" alt="Coles" className="h-6 mb-2" />
          <p className="text-xs text-gray-600 leading-snug">
            Scan your Coles barcode to personalise your shopping preferences. To access your barcode, link to your Flybuys account.
          </p>
          <button className="mt-3 w-full bg-red-600 text-white font-semibold rounded-full py-3 text-sm flex items-center justify-center gap-2">
            <img src="/barcode.png" alt="" className="w-5 h-5 object-contain invert" />
            Scan your barcode
          </button>
        </div>

        {/* ── Flybuys widget — two separate cards side by side ── */}
        <div className="bg-white px-4 pt-4 pb-3">
          <div className="flex gap-2">
            {/* Left card: Flybuys logo + View card link */}
            <div className="flex-1 border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-3">
              <img src="/flybuys.png" alt="Flybuys" className="h-9 w-auto object-contain" />
              <button className="text-sm font-medium text-gray-900 underline underline-offset-2">View card</button>
            </div>

            {/* Right card: points balance + offers */}
            <div className="flex-1 border border-gray-200 rounded-xl p-3 space-y-1">
              <div className="text-xl font-bold text-gray-900 tabular-nums leading-none">
                {flybuysTotal.toLocaleString()} pts
              </div>
              <div className="text-xs text-gray-500">
                worth ${flybuysValue} Flybuys dollars
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  7 offers
                </span>
                <button className="text-xs font-medium text-gray-900 underline underline-offset-2">View offers</button>
              </div>
            </div>
          </div>

          {/* Walk & Give subsection — shown when user has earned points */}
          {walkGivePoints > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              <span className="text-xs text-gray-600">
                Includes <span className="font-semibold">{walkGivePoints} pts</span> from Walk &amp; Give
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <p className="text-[10px] text-gray-400">Flybuys points may take 24 hours to update</p>
          </div>
        </div>

        {/* ── Promotional cards ── */}
        <div className="px-3 space-y-3 pt-1">

          {/* Walk & Give Easter card — main entry point */}
          <div className="rounded-2xl overflow-hidden bg-red-600 text-white">
            <div className="p-5 flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <span className="inline-block text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 uppercase tracking-wide">
                  Easter Special
                </span>
                <h2 className="text-xl font-bold leading-snug">
                  Walk &amp; Give this Easter —<br />Earn 2× bonus Flybuys<br />points in-store
                </h2>
                <p className="text-sm text-white/80">
                  Every step counts. Walk, scan Easter favourites, and choose to keep your points or give back this Easter.
                </p>
                <button
                  onClick={() => navigate("/onboarding")}
                  className="mt-1 inline-flex bg-white text-red-600 font-bold text-sm rounded-full px-5 py-2 hover:bg-gray-50 transition-colors"
                >
                  Start your Easter trip
                </button>
              </div>
              <div className="flex-shrink-0 w-24 h-24 flex items-end justify-center">
                <img src="/easter-bunny.png" alt="Easter bunny" className="w-24 h-24 object-contain drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* Easter Egg Hunt card */}
          <div className="rounded-2xl overflow-hidden bg-red-700 text-white">
            <div className="p-5 flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <span className="text-xs font-semibold bg-white/20 rounded-full px-2 py-0.5 uppercase tracking-wide">
                  Easter Egg Hunt
                </span>
                <h2 className="text-lg font-bold leading-snug">
                  Scan Easter products<br />for bonus points
                </h2>
                <p className="text-sm text-white/80">
                  Hot cross buns, chocolate eggs and more — scan to unlock extra Flybuys points this week.
                </p>
              </div>
              <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center">
                <img src="/easter-eggs.png" alt="Easter eggs" className="w-20 h-20 object-contain drop-shadow" />
              </div>
            </div>
          </div>

          {/* $5 off card */}
          <div className="rounded-2xl overflow-hidden bg-red-600 text-white">
            <div className="p-5 flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center shadow-md">
                <span className="text-red-600 font-black text-base leading-none">$5</span>
                <span className="text-red-600 font-bold text-[9px] uppercase leading-tight">OFF</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-base leading-snug">
                  Get $5 off selected<br />products when you<br />spend $15*
                </h3>
                <p className="text-xs text-white/70 mt-1">Valid on first online shop. T&amp;Cs apply.</p>
              </div>
            </div>
          </div>

          {/* Half-price specials card */}
          <div className="rounded-2xl overflow-hidden bg-yellow-400">
            <div className="p-5 flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border-4 border-yellow-600 flex flex-col items-center justify-center">
                <span className="text-gray-900 font-black text-[10px] leading-tight text-center">
                  1/2<br />PRICE
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base leading-snug">
                  Shop this week's<br />half-price specials.
                </h3>
                <p className="text-sm text-gray-700 mt-0.5">Specials change every week.</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Explore more offers row ── */}
        <div className="bg-white mx-0 px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">Explore more offers</span>
          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* ── T&Cs ── */}
        <div className="px-4 py-2">
          <div className="flex items-start gap-1.5">
            <Info className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-gray-400 leading-relaxed">
              *Walk &amp; Give: Earn points by walking in-store. Valid for Flybuys members. Points awarded on eligible activity only. T&amp;Cs apply. $5 off: Valid on first online shop. Min spend $15. One redemption per customer. Exclusions apply.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="py-6 text-center space-y-2">
          <p className="text-xs text-gray-400">MasterTech Project By Innovation Central Canberra</p>
          <button
            onClick={handleFullReset}
            className="text-[10px] text-gray-300 hover:text-gray-400 transition-colors"
          >
            Reset demo
          </button>
        </div>

      </div>

      {/* ── Fixed bottom tab bar ── */}
      <BottomTabBar tabs={tabs} />
    </div>
  );
};

export default Welcome;
