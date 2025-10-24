import { useState } from "react";
import type { SVGProps } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

interface AddHabitDialogProps {
  onAdd: (name: string, icon: string, color: string) => void;
}

const emojiOptions = ["💪", "📚", "🏃‍♀️", "💧", "🧘‍♀️", "🎨", "✍️", "🎵", "🌸", "⭐"];
const colorOptions = [
  "#E91E8C", // Hot pink
  "#DDA5E8", // Lavender
  "#FFB3D9", // Light pink
  "#C77DFF", // Purple
  "#FF99C8", // Pink
  "#B388FF", // Light purple
  "#FF80AB", // Rose pink
  "#CE93D8", // Medium purple
];

export function AddHabitDialog({ onAdd }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(emojiOptions[0]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), selectedIcon, selectedColor);
    setName("");
    setSelectedIcon(emojiOptions[0]);
    setSelectedColor(colorOptions[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-lg">
          <PlusIcon className="w-5 h-5" />
          New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning Exercise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Choose Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {emojiOptions.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
                    selectedIcon === emoji 
                      ? 'ring-2 ring-primary scale-110' 
                      : 'bg-muted'
                  }`}
                  onClick={() => setSelectedIcon(emoji)}
                >
                  <span className="text-2xl">{emoji}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Choose Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-12 h-12 rounded-xl transition-all hover:scale-110 ${
                    selectedColor === color 
                      ? 'ring-2 ring-offset-2 scale-110' 
                      : ''
                  }`}
                  style={{ 
                    backgroundColor: color,
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Create Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
