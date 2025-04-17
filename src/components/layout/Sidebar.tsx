import ThemeToggle from "@/components/layout/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
    Bookmark,
    BookOpenText,
    CheckSquare,
    Clock,
    Home,
    LayoutGrid,
    LogOut,
    Search,
    Settings,
    StickyNote
} from "lucide-react";
  
  const navigation = [
    { name: "Dashboard", icon: Home, id: "dashboard" },
    { name: "Tasks", icon: CheckSquare, id: "tasks" },
    { name: "Priority Matrix", icon: LayoutGrid, id: "priority-matrix" },
    { name: "Notes", icon: StickyNote, id: "notes" },
    { name: "Bookmarks", icon: Bookmark, id: "bookmarks" },
    { name: "Reminders", icon: Clock, id: "reminders" },
    { name: "Journal", icon: BookOpenText, id: "journal" },
  ];
  
  interface AppSidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
  }
  
  export default function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
    const { toast } = useToast();
  
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    };
  
    return (
      <Sidebar className="border-r">
        <SidebarHeader className="py-6">
          <div className="flex items-center px-6">
            <div className="h-9 w-9 rounded-full bg-brand-purple flex items-center justify-center">
              <span className="text-white font-bold text-lg">LB</span>
            </div>
            <span className="ml-2 text-lg font-semibold">LifeBoard</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      className={activeView === item.id ? "bg-accent text-accent-foreground" : ""}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView("search")}>
                    <Search className="h-5 w-5 mr-3" />
                    <span>Search</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView("settings")}>
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout}>
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }
  