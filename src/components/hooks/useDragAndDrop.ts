import { useState } from "react";
import type { Column } from "../kanbanSampleData";
import type { KanbanTask } from "../KanbanTypes";

export function useDragAndDrop(columns: Column[], setColumns: (cols: Column[]) => void, tasks: Record<string, KanbanTask>, setTasks: (t: Record<string, KanbanTask>) => void) {
  const [draggingTask, setDraggingTask] = useState<string | null>(null);

  const onDragStart = (taskId: string) => setDraggingTask(taskId);

  const onDrop = (toColId: string) => {
    if (!draggingTask) return;
    let fromColId = "";
    columns.forEach((col) => {
      if (col.taskIds.includes(draggingTask)) fromColId = col.id;
    });
    if (!fromColId || fromColId === toColId) return;

    setColumns(
      columns.map((col) => {
        if (col.id === fromColId)
          return { ...col, taskIds: col.taskIds.filter((id) => id !== draggingTask) };
        if (col.id === toColId)
          return { ...col, taskIds: [...col.taskIds, draggingTask] };
        return col;
      })
    );
    setTasks({
      ...tasks,
      [draggingTask]: { ...tasks[draggingTask], status: toColId },
    });
    setDraggingTask(null);
  };

  return {
    draggingTask,
    onDragStart,
    onDrop,
  };
}
