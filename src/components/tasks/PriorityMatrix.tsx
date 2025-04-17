import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import QuadrantPanel from "./matrix/QuadrantPanel";
import useMatrixTasks from "./matrix/useMatrixTasks";

export default function PriorityMatrix() {
  const { tasks, loading, moveTaskToQuadrant, toggleTaskCompletion, deleteTask } = useMatrixTasks();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Priority Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <ResizablePanelGroup direction="vertical" className="rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="grid grid-cols-2 divide-x h-full">
              <QuadrantPanel 
                quadrant="important-urgent"
                title="Important & Urgent"
                description="DO FIRST"
                colorClass="bg-red-50 dark:bg-red-950/20"
                tasks={tasks}
                loading={loading}
                onToggleCompletion={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                onMoveTask={moveTaskToQuadrant}
                iconType="important-urgent"
              />
              <QuadrantPanel
                quadrant="important-not-urgent"
                title="Important & Not Urgent"
                description="SCHEDULE"
                colorClass="bg-amber-50 dark:bg-amber-950/20"
                tasks={tasks}
                loading={loading}
                onToggleCompletion={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                onMoveTask={moveTaskToQuadrant}
                iconType="important-not-urgent"
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="grid grid-cols-2 divide-x h-full">
              <QuadrantPanel
                quadrant="not-important-urgent"
                title="Not Important & Urgent"
                description="DELEGATE"
                colorClass="bg-blue-50 dark:bg-blue-950/20"
                tasks={tasks}
                loading={loading}
                onToggleCompletion={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                onMoveTask={moveTaskToQuadrant}
                iconType="not-important-urgent"
              />
              <QuadrantPanel
                quadrant="not-important-not-urgent"
                title="Not Important & Not Urgent"
                description="ELIMINATE"
                colorClass="bg-green-50 dark:bg-green-950/20"
                tasks={tasks}
                loading={loading}
                onToggleCompletion={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                onMoveTask={moveTaskToQuadrant}
                iconType="not-important-not-urgent"
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
