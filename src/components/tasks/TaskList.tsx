import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowDown, CheckCircle2, Circle, Clock, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  quadrant?: "important-urgent" | "important-not-urgent" | "not-important-urgent" | "not-important-not-urgent";
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      date: new Date().toISOString(),
      quadrant: "important-urgent" // Default quadrant
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskQuadrant = (taskId: string, quadrant: Task["quadrant"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, quadrant } : task
    ));
  };

  const getQuadrantLabel = (quadrant?: Task["quadrant"]) => {
    switch (quadrant) {
      case "important-urgent":
        return "Important & Urgent";
      case "important-not-urgent":
        return "Important & Not Urgent";
      case "not-important-urgent":
        return "Not Important & Urgent";
      case "not-important-not-urgent":
        return "Not Important & Not Urgent";
      default:
        return "Set Priority";
    }
  };

  const getQuadrantIcon = (quadrant?: Task["quadrant"]) => {
    switch (quadrant) {
      case "important-urgent":
        return <div className="flex"><Star className="h-4 w-4 text-red-500 mr-1" /><Clock className="h-4 w-4 text-red-500" /></div>;
      case "important-not-urgent":
        return <Star className="h-4 w-4 text-amber-500" />;
      case "not-important-urgent":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "not-important-not-urgent":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return <></>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask();
            }}
            className="flex-1"
          />
          <Button onClick={addTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </Button>
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2 flex items-center gap-1">
                        {getQuadrantIcon(task.quadrant)}
                        <span className="text-xs hidden md:inline-block">{getQuadrantLabel(task.quadrant)}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateTaskQuadrant(task.id, "important-urgent")}>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-red-500 mr-1" />
                          <Clock className="h-4 w-4 text-red-500 mr-2" />
                          <span>Important & Urgent</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTaskQuadrant(task.id, "important-not-urgent")}>
                        <Star className="h-4 w-4 text-amber-500 mr-2" />
                        <span>Important & Not Urgent</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTaskQuadrant(task.id, "not-important-urgent")}>
                        <Clock className="h-4 w-4 text-blue-500 mr-2" />
                        <span>Not Important & Urgent</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTaskQuadrant(task.id, "not-important-not-urgent")}>
                        <ArrowDown className="h-4 w-4 text-green-500 mr-2" />
                        <span>Not Important & Not Urgent</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
