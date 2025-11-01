import { useState, useEffect } from "react";
import type { Column } from "../kanbanSampleData";
import type { KanbanTask } from "../KanbanTypes";

export function useKanbanBoard(initialColumns: Column[], initialTasks: Record<string, KanbanTask>) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);
    document.body.style.background = dark ? "#181629" : "#f9fafb";
  }, [dark]);

  // Modal and input state
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnWIP, setNewColumnWIP] = useState("");

  const handleCreateColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newColumnTitle.trim(),
        taskIds: [],
        maxTasks: newColumnWIP.trim() ? parseInt(newColumnWIP) : undefined,
      },
    ]);
    setShowColumnModal(false);
    setNewColumnTitle("");
    setNewColumnWIP("");
  };

  return {
    columns,
    setColumns,
    tasks,
    setTasks,
    dark,
    setDark,
    showColumnModal,
    setShowColumnModal,
    newColumnTitle,
    setNewColumnTitle,
    newColumnWIP,
    setNewColumnWIP,
    handleCreateColumn,
  };
}

export default useKanbanBoard;
