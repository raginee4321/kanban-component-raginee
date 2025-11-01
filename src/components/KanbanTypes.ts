// kanbanTypes.ts

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: "low" | "medium" | "high" | "urgent";
  assignee?: string;
  tags?: string[];
  createdAt: string;
  dueDate?: string;
  
  // Tracks the last time task was edited
  updatedAt?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: KanbanTask[];
}
