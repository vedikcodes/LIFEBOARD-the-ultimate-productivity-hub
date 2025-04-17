
import { Clock, Star } from "lucide-react";
import TaskItem from "./TaskItem";
import { QuadrantPanelProps } from "./types";

export default function QuadrantPanel({
  quadrant,
  title,
  description,
  colorClass,
  tasks,
  loading,
  iconType,
  onToggleCompletion,
  onDeleteTask,
  onMoveTask
}: QuadrantPanelProps) {
  
  const getQuadrantTasks = () => {
    return tasks.filter(task => task.quadrant === quadrant);
  };

  const renderQuadrantIcon = () => {
    switch (iconType) {
      case "important-urgent":
        return (
          <>
            <Star className="h-5 w-5 text-red-500 mr-2" />
            <Clock className="h-5 w-5 text-red-500 mr-2" />
          </>
        );
      case "important-not-urgent":
        return <Star className="h-5 w-5 text-amber-500 mr-2" />;
      case "not-important-urgent":
        return <Clock className="h-5 w-5 text-blue-500 mr-2" />;
      case "not-important-not-urgent":
        return null;
      default:
        return null;
    }
  };

  const quadrantTasks = getQuadrantTasks();

  return (
    <div className={`p-4 flex flex-col ${colorClass}`}>
      <div className="flex items-center mb-4">
        {renderQuadrantIcon()}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <div className="space-y-2">
        {loading ? (
          <p className="text-center text-muted-foreground py-2">Loading tasks...</p>
        ) : quadrantTasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-2">No tasks</p>
        ) : (
          quadrantTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleCompletion={onToggleCompletion}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
