import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bookmark, CalendarClock, CheckCircle2 } from "lucide-react";
import { JournalEntry } from "../journal/JournalEntries";
import { Note } from "../notes/NoteList";
import { Reminder } from "../reminders/ReminderList";
import { Task } from "../tasks/TaskList";
import QuoteOfDay from "./QuoteOfDay";
import Weather from "./Weather";

interface DashboardProps {
  setActiveView: (view: string) => void;
}

export default function DashboardView({ setActiveView }: DashboardProps) {
  // Get data from localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]") as Task[];
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]") as Reminder[];
  const notes = JSON.parse(localStorage.getItem("notes") || "[]") as Note[];
  const journals = JSON.parse(localStorage.getItem("journalEntries") || "[]") as JournalEntry[];

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const upcomingReminders = reminders.filter(reminder => {
    const reminderDate = new Date(`${reminder.date}T${reminder.time || '00:00'}`);
    return reminderDate > new Date() && !reminder.completed;
  }).length;
  
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">{formatDate()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => setActiveView("tasks")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}/{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks === tasks.length && tasks.length > 0 
                ? "All tasks completed!" 
                : `${tasks.length - completedTasks} tasks remaining`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => setActiveView("reminders")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reminders</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingReminders}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingReminders === 0 
                ? "No upcoming reminders" 
                : upcomingReminders === 1 
                  ? "1 upcoming reminder" 
                  : `${upcomingReminders} upcoming reminders`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => setActiveView("notes")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">
              {notes.length === 0 
                ? "No notes yet" 
                : notes.length === 1 
                  ? "1 note saved" 
                  : `${notes.length} notes saved`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => setActiveView("bookmarks")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{JSON.parse(localStorage.getItem("bookmarks") || "[]").length}</div>
            <p className="text-xs text-muted-foreground">
              {JSON.parse(localStorage.getItem("bookmarks") || "[]").length === 0 
                ? "No bookmarks saved" 
                : "Links saved for later"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Weather />
        <QuoteOfDay />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[400px] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <button 
                className="text-sm text-primary hover:underline"
                onClick={() => setActiveView("tasks")}
              >
                View all
              </button>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[320px]">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tasks yet</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50">
                    <div className={`h-4 w-4 rounded-full ${task.completed ? 'bg-primary' : 'border border-muted-foreground'}`}></div>
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                      {task.title}
                    </span>
                  </div>
                ))}
                {tasks.length > 5 && (
                  <p className="text-center text-muted-foreground text-sm pt-2">
                    +{tasks.length - 5} more tasks
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-[400px] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Journal Entries</CardTitle>
              <button 
                className="text-sm text-primary hover:underline"
                onClick={() => setActiveView("journal")}
              >
                View all
              </button>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[320px]">
            {journals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No journal entries yet</p>
            ) : (
              <div className="space-y-4">
                {journals.slice(0, 3).map(entry => (
                  <Card key={entry.id} className="card-hover">
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm font-medium">
                        {entry.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs line-clamp-2">{entry.content || "No content"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {journals.length > 3 && (
                  <p className="text-center text-muted-foreground text-sm pt-2">
                    +{journals.length - 3} more entries
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
