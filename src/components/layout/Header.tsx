import ThemeToggle from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="border-b h-16 flex items-center justify-between px-4 lg:px-8 bg-background sticky top-0 z-10">
      {isMobile && (
        <SidebarTrigger className="mr-2">
          <Button variant="ghost" size="icon">
            <span className="sr-only">Toggle sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        </SidebarTrigger>
      )}
      
      <div className={isMobile ? "hidden" : "w-full max-w-md"}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-muted border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </Button>
        {!isMobile && <ThemeToggle />}
      </div>
    </header>
  );
}
