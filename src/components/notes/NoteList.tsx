import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewNote, setIsNewNote] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentNote(newNote);
    setIsNewNote(true);
    setIsDialogOpen(true);
  };

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setIsNewNote(false);
    setIsDialogOpen(true);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const saveNote = () => {
    if (!currentNote) return;
    
    const now = new Date().toISOString();
    
    if (isNewNote) {
      setNotes([
        {
          ...currentNote,
          updatedAt: now
        },
        ...notes
      ]);
    } else {
      setNotes(
        notes.map(note => 
          note.id === currentNote.id 
            ? { ...currentNote, updatedAt: now } 
            : note
        )
      );
    }
    
    setIsDialogOpen(false);
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
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <Button size="sm" onClick={createNewNote}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 col-span-full">
              No notes yet. Create one!
            </p>
          ) : (
            notes.map(note => (
              <Card key={note.id} className="card-hover overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">
                      {note.title || "Untitled Note"}
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => editNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm line-clamp-3 mb-2 min-h-[3em]">
                    {note.content || "No content"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(note.updatedAt)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewNote ? "Create Note" : "Edit Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Note Title"
                value={currentNote?.title || ""}
                onChange={(e) => 
                  setCurrentNote(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Note content..."
                className="min-h-[200px]"
                value={currentNote?.content || ""}
                onChange={(e) => 
                  setCurrentNote(prev => 
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
            <Button onClick={saveNote}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
