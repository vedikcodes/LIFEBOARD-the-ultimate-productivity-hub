
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { MatrixTask } from "./types";

interface TaskItemProps {
  task: MatrixTask;
  onToggleCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskItem({ task, onToggleCompletion, onDeleteTask }: TaskItemProps) {
  return (
    <div 
      className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/50 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onToggleCompletion(task.id)}
        >
          {task.completed ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </Button>
        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
          {task.title}
        </span>
      </div>
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onDeleteTask(task.id)}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
