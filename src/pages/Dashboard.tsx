import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footprints, Heart, Star, Award, TrendingUp, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const history = JSON.parse(localStorage.getItem('impactHistory') || '[]');
  
  const totalSteps = history.reduce((sum: number, item: any) => sum + item.steps, 0);
  const totalDonations = history.filter((item: any) => item.choice === 'donate').length;
  const totalPoints = history.reduce((sum: number, item: any) => sum + item.points, 0);

  const badges = [
    { id: 'first_walk', name: 'First Steps', icon: Footprints, unlocked: history.length > 0 },
    { id: 'generous', name: 'Generous Heart', icon: Heart, unlocked: totalDonations > 0 },
    { id: 'consistent', name: 'Consistent Walker', icon: Star, unlocked: history.length >= 3 },
    { id: '10k_steps', name: '10K Club', icon: TrendingUp, unlocked: totalSteps >= 10000 },
  ];

  const handleShare = () => {
    toast.success("Shared to social media! 🎉");
  };

  const handleNewWalk = () => {
    localStorage.removeItem('currentSteps');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-card shadow-card sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="font-semibold text-lg">My Impact</span>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </header>

      <main className="p-6 space-y-8 max-w-2xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center space-y-2 shadow-card">
            <Footprints className="w-8 h-8 text-primary mx-auto" />
            <div className="text-2xl font-bold text-foreground">
              {totalSteps.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Steps</p>
          </Card>

          <Card className="p-4 text-center space-y-2 shadow-card">
            <Heart className="w-8 h-8 text-accent mx-auto" />
            <div className="text-2xl font-bold text-foreground">
              {totalDonations}
            </div>
            <p className="text-xs text-muted-foreground">Donations</p>
          </Card>

          <Card className="p-4 text-center space-y-2 shadow-card">
            <Star className="w-8 h-8 text-[hsl(45,100%,50%)] mx-auto" />
            <div className="text-2xl font-bold text-foreground">
              {totalPoints}
            </div>
            <p className="text-xs text-muted-foreground">Points Earned</p>
          </Card>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Your Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <Card
                  key={badge.id}
                  className={`p-6 text-center space-y-3 transition-smooth ${
                    badge.unlocked 
                      ? 'bg-accent/5 border-accent/20 shadow-card' 
                      : 'opacity-50 grayscale'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                    badge.unlocked ? 'gradient-success' : 'bg-muted'
                  }`}>
                    <Icon className={`w-8 h-8 ${badge.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground">{badge.name}</p>
                    {badge.unlocked && (
                      <Badge variant="secondary" className="text-xs">Unlocked</Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {history.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            <div className="space-y-3">
              {history.slice().reverse().map((item: any, index: number) => (
                <Card key={index} className="p-4 shadow-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.choice === 'donate' ? (
                        <Heart className="w-5 h-5 text-accent" />
                      ) : (
                        <Star className="w-5 h-5 text-[hsl(45,100%,50%)]" />
                      )}
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {item.steps.toLocaleString()} steps
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.choice === 'donate' 
                            ? `Donated to ${item.charity}` 
                            : `Earned ${item.points} points`
                          }
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleNewWalk}
          size="lg"
          className="w-full gradient-primary text-white font-semibold h-14 shadow-float hover:opacity-90 transition-smooth"
        >
          Start New Walk
        </Button>
      </main>
    </div>
  );
};

export default Dashboard;
