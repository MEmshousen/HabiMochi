const ChevronLeft = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CalendarViewProps {
  habits: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    completedDates: string[];
  }>;
  selectedHabitId: string | null;
  onSelectHabit: (id: string | null) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function CalendarView({ 
  habits, 
  selectedHabitId, 
  onSelectHabit,
  currentMonth,
  onMonthChange 
}: CalendarViewProps) {
  const selectedHabit = selectedHabitId 
    ? habits.find(h => h.id === selectedHabitId) 
    : null;
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startDayOfWeek, year, month };
  };
  
  const { daysInMonth, startDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  const isDateCompleted = (day: number) => {
    if (!selectedHabit) return false;
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return selectedHabit.completedDates.includes(dateStr);
  };
  
  const getCompletionCount = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return habits.filter(h => h.completedDates.includes(dateStr)).length;
  };
  
  const prevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };
  
  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2>{monthNames[month]} {year}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap mb-4">
          <Button
            size="sm"
            variant={selectedHabitId === null ? "default" : "outline"}
            onClick={() => onSelectHabit(null)}
          >
            All Habits
          </Button>
          {habits.map(habit => (
            <Button
              key={habit.id}
              size="sm"
              variant={selectedHabitId === habit.id ? "default" : "outline"}
              onClick={() => onSelectHabit(habit.id)}
              style={{
                backgroundColor: selectedHabitId === habit.id ? habit.color : 'transparent',
                borderColor: habit.color,
                color: selectedHabitId === habit.id ? 'white' : habit.color,
              }}
            >
              <span className="mr-1">{habit.icon}</span>
              {habit.name}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => (
            <div key={day} className="text-center p-2 opacity-60">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }
            
            const isCompleted = isDateCompleted(day);
            const completionCount = getCompletionCount(day);
            const today = new Date();
            const isToday = 
              day === today.getDate() && 
              month === today.getMonth() && 
              year === today.getFullYear();
            
            return (
              <div
                key={day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all relative ${
                  isToday ? 'ring-2 ring-primary' : ''
                }`}
                style={{
                  backgroundColor: selectedHabit 
                    ? (isCompleted ? selectedHabit.color + '40' : '#FFF9FB')
                    : '#FFF9FB',
                }}
              >
                <span className={isToday ? 'font-bold' : ''}>{day}</span>
                {!selectedHabit && completionCount > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: Math.min(completionCount, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: habits[i % habits.length]?.color || '#E91E8C' }}
                      />
                    ))}
                  </div>
                )}
                {selectedHabit && isCompleted && (
                  <div 
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: selectedHabit.color }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
