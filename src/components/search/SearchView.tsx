import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark as BookmarkIcon, BookOpen, CheckSquare, Clock, Search, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { Bookmark } from "../bookmarks/BookmarkList";
import { JournalEntry } from "../journal/JournalEntries";
import { Note } from "../notes/NoteList";
import { Reminder } from "../reminders/ReminderList";
import { Task } from "../tasks/TaskList";

interface SearchViewProps {
  setActiveView: (view: string) => void;
}

export default function SearchView({ setActiveView }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem("tasks") || "[]"));
    setNotes(JSON.parse(localStorage.getItem("notes") || "[]"));
    setBookmarks(JSON.parse(localStorage.getItem("bookmarks") || "[]"));
    setReminders(JSON.parse(localStorage.getItem("reminders") || "[]"));
    setJournals(JSON.parse(localStorage.getItem("journalEntries") || "[]"));
  }, []);
  
  // Filter items based on search query
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredReminders = reminders.filter(reminder => 
    reminder.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredJournals = journals.filter(journal => 
    journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    journal.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getTotalResults = () => {
    return filteredTasks.length + filteredNotes.length + filteredBookmarks.length + 
           filteredReminders.length + filteredJournals.length;
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Search</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for tasks, notes, bookmarks, reminders, and journal entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {searchQuery && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Found {getTotalResults()} results for "{searchQuery}"
          </p>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="journals">Journal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {getTotalResults() === 0 ? (
                <p className="text-center text-muted-foreground py-12">No results found</p>
              ) : (
                <>
                  {filteredTasks.length > 0 && (
                    <SearchResultSection 
                      title="Tasks" 
                      icon={<CheckSquare className="h-5 w-5" />}
                      viewAll={() => setActiveView("tasks")}
                    >
                      {filteredTasks.slice(0, 3).map(task => (
                        <div 
                          key={task.id}
                          className="flex items-center p-3 border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <div className={`h-4 w-4 rounded-full mr-3 ${task.completed ? 'bg-primary' : 'border border-muted-foreground'}`}></div>
                          <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </SearchResultSection>
                  )}
                  
                  {filteredNotes.length > 0 && (
                    <SearchResultSection 
                      title="Notes" 
                      icon={<StickyNote className="h-5 w-5" />}
                      viewAll={() => setActiveView("notes")}
                    >
                      {filteredNotes.slice(0, 3).map(note => (
                        <div 
                          key={note.id}
                          className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <div className="font-medium">{note.title || "Untitled Note"}</div>
                          <p className="text-sm line-clamp-2 text-muted-foreground mt-1">
                            {note.content || "No content"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(note.updatedAt)}
                          </p>
                        </div>
                      ))}
                    </SearchResultSection>
                  )}
                  
                  {filteredBookmarks.length > 0 && (
                    <SearchResultSection 
                      title="Bookmarks" 
                      icon={<BookmarkIcon className="h-5 w-5" />}
                      viewAll={() => setActiveView("bookmarks")}
                    >
                      {filteredBookmarks.slice(0, 3).map(bookmark => (
                        <div 
                          key={bookmark.id}
                          className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <a 
                            href={bookmark.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                          >
                            {bookmark.title}
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">
                            {bookmark.url}
                          </p>
                        </div>
                      ))}
                    </SearchResultSection>
                  )}
                  
                  {filteredReminders.length > 0 && (
                    <SearchResultSection 
                      title="Reminders" 
                      icon={<Clock className="h-5 w-5" />}
                      viewAll={() => setActiveView("reminders")}
                    >
                      {filteredReminders.slice(0, 3).map(reminder => (
                        <div 
                          key={reminder.id}
                          className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <div className="font-medium">{reminder.title}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(reminder.date)}
                            {reminder.time && ` at ${reminder.time}`}
                          </p>
                        </div>
                      ))}
                    </SearchResultSection>
                  )}
                  
                  {filteredJournals.length > 0 && (
                    <SearchResultSection 
                      title="Journal Entries" 
                      icon={<BookOpen className="h-5 w-5" />}
                      viewAll={() => setActiveView("journal")}
                    >
                      {filteredJournals.slice(0, 3).map(journal => (
                        <div 
                          key={journal.id}
                          className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <div className="font-medium">{journal.title}</div>
                          <p className="text-sm line-clamp-2 text-muted-foreground mt-1">
                            {journal.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(journal.date)}
                          </p>
                        </div>
                      ))}
                    </SearchResultSection>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="tasks">
              <SearchResultList
                items={filteredTasks}
                emptyMessage="No tasks found"
                renderItem={(task) => (
                  <div className="flex items-center p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <div className={`h-4 w-4 rounded-full mr-3 ${task.completed ? 'bg-primary' : 'border border-muted-foreground'}`}></div>
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                      {task.title}
                    </span>
                  </div>
                )}
              />
            </TabsContent>
            
            <TabsContent value="notes">
              <SearchResultList
                items={filteredNotes}
                emptyMessage="No notes found"
                renderItem={(note) => (
                  <div className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <div className="font-medium">{note.title || "Untitled Note"}</div>
                    <p className="text-sm line-clamp-2 text-muted-foreground mt-1">
                      {note.content || "No content"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(note.updatedAt)}
                    </p>
                  </div>
                )}
              />
            </TabsContent>
            
            <TabsContent value="bookmarks">
              <SearchResultList
                items={filteredBookmarks}
                emptyMessage="No bookmarks found"
                renderItem={(bookmark) => (
                  <div className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {bookmark.title}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      {bookmark.url}
                    </p>
                  </div>
                )}
              />
            </TabsContent>
            
            <TabsContent value="reminders">
              <SearchResultList
                items={filteredReminders}
                emptyMessage="No reminders found"
                renderItem={(reminder) => (
                  <div className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <div className="font-medium">{reminder.title}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(reminder.date)}
                      {reminder.time && ` at ${reminder.time}`}
                    </p>
                  </div>
                )}
              />
            </TabsContent>
            
            <TabsContent value="journals">
              <SearchResultList
                items={filteredJournals}
                emptyMessage="No journal entries found"
                renderItem={(journal) => (
                  <div className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <div className="font-medium">{journal.title}</div>
                    <p className="text-sm line-clamp-2 text-muted-foreground mt-1">
                      {journal.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(journal.date)}
                    </p>
                  </div>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

interface SearchResultSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  viewAll: () => void;
}

function SearchResultSection({ title, icon, children, viewAll }: SearchResultSectionProps) {
  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <button 
            className="text-sm text-primary hover:underline"
            onClick={viewAll}
          >
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}

interface SearchResultListProps<T> {
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
}

function SearchResultList<T>({ items, emptyMessage, renderItem }: SearchResultListProps<T>) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{emptyMessage}</p>
      ) : (
        items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))
      )}
    </div>
  );
}
