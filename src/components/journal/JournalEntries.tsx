import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
}

const moodOptions = [
  { value: "happy", label: "Happy" },
  { value: "calm", label: "Calm" },
  { value: "productive", label: "Productive" },
  { value: "tired", label: "Tired" },
  { value: "sad", label: "Sad" },
  { value: "stressed", label: "Stressed" },
  { value: "excited", label: "Excited" },
];

export default function JournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewEntry, setIsNewEntry] = useState(false);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const createNewEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: `Journal Entry - ${formatDate(today)}`,
      content: "",
      mood: "",
      date: today
    };
    
    setCurrentEntry(newEntry);
    setIsNewEntry(true);
    setIsDialogOpen(true);
  };

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setIsNewEntry(false);
    setIsDialogOpen(true);
  };

  const deleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const saveEntry = () => {
    if (!currentEntry) return;
    
    if (isNewEntry) {
      setEntries([currentEntry, ...entries]);
    } else {
      setEntries(
        entries.map(entry => 
          entry.id === currentEntry.id ? currentEntry : entry
        )
      );
    }
    
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMoodEmoji = (mood: string) => {
    switch(mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'productive': return '💪';
      case 'tired': return '😴';
      case 'sad': return '😔';
      case 'stressed': return '😖';
      case 'excited': return '🤩';
      default: return '📝';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Journal</CardTitle>
        <Button size="sm" onClick={createNewEntry}>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No journal entries yet. Start writing today!
            </p>
          ) : (
            entries.map(entry => (
              <Card key={entry.id} className="card-hover">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">{getMoodEmoji(entry.mood)}</span>
                      <CardTitle className="text-base font-medium">
                        {entry.title}
                      </CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => editEntry(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm line-clamp-3 mb-2 min-h-[3em]">
                    {entry.content || "No content"}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(entry.date)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewEntry ? "New Journal Entry" : "Edit Journal Entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Entry Title"
                value={currentEntry?.title || ""}
                onChange={(e) => 
                  setCurrentEntry(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Select
                value={currentEntry?.mood || ""}
                onValueChange={(value) => 
                  setCurrentEntry(prev => 
                    prev ? { ...prev, mood: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="How are you feeling today?" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {getMoodEmoji(option.value)} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your thoughts for today..."
                className="min-h-[200px]"
                value={currentEntry?.content || ""}
                onChange={(e) => 
                  setCurrentEntry(prev => 
                    prev ? { ...prev, content: e.target.value } : null
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEntry}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
