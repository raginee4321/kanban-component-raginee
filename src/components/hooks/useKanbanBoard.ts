import { useState, useEffect } from "react";
import type { Column } from "../kanbanSampleData";
import type { KanbanTask } from "../KanbanTypes";

export function useKanbanBoard(initialColumns: Column[], initialTasks: Record<string, KanbanTask>) {
  // Board State
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);
  const [dark, setDark] = useState(false);

  // Modal and input state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskTags, setTaskTags] = useState("");
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnWIP, setNewColumnWIP] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);
    document.body.style.background = dark ? "#181629" : "#f9fafb";
  }, [dark]);

  // Task Modal Handlers
  const openAddTaskModal = (colId: string) => {
    setEditTaskId(null);
    setSelectedColumn(colId);
    setTaskTitle("");
    setTaskDesc("");
    setTaskPriority("medium");
    setTaskAssignee("");
    setTaskTags("");
    setShowTaskModal(true);
  };

  const openEditTaskModal = (taskId: string) => {
    const task = tasks[taskId];
    if (!task) return;
    setEditTaskId(taskId);
    setSelectedColumn(task.status);
    setTaskTitle(task.title);
    setTaskDesc(task.description || "");
    setTaskPriority(task.priority || "medium");
    setTaskAssignee(task.assignee || "");
    setTaskTags((task.tags || []).join(", "));
    setShowTaskModal(true);
  };

  const handleAddOrEditTask = () => {
    const tagsArray = taskTags.split(",").map((t) => t.trim()).filter(Boolean);
    if (!taskTitle.trim() || !selectedColumn) return;

    if (editTaskId) {
      setTasks((prev) => ({
        ...prev,
        [editTaskId]: {
          ...prev[editTaskId],
          title: taskTitle.trim(),
          description: taskDesc,
          priority: taskPriority,
          assignee: taskAssignee,
          tags: tagsArray,
        },
      }));
    } else {
      const newId = `task-${Date.now()}`;
      const newTask: KanbanTask = {
        id: newId,
        title: taskTitle.trim(),
        description: taskDesc,
        status: selectedColumn,
        createdAt: new Date().toISOString(),
        priority: taskPriority,
        assignee: taskAssignee,
        tags: tagsArray,
      };
      setTasks((prev) => ({ ...prev, [newId]: newTask }));
      setColumns((prev) =>
        prev.map((col) =>
          col.id === selectedColumn
            ? { ...col, taskIds: [...col.taskIds, newId] }
            : col
        )
      );
    }
    setShowTaskModal(false);
  };

  // Column Modal Handlers
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
    showTaskModal,
    setShowTaskModal,
    selectedColumn,
    setSelectedColumn,
    editTaskId,
    setEditTaskId,
    taskTitle,
    setTaskTitle,
    taskDesc,
    setTaskDesc,
    taskPriority,
    setTaskPriority,
    taskAssignee,
    setTaskAssignee,
    taskTags,
    setTaskTags,
    showColumnModal,
    setShowColumnModal,
    newColumnTitle,
    setNewColumnTitle,
    newColumnWIP,
    setNewColumnWIP,
    openAddTaskModal,
    openEditTaskModal,
    handleAddOrEditTask,
    handleCreateColumn,
  };
}
