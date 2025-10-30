import type { KanbanTask } from "./KanbanTypes";

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color?: string;
  maxTasks?: number;
  custom?: boolean;
}

export const defaultColumns: Column[] = [
  { id: "todo", title: "To Do", taskIds: ["task-1"], maxTasks: 12 },
  { id: "in-progress", title: "In Progress", taskIds: ["task-2"], maxTasks: 8 },
  { id: "done", title: "Done", taskIds: ["task-3", "task-4"] }
];

export const defaultTasks: Record<string, KanbanTask> = {
  "task-1": {
    id: "task-1",
    title: "Implement drag and drop",
    status: "todo",
    createdAt: new Date().toISOString(),
    priority: "high",
    assignee: "John Doe",
    description: "Enable drag and drop on cards",
    tags: ["frontend"],
  },
  "task-2": {
    id: "task-2",
    title: "Design task modal",
    status: "in-progress",
    createdAt: new Date().toISOString(),
    priority: "medium",
    assignee: "Jane",
    description: "Create modal for task details",
    tags: ["ui"],
  },
  "task-3": {
    id: "task-3",
    title: "Setup TypeScript",
    status: "done",
    createdAt: new Date().toISOString(),
    priority: "urgent",
    assignee: "John",
    description: "Install and configure TS",
    tags: ["typescript"],
  },
  "task-4": {
    id: "task-4",
    title: "Create project structure",
    status: "done",
    createdAt: new Date().toISOString(),
    priority: "low",
    assignee: "Jane",
    description: "Base folder structure",
    tags: ["setup"],
  }
};
