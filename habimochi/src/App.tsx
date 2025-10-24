import { useState, useEffect } from "react";
import { HabitCard } from "./componets/HabitCard";
import { CalendarView } from "./componets/CalendarView";
import { AddHabitDialog } from "./componets/AddHabitDialog";
import { Sparkles, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./componets/ui/tabs";

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedDates: string[];
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('kawaii-habits');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: '1',
        name: 'Morning Exercise',
        icon: '💪',
        color: '#E91E8C',
        completedDates: [
          '2025-10-20',
          '2025-10-21',
          '2025-10-22',
          '2025-10-23',
          '2025-10-24',
        ],
      },
      {
        id: '2',
        name: 'Read 30 Minutes',
        icon: '📚',
        color: '#DDA5E8',
        completedDates: [
          '2025-10-22',
          '2025-10-23',
          '2025-10-24',
        ],
      },
      {
        id: '3',
        name: 'Drink Water',
        icon: '💧',
        color: '#C77DFF',
        completedDates: [
          '2025-10-23',
          '2025-10-24',
        ],
      },
    ];
  });
  
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    localStorage.setItem('kawaii-habits', JSON.stringify(habits));
  }, [habits]);
  
  const handleToggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(date);
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== date)
            : [...habit.completedDates, date],
        };
      }
      return habit;
    }));
  };
  
  const handleAddHabit = (name: string, icon: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
      color,
      completedDates: [],
    };
    setHabits(prev => [...prev, newHabit]);
  };
  
  const totalCompletedToday = habits.filter(h => 
    h.completedDates.includes(today)
  ).length;
  
  const totalActiveStreaks = habits.reduce((sum, habit) => {
    const sortedDates = [...habit.completedDates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    if (sortedDates.length === 0) return sum;
    
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
        currentDate.setDate(currentDate.getDate() - 1);
        if (checkDate.getTime() === currentDate.getTime()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
      } else {
        break;
      }
    }
    
    return sum + streak;
  }, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Kawaii Habit Tracker
            </h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Build amazing habits, one cute day at a time! ✨
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border-2 border-pink-200">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl mb-1" style={{ color: '#E91E8C' }}>
              {habits.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Habits</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border-2 border-purple-200">
            <div className="text-4xl mb-2">✨</div>
            <div className="text-3xl mb-1" style={{ color: '#DDA5E8' }}>
              {totalCompletedToday}
            </div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border-2 border-pink-200">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl mb-1" style={{ color: '#C77DFF' }}>
              {totalActiveStreaks}
            </div>
            <div className="text-sm text-muted-foreground">Total Streak Days</div>
          </div>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="habits" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="habits" className="gap-2">
                <Sparkles className="w-4 h-4" />
                My Habits
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="habits" className="space-y-4">
            <div className="flex justify-end">
              <AddHabitDialog onAdd={handleAddHabit} />
            </div>
            
            {habits.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-pink-200">
                <div className="text-6xl mb-4">🌸</div>
                <h3 className="mb-2">No habits yet!</h3>
                <p className="text-muted-foreground mb-6">
                  Start your journey by creating your first habit
                </p>
                <AddHabitDialog onAdd={handleAddHabit} />
              </div>
            ) : (
              <div className="grid gap-4">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={handleToggleHabit}
                    today={today}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calendar">
            {habits.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-pink-200">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="mb-2">No habits to track!</h3>
                <p className="text-muted-foreground mb-6">
                  Create some habits to see your calendar visualization
                </p>
                <AddHabitDialog onAdd={handleAddHabit} />
              </div>
            ) : (
              <CalendarView
                habits={habits}
                selectedHabitId={selectedHabitId}
                onSelectHabit={setSelectedHabitId}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
