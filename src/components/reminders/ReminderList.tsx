import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bell, Calendar, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  completed: boolean;
}

export default function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    date: "",
    time: "",
    completed: false
  });

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem("reminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!newReminder.title || !newReminder.date) return;
    
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      date: newReminder.date,
      time: newReminder.time || "",
      completed: false
    };
    
    setReminders([reminder, ...reminders].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    }));
    
    setIsDialogOpen(false);
    resetNewReminderForm();
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  const toggleReminderCompletion = (reminderId: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, completed: !reminder.completed } 
        : reminder
    ));
  };

  const resetNewReminderForm = () => {
    setNewReminder({
      title: "",
      date: "",
      time: "",
      completed: false
    });
  };

  const formatDateTime = (date: string, time?: string) => {
    const dateObj = new Date(`${date}T${time || '00:00'}`);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    
    return {
      dateStr: dateObj.toLocaleDateString(undefined, options),
      timeStr: time ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
    };
  };

  const isUpcoming = (date: string, time?: string) => {
    const reminderDate = new Date(`${date}T${time || '00:00'}`);
    const now = new Date();
    return reminderDate > now;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reminders</CardTitle>
        <Button 
          size="sm" 
          onClick={() => {
            resetNewReminderForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No reminders yet. Add one!
            </p>
          ) : (
            reminders.map(reminder => {
              const { dateStr, timeStr } = formatDateTime(reminder.date, reminder.time);
              const upcoming = isUpcoming(reminder.date, reminder.time);
              
              return (
                <div 
                  key={reminder.id}
                  className={`flex items-start justify-between p-4 border rounded-md transition-colors group ${
                    reminder.completed 
                      ? 'bg-muted/30' 
                      : upcoming 
                        ? 'hover:bg-accent/50' 
                        : 'bg-muted/10 hover:bg-accent/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 mt-0.5"
                      onClick={() => toggleReminderCompletion(reminder.id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={reminder.completed}
                        readOnly
                        className="h-4 w-4"
                      />
                    </Button>
                    <div className="flex-1">
                      <p className={`font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {reminder.title}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{dateStr}</span>
                        {timeStr && (
                          <>
                            <span className="mx-1">•</span>
                            <Bell className="h-3 w-3 mr-1" />
                            <span>{timeStr}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {upcoming && !reminder.completed && (
                      <Badge variant="outline" className="text-xs bg-primary/10">
                        Upcoming
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addReminder} 
              disabled={!newReminder.title || !newReminder.date}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
