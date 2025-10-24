import { Check, Flame } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    icon: string;
    color: string;
    completedDates: string[];
  };
  onToggle: (id: string, date: string) => void;
  today: string;
}

export function HabitCard({ habit, onToggle, today }: HabitCardProps) {
  const isCompletedToday = habit.completedDates.includes(today);
  
  // Calculate current streak
  const calculateStreak = () => {
    const sortedDates = [...habit.completedDates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(sortedDates[i]);
      checkDate.setHours(0, 0, 0, 0);
      
      if (checkDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0 && checkDate.getTime() === new Date(today).getTime() - 86400000) {
        // If today is not completed but yesterday was, start from yesterday
        currentDate.setDate(currentDate.getDate() - 1);
        if (checkDate.getTime() === currentDate.getTime()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // Calculate longest streak
  const calculateLongestStreak = () => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = [...habit.completedDates]
      .map(d => new Date(d).getTime())
      .sort((a, b) => a - b);
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const dayDiff = (sortedDates[i] - sortedDates[i - 1]) / 86400000;
      
      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };
  
  const currentStreak = calculateStreak();
  const longestStreak = calculateLongestStreak();
  
  return (
    <Card className="p-4 transition-all hover:shadow-lg border-2" style={{ borderColor: habit.color }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <span className="text-2xl">{habit.icon}</span>
          </div>
          
          <div className="flex-1">
            <h3 className="mb-1">{habit.name}</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="gap-1">
                <Flame className="w-3 h-3" />
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="gap-1">
                Best: {longestStreak}
              </Badge>
            </div>
          </div>
        </div>
        
        <Button
          size="lg"
          variant={isCompletedToday ? "default" : "outline"}
          className={`w-12 h-12 rounded-full p-0 transition-all ${
            isCompletedToday ? 'scale-110' : ''
          }`}
          style={{
            backgroundColor: isCompletedToday ? habit.color : 'transparent',
            borderColor: habit.color,
            color: isCompletedToday ? 'white' : habit.color,
          }}
          onClick={() => onToggle(habit.id, today)}
        >
          {isCompletedToday && <Check className="w-6 h-6" />}
        </Button>
      </div>
    </Card>
  );
}
