import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Footprints,
  Sparkles,
  ShoppingCart,
  Loader2,
  Trophy,
  Star,
  Clock,
  Plus,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { DEMO_QUESTS, Quest } from "@/data/quests";
import { QuestCard } from "@/components/QuestCard";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { BarcodeLearnMode } from "@/components/BarcodeLearnMode";
import { useStepEngine, clearTripSession } from "@/hooks/useStepEngine";
import { MAX_POINTS_PER_VISIT } from "@/config/rewards";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Circular SVG progress ring
interface RingProps {
  progress: number; // 0–100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

function ProgressRing({ progress, size = 200, strokeWidth = 12, children }: RingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

const StepTracker = () => {
  const navigate = useNavigate();
  const stepGoal = parseInt(localStorage.getItem("stepGoal") || "2000");

  const {
    steps,
    points,
    elapsedSeconds,
    motionAvailable,
    addManualBoost,
    addQuestBonusPoints,
  } = useStepEngine();

  const [goalReached, setGoalReached] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [recommendation, setRecommendation] = useState(
    "Easter alert! Based on your shopping history, Coles Hot Cross Buns are back — and they're your perfect match. Hop to it!"
  );
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [quests, setQuests] = useState<Quest[]>(DEMO_QUESTS);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLearnModeOpen, setIsLearnModeOpen] = useState(false);

  // Pulse the step number briefly on each change
  const prevStepsRef = useRef(steps);
  const [stepPulse, setStepPulse] = useState(false);
  useEffect(() => {
    if (steps !== prevStepsRef.current) {
      prevStepsRef.current = steps;
      setStepPulse(true);
      const t = setTimeout(() => setStepPulse(false), 180);
      return () => clearTimeout(t);
    }
  }, [steps]);

  // ── Goal detection ────────────────────────────────────────────────────────
  useEffect(() => {
    if (steps >= stepGoal && !goalReached) {
      setGoalReached(true);
      setShowCelebration(true);
      // Burst confetti from both sides then a final centre shower
      const colors = ["#ef4444", "#facc15", "#3b82f6", "#22c55e", "#ec4899", "#f97316"];
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.2, y: 0.55 }, colors });
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.8, y: 0.55 }, colors });
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 100, origin: { x: 0.5, y: 0.4 }, colors });
      }, 300);

      setTimeout(() => {
        setShowCelebration(false);
        clearTripSession();
        navigate("/confirmation");
      }, 2800);
    }
  }, [steps, stepGoal, goalReached, navigate]);

  // ── AI recommendation refresh ─────────────────────────────────────────────
  const fetchRecommendation = async (currentSteps: number) => {
    if (goalReached) return;
    setIsLoadingRecommendation(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/product-recommendations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentSteps, stepGoal }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRecommendation(data.recommendation);
      }
    } catch {
      // Silent fallback — default recommendation stays visible
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  useEffect(() => {
    if (steps > 0 && steps % 200 === 0) fetchRecommendation(steps);
  }, [steps]);

  // ── Quest completion ──────────────────────────────────────────────────────
  const handleScanSuccess = (barcode: string) => {
    const questIndex = quests.findIndex((q) => q.barcode === barcode && !q.completed);
    if (questIndex === -1) return;

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = { ...updatedQuests[questIndex], completed: true };
    setQuests(updatedQuests);

    const completedQuest = updatedQuests[questIndex];
    addQuestBonusPoints(completedQuest.flybuysPoints);

    toast.success("Quest Completed!", {
      description: `You earned ${completedQuest.flybuysPoints} Flybuys points and unlocked ${completedQuest.discount}!`,
    });
  };

  // ── Derived display values ────────────────────────────────────────────────
  const progress = Math.min((steps / stepGoal) * 100, 100);
  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const remainingSteps = Math.max(stepGoal - steps, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="p-4 flex items-center justify-between bg-card shadow-card">
        <div className="flex items-center gap-2">
          <Footprints className="w-6 h-6 text-primary" />
          <span className="font-semibold text-foreground">Walk &amp; Give</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Motion source indicator — small, informational */}
          <div
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              motionAvailable
                ? "bg-green-100 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {motionAvailable ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>Motion</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Auto</span>
              </>
            )}
          </div>
          <ShoppingCart className="w-6 h-6 text-muted-foreground" />
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col items-center p-4 pb-8">
        <div className="max-w-md w-full space-y-4">

          {/* ── Step Counter Card ── */}
          <Card className="p-6 shadow-card">
            {/* Running totals strip */}
            <div className="grid grid-cols-3 gap-2 mb-6 pb-5 border-b border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Star className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Points</span>
                </div>
                <div className="text-xl font-bold tabular-nums">{points}</div>
                <div className="text-[10px] text-muted-foreground">of {MAX_POINTS_PER_VISIT}</div>
              </div>

              <div className="text-center border-x border-border">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Footprints className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">To Go</span>
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {remainingSteps.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">steps</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Time</span>
                </div>
                <div className="text-xl font-bold tabular-nums">{formatDuration(elapsedSeconds)}</div>
                <div className="text-[10px] text-muted-foreground">in store</div>
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex flex-col items-center gap-3">
              <ProgressRing progress={progress}>
                <div className="text-center px-4">
                  <div
                    className={`text-4xl font-bold tabular-nums text-foreground transition-all duration-150 ${
                      stepPulse ? "scale-110 text-primary" : "scale-100"
                    }`}
                  >
                    {steps.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    of {stepGoal.toLocaleString()} steps
                  </div>
                  <div className="text-xs font-semibold text-primary mt-0.5">
                    {Math.round(progress)}%
                  </div>
                </div>
              </ProgressRing>

              {goalReached ? (
                <div className="flex items-center gap-2 text-accent animate-scale-in">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold text-sm">Goal Reached — heading to rewards!</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Keep walking through the store
                </p>
              )}
            </div>

            {/* Manual boost — secondary, always available for testing */}
            <div className="mt-5 flex justify-center">
              <button
                onClick={addManualBoost}
                disabled={goalReached}
                className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 hover:text-foreground hover:border-foreground/30 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3" />
                Quick Step +
              </button>
            </div>
          </Card>

          {/* ── AI Product Recommendation ── */}
          <Card className="p-4 bg-gradient-subtle border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                {isLoadingRecommendation ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground mb-1">AI Recommendation</p>
                <p className="text-sm text-muted-foreground">{recommendation}</p>
              </div>
            </div>
          </Card>

          {/* ── Quests Section ── */}
          <Card className="p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Daily Quests</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLearnModeOpen(true)}
                  className="text-xs"
                >
                  Learn Barcodes
                </Button>
                <div className="text-sm text-muted-foreground">
                  {completedQuestsCount}/{quests.length}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {quests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onScanClick={() => setIsScannerOpen(true)}
                />
              ))}
            </div>

            {completedQuestsCount === quests.length && (
              <div className="bg-gradient-subtle rounded-lg p-4 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-primary mx-auto" />
                <p className="font-semibold text-primary">All Quests Completed!</p>
                <p className="text-sm text-muted-foreground">
                  {points} Flybuys points earned — keep walking!
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* ── Goal Reached Celebration Overlay ── */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in pointer-events-none">
          <div className="text-center space-y-4 animate-celebration">
            <div className="text-white text-3xl font-bold drop-shadow-lg">Goal Reached!</div>
            <div className="text-white/80 text-xl tabular-nums">
              {steps.toLocaleString()} steps
            </div>
            <div className="text-white/70 text-base">{points} Flybuys points earned</div>
          </div>
        </div>
      )}

      {/* ── Barcode Scanner Modal ── */}
      {isScannerOpen && (
        <BarcodeScanner
          quests={quests}
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {/* ── Barcode Learning Mode ── */}
      {isLearnModeOpen && (
        <BarcodeLearnMode onClose={() => setIsLearnModeOpen(false)} />
      )}
    </div>
  );
};

export default StepTracker;
