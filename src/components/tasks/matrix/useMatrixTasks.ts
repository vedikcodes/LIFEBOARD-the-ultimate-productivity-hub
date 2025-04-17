import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Task } from "../TaskList";
import { MatrixQuadrant, MatrixTask } from "./types";

export default function useMatrixTasks() {
  const [tasks, setTasks] = useState<MatrixTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage or Supabase
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const storedTasks = localStorage.getItem("tasks");
        let parsedTasks: MatrixTask[] = [];
        
        if (storedTasks) {
          const localTasks: Task[] = JSON.parse(storedTasks);
          parsedTasks = localTasks.map(task => ({
            ...task,
            // Default to important-urgent if no quadrant is specified
            quadrant: (task as any).quadrant || "important-urgent"
          }));
        } else {
          // Try fetching from Supabase if user is authenticated
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data, error } = await supabase
              .from('tasks')
              .select('*');
              
            if (error) throw error;
            
            if (data) {
              parsedTasks = data.map(task => ({
                id: task.id,
                title: task.title,
                completed: task.is_completed || false,
                date: task.created_at,
                // For Supabase tasks, we need to use quadrant field or default
                quadrant: ((task as any).quadrant as MatrixQuadrant) || "important-urgent"
              }));
            }
          }
        }
        
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast({
          title: "Error Loading Tasks",
          description: "Could not load your tasks. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  // Save tasks to localStorage and/or Supabase when tasks change
  useEffect(() => {
    if (!loading) {
      // Save to localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
      
      // Could also save to Supabase here if authenticated
    }
  }, [tasks, loading]);

  const moveTaskToQuadrant = (taskId: string, quadrant: MatrixQuadrant) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, quadrant } 
          : task
      )
    );
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return {
    tasks,
    loading,
    moveTaskToQuadrant,
    toggleTaskCompletion,
    deleteTask
  };
}
