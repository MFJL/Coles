import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quest } from "@/data/quests";
import { Scan, CheckCircle2, Star } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  onScanClick: () => void;
}

export const QuestCard = ({ quest, onScanClick }: QuestCardProps) => {
  return (
    <Card className={`p-4 transition-all ${
      quest.completed
        ? "bg-green-50 border-green-200"
        : "bg-card hover:shadow-md"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold ${
              quest.completed ? "text-green-700" : "text-foreground"
            }`}>
              {quest.title}
            </h4>
            {quest.completed && (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
          </div>

          <p className={`text-sm ${
            quest.completed ? "text-green-600" : "text-muted-foreground"
          }`}>
            {quest.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              {quest.flybuysPoints} pts
            </Badge>
            <Badge variant="outline" className="text-xs font-bold text-primary">
              {quest.discount}
            </Badge>
          </div>
        </div>

        <Button
          onClick={onScanClick}
          disabled={quest.completed}
          size="sm"
          variant={quest.completed ? "outline" : "default"}
          className={quest.completed ? "opacity-50" : ""}
        >
          {quest.completed ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <>
              <Scan className="w-4 h-4 mr-1" />
              Scan
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
