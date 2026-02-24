import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Heart, Star } from "lucide-react";
import { toast } from "sonner";

const Confirmation = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'points' | 'donate' | null>(null);
  const stepGoal = parseInt(localStorage.getItem('stepGoal') || '2000');
  const charityName = localStorage.getItem('selectedCharity') || 'SecondBite';
  const points = Math.floor(stepGoal / 100) * 5;

  const handleConfirm = () => {
    if (!selectedOption) {
      toast.error("Please select an option");
      return;
    }

    const message = selectedOption === 'points' 
      ? `You earned ${points} Flybuys points! 🎉`
      : `Thank you for donating to ${charityName}! ❤️`;

    toast.success(message);

    // Save to history
    const history = JSON.parse(localStorage.getItem('impactHistory') || '[]');
    history.push({
      date: new Date().toISOString(),
      steps: stepGoal,
      choice: selectedOption,
      charity: charityName,
      points: selectedOption === 'points' ? points : 0,
    });
    localStorage.setItem('impactHistory', JSON.stringify(history));

    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="mx-auto w-24 h-24 gradient-success rounded-full flex items-center justify-center shadow-float animate-celebration">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Amazing Work!</h1>
            <p className="text-lg text-muted-foreground">
              You walked <span className="font-bold text-foreground">{stepGoal.toLocaleString()} steps</span>
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground text-center">
            Choose your reward
          </h2>

          <Card
            onClick={() => setSelectedOption('points')}
            className={`p-6 cursor-pointer transition-smooth border-2 ${
              selectedOption === 'points'
                ? 'border-primary bg-primary/5 shadow-card'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[hsl(45,100%,50%)]/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-[hsl(45,100%,50%)]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">Convert to Flybuys Points</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Earn <span className="font-bold text-foreground">{points} bonus points</span> added to your account
                </p>
              </div>
            </div>
          </Card>

          <Card
            onClick={() => setSelectedOption('donate')}
            className={`p-6 cursor-pointer transition-smooth border-2 ${
              selectedOption === 'donate'
                ? 'border-accent bg-accent/5 shadow-card'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-accent" fill="currentColor" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">Donate to {charityName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Coles will donate <span className="font-bold text-foreground">${(points / 10).toFixed(2)}</span> on your behalf
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!selectedOption}
          size="lg"
          className="w-full gradient-primary text-white font-semibold h-14 shadow-float hover:opacity-90 transition-smooth"
        >
          Confirm Choice
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
