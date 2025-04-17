
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Plus, Tag as TagIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: string;
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBookmark, setNewBookmark] = useState<Partial<Bookmark>>({
    title: "",
    url: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = () => {
    if (!newBookmark.url || !newBookmark.title) return;
    
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      title: newBookmark.title,
      url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
      tags: newBookmark.tags || [],
      createdAt: new Date().toISOString()
    };
    
    setBookmarks([bookmark, ...bookmarks]);
    setIsDialogOpen(false);
    resetNewBookmarkForm();
  };

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    
    setNewBookmark(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setNewBookmark(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const resetNewBookmarkForm = () => {
    setNewBookmark({
      title: "",
      url: "",
      tags: []
    });
    setTagInput("");
  };

  const openNewBookmarkDialog = () => {
    resetNewBookmarkForm();
    setIsDialogOpen(true);
  };

  const validateUrl = (url: string) => {
    // Basic URL validation
    return url.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/);
  };

  const isValidForm = () => {
    return (
      newBookmark.title && 
      newBookmark.url && 
      validateUrl(newBookmark.url)
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bookmarks</CardTitle>
        <Button size="sm" onClick={openNewBookmarkDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bookmark
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bookmarks yet. Add one!
            </p>
          ) : (
            bookmarks.map(bookmark => (
              <div 
                key={bookmark.id}
                className="flex items-start justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors group"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center mb-1">
                    <LinkIcon className="h-4 w-4 mr-2 text-primary" />
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline truncate max-w-[300px]"
                    >
                      {bookmark.title}
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {bookmark.url}
                  </p>
                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
                  onClick={() => deleteBookmark(bookmark.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Title"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="URL (e.g., https://example.com)"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <TagIcon className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {newBookmark.tags && newBookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newBookmark.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addBookmark} disabled={!isValidForm()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
