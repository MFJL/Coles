import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Bone, Plus } from "lucide-react";

const stepGoals = [
  { value: 500, label: "500 steps", subtitle: "Quick shop (5-10 min)" },
  { value: 1000, label: "1,000 steps", subtitle: "Regular shop (15-20 min)" },
  { value: 2000, label: "2,000 steps", subtitle: "Big shop (30-40 min)" },
];

const charities = [
  { 
    id: "SecondBite", 
    name: "SecondBite", 
    description: "Fighting hunger across Australia",
    icon: Heart,
    color: "text-primary"
  },
  { 
    id: "RSPCA", 
    name: "RSPCA", 
    description: "Protecting animals from cruelty",
    icon: Bone,
    color: "text-accent"
  },
  { 
    id: "Red Cross", 
    name: "Red Cross", 
    description: "Supporting communities in need",
    icon: Plus,
    color: "text-primary"
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState(2000);
  const [selectedCharity, setSelectedCharity] = useState("SecondBite");

  const handleStart = () => {
    localStorage.setItem('stepGoal', selectedGoal.toString());
    localStorage.setItem('selectedCharity', selectedCharity);
    localStorage.setItem('currentSteps', '0');
    navigate('/tracker');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="max-w-md mx-auto w-full space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Let's Get Started</h1>
          <p className="text-muted-foreground">Choose your goal and charity</p>
        </div>

        {/* Step Goal Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Choose your step goal</h2>
          <div className="grid gap-3">
            {stepGoals.map((goal) => (
              <Card
                key={goal.value}
                onClick={() => setSelectedGoal(goal.value)}
                className={`p-4 cursor-pointer transition-smooth border-2 ${
                  selectedGoal === goal.value
                    ? 'border-primary bg-primary/5 shadow-card'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{goal.label}</p>
                    <p className="text-sm text-muted-foreground">{goal.subtitle}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedGoal === goal.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedGoal === goal.value && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Charity Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Pick a charity to support</h2>
          <div className="grid gap-3">
            {charities.map((charity) => {
              const Icon = charity.icon;
              return (
                <Card
                  key={charity.id}
                  onClick={() => setSelectedCharity(charity.id)}
                  className={`p-4 cursor-pointer transition-smooth border-2 ${
                    selectedCharity === charity.id
                      ? 'border-primary bg-primary/5 shadow-card'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${charity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{charity.name}</p>
                      <p className="text-sm text-muted-foreground">{charity.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedCharity === charity.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {selectedCharity === charity.id && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleStart}
          size="lg"
          className="w-full gradient-primary text-white font-semibold h-14 shadow-float hover:opacity-90 transition-smooth"
        >
          Let's Walk!
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
