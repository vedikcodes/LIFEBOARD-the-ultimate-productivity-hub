import BookmarkList from "@/components/bookmarks/BookmarkList";
import DashboardView from "@/components/dashboard/DashboardView";
import JournalEntries from "@/components/journal/JournalEntries";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/Sidebar";
import NoteList from "@/components/notes/NoteList";
import ReminderList from "@/components/reminders/ReminderList";
import SearchView from "@/components/search/SearchView";
import PriorityMatrix from "@/components/tasks/PriorityMatrix";
import TaskList from "@/components/tasks/TaskList";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  
  // Check and load theme preference
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView setActiveView={setActiveView} />;
      case "tasks":
        return <TaskList />;
      case "priority-matrix":
        return <PriorityMatrix />;
      case "notes":
        return <NoteList />;
      case "bookmarks":
        return <BookmarkList />;
      case "reminders":
        return <ReminderList />;
      case "journal":
        return <JournalEntries />;
      case "search":
        return <SearchView setActiveView={setActiveView} />;
      case "settings":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Settings</h2>
              <p className="text-muted-foreground">Settings will be available in future updates.</p>
            </div>
          </div>
        );
      default:
        return <DashboardView setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              {renderActiveView()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
