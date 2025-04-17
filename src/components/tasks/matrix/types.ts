
import { Task } from "../TaskList";

export type MatrixQuadrant = "important-urgent" | "important-not-urgent" | "not-important-urgent" | "not-important-not-urgent";

export interface MatrixTask extends Task {
  quadrant: MatrixQuadrant;
}

export type IconType = MatrixQuadrant;

export interface QuadrantPanelProps {
  quadrant: MatrixQuadrant;
  title: string;
  description: string;
  colorClass: string;
  tasks: MatrixTask[];
  loading: boolean;
  iconType: IconType;
  onToggleCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, quadrant: MatrixQuadrant) => void;
}
