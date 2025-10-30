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

  // Add this line
  updatedAt?: string; // Tracks the last time task was edited
}
