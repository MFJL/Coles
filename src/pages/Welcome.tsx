import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, List, ShoppingCart, Menu, Sparkles, Footprints, Scan, Heart } from "lucide-react";
import { toast } from "sonner";

const Welcome = () => {
  const navigate = useNavigate();

  // Clear in-progress session state on landing so each demo run starts clean.
  // impactHistory is preserved so the Dashboard shows cumulative impact.
  useEffect(() => {
    localStorage.removeItem('stepGoal');
    localStorage.removeItem('selectedCharity');
    localStorage.removeItem('currentSteps');
  }, []);

  const handleFullReset = () => {
    localStorage.clear();
    toast.success("Demo reset — all data cleared");
  };

  const categories = [
    { icon: "🛒", label: "Bought before", color: "bg-blue-600" },
    { icon: "🏷️", label: "My Offers", color: "bg-blue-600", badge: "flybuys" },
    { icon: "⭐", label: "Specials", color: "bg-white", border: true },
    { icon: "🥬", label: "Fresh Specials", color: "bg-white", border: true },
    { icon: "🎉", label: "Bonus Points", color: "bg-pink-600", badge: "BONUS" },
    { icon: "💰", label: "Every Day Value" },
    { icon: "🍖", label: "Meat & Seafood" },
    { icon: "🥐", label: "Bakery" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-medium">
        Walk & Give — Earn Flybuys points every time you shop in-store
      </div>

 {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl"></span>
              </div>
              <span className="font-bold text-xl text-red-600 hidden sm:inline">
                
              </span>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 md:px-4 pr-10 text-sm md:text-base"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button className="hidden md:flex flex-col items-center text-xs text-gray-600">
                <Menu className="w-6 h-6" />
                <span>More</span>
              </button>
              <button className="flex flex-col items-center text-xs text-gray-600">
                <User className="w-6 h-6" />
                <span className="hidden md:inline">Account</span>
              </button>
              <button className="hidden md:flex flex-col items-center text-xs text-gray-600">
                <List className="w-6 h-6" />
                <span>Lists</span>
              </button>
              <button className="flex flex-col items-center text-xs text-gray-600">
                <ShoppingCart className="w-6 h-6" />
                <span className="hidden md:inline">$0.00</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm">
            <button className="flex items-center gap-1 font-medium">
              <Menu className="w-4 h-4" />
              Shop products
            </button>
            <button>Specials & catalogues</button>
            <button>Bought before</button>
            <button>Recipes & inspiration</button>
            <button>Ways to shop</button>
            <button>Help</button>
            <div className="ml-auto flex items-center gap-2">
              <span className="font-semibold">coles</span>
              <span className="text-red-600">plus</span>
              <Badge className="bg-red-600">Free trial</Badge>
            </div>
            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Click & Collect
              <span className="text-xs">Canberra</span>
            </button>
          </div>
        </div>
      </header>

      {/* Category Icons */}
      <div className="bg-gray-50 border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 items-center">
            {categories.map((cat, idx) => (
              <button key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                  cat.color || 'bg-gray-200'
                } ${cat.border ? 'border-2 border-gray-300' : ''}`}>
                  {cat.badge && cat.badge === 'flybuys' && (
                    <span className="text-xs text-white">flybuys</span>
                  )}
                  {cat.badge && cat.badge === 'BONUS' && (
                    <span className="text-xs text-white">BONUS</span>
                  )}
                  {!cat.badge && cat.icon}
                </div>
                <span className="text-xs text-center">{cat.label}</span>
              </button>
            ))}
            <button className="text-gray-400">›</button>
          </div>
        </div>
      </div>

      {/* Walk & Give Campaign Widget */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-white space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Walk & Give</span>
                <Badge className="bg-green-500 text-white border-none text-xs">
                  New
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Walk, Scan & Give<br/>every shop.
              </h1>

              <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto lg:mx-0">
                Earn bonus Flybuys points by walking in-store and scanning products.
                Or donate your rewards to a charity that matters to you.
              </p>

              {/* Feature Cards */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 space-y-3 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Scan className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scan & Earn</h3>
                    <p className="text-sm text-white/80">Scan products on your personalised quest list to unlock bonus points</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-red-600" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Walk & Give</h3>
                    <p className="text-sm text-white/80">Hit your step goal and choose to keep your points or donate to charity</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Footprints className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Every Step Counts</h3>
                    <p className="text-sm text-white/80">The more you walk, the more you earn — for you or your community</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/onboarding')}
                size="lg"
                className="bg-white text-red-600 font-bold hover:bg-gray-50 w-full sm:w-auto"
              >
                Start Shopping & Earning
              </Button>

              <p className="text-xs text-white/70">
                *Walk in-store and scan products to unlock rewards. Valid for Flybuys members.
              </p>
            </div>

            {/* Right - Rewards Circles */}
            <div className="hidden lg:flex gap-6 items-center">
              <div className="text-center animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
                <div className="w-36 h-36 bg-blue-600 rounded-full flex flex-col items-center justify-center shadow-2xl">
                  <p className="text-xs text-white/80">flybuys</p>
                  <p className="text-4xl font-bold text-white">3,000</p>
                  <p className="text-[10px] text-white/70">BONUS<br/>POINTS</p>
                </div>
                <p className="text-white text-sm mt-3">When you spend<br/><span className="font-bold text-lg">$200</span></p>
              </div>

              <div className="text-center animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2s' }}>
                <div className="w-36 h-36 bg-blue-700 rounded-full flex flex-col items-center justify-center shadow-2xl">
                  <p className="text-xs text-white/80">flybuys</p>
                  <p className="text-4xl font-bold text-white">5,000</p>
                  <p className="text-[10px] text-white/70">BONUS<br/>POINTS</p>
                </div>
                <p className="text-white text-sm mt-3">When you spend<br/><span className="font-bold text-lg">$250</span></p>
              </div>

              <div className="text-center animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '2s' }}>
                <div className="w-36 h-36 bg-blue-800 rounded-full flex flex-col items-center justify-center shadow-2xl">
                  <p className="text-xs text-white/80">flybuys</p>
                  <p className="text-4xl font-bold text-white">8,000</p>
                  <p className="text-[10px] text-white/70">BONUS<br/>POINTS</p>
                </div>
                <p className="text-white text-sm mt-3">When you spend<br/><span className="font-bold text-lg">$350</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More content sections would go here */}
      <div className="py-12 text-center text-gray-500 space-y-2">
        <p>MasterTech Project By Innovation Central Canberra</p>
        <button
          onClick={handleFullReset}
          className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
        >
          Reset demo
        </button>
      </div>
    </div>
  );
};

export default Welcome;
