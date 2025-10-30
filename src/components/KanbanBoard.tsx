import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Plus } from "lucide-react";
import KanbanColumn from "./KanbanColumn";
import TaskDetailModal from "./TaskDetailModal";
import type { Column } from "./kanbanSampleData";
import type { KanbanTask } from "./KanbanTypes";
import { useKanbanBoard } from "./hooks/useKanbanBoard";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

interface KanbanBoardProps {
  initialColumns?: Column[];
  initialTasks?: Record<string, KanbanTask>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialColumns = [],
  initialTasks = {},
}) => {
  // -----------------------------
  // State setup
  // -----------------------------
  const safeColumns = Array.isArray(initialColumns) ? initialColumns : [];
  const safeTasks =
    initialTasks && typeof initialTasks === "object" ? initialTasks : {};

  const kanban = useKanbanBoard(safeColumns, safeTasks);
  const { draggingTask, onDragStart, onDrop } = useDragAndDrop(
    kanban.columns,
    kanban.setColumns,
    kanban.tasks,
    kanban.setTasks
  );

  // -----------------------------
  // Toast (simple fade)
  // -----------------------------
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // -----------------------------
  // Task detail modal state
  // -----------------------------
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const openTaskDetailModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowDetailModal(true);
  };
  const closeTaskDetailModal = () => {
    setSelectedTaskId(null);
    setShowDetailModal(false);
  };

  const handleSaveTask = (updatedTask: KanbanTask) => {
    kanban.setTasks((prev) => ({ ...prev, [updatedTask.id]: updatedTask }));

    // Move task between columns if status changed
    if (updatedTask.status !== task?.status) {
      kanban.setColumns((prev) =>
        prev.map((col) => {
          if (col.taskIds.includes(updatedTask.id)) {
            return {
              ...col,
              taskIds: col.taskIds.filter((id) => id !== updatedTask.id),
            };
          }
          if (col.id === updatedTask.status) {
            return { ...col, taskIds: [...col.taskIds, updatedTask.id] };
          }
          return col;
        })
      );
    }

    showToast("Task updated successfully");
  };

  const handleDeleteTask = (taskId: string) => {
    kanban.setTasks((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
    kanban.setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        taskIds: col.taskIds.filter((id) => id !== taskId),
      }))
    );
    showToast("Task deleted successfully");
  };

  const task = selectedTaskId ? kanban.tasks[selectedTaskId] : null;

  // -----------------------------
  // Add Column modal state
  // -----------------------------
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnWIP, setNewColumnWIP] = useState("");

  const handleCreateColumn = () => {
    if (!newColumnTitle.trim()) return;
    const maxTasks = newColumnWIP.trim() === "" ? undefined : Number(newColumnWIP);
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
      maxTasks,
      taskIds: [],
    };
    kanban.setColumns((prev) => [...prev, newColumn]);
    setNewColumnTitle("");
    setNewColumnWIP("");
    setShowColumnModal(false);
    showToast("Column added successfully");
  };

  // -----------------------------
  // Add Task modal state
  // -----------------------------
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTaskColumnId, setCurrentTaskColumnId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskTags, setTaskTags] = useState("");
  const [taskPriority, setTaskPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("low");
  const [taskDueDate, setTaskDueDate] = useState("");

  const openAddTaskModal = (colId: string) => {
    setCurrentTaskColumnId(colId);
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    if (!taskTitle.trim() || !currentTaskColumnId) return;
    const newTaskId = `task-${Date.now()}`;
    const newTask: KanbanTask = {
      id: newTaskId,
      title: taskTitle,
      description: taskDesc,
      assignee: taskAssignee,
      tags: taskTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      priority: taskPriority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: currentTaskColumnId,
      dueDate: taskDueDate ? taskDueDate : undefined,
    };
    kanban.setTasks((prev) => ({ ...prev, [newTaskId]: newTask }));
    kanban.setColumns((prev) =>
      prev.map((col) =>
        col.id === currentTaskColumnId
          ? { ...col, taskIds: [...col.taskIds, newTaskId] }
          : col
      )
    );
    setTaskTitle("");
    setTaskDesc("");
    setTaskAssignee("");
    setTaskTags("");
    setTaskPriority("low");
    setTaskDueDate("");
    setCurrentTaskColumnId(null);
    setShowTaskModal(false);
    showToast("Task added successfully");
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (!kanban || !kanban.columns || !Array.isArray(kanban.columns)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
        Loading Kanban Board...
      </div>
    );
  }

  return (
    <div className="kanban-container">
      {/* Header */}
      <div className="kanban-header-row" style={{ position: "relative" }}>
        <h1 className="kanban-title">Kanban Board</h1>
        <div className="header-actions-topright">
          <button onClick={() => setShowColumnModal(true)} className="kanban-btn">
            <Plus size={18} /> Add Column
          </button>
          <button
            onClick={() => kanban.setDark((d) => !d)}
            aria-label="Toggle Dark Mode"
            className="kanban-mode-btn"
          >
            {kanban.dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="kanban-main-layout">
        <div className="kanban-columns-grid">
          {kanban.columns.map((col) => {
            const wipCount = col.taskIds.length;
            const wipLimit = col.maxTasks ?? "<no specified>";
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={kanban.tasks}
                onAddTask={
                  col.title.toLowerCase() === "to do"
                    ? () => openAddTaskModal(col.id)
                    : undefined
                }
                onDeleteTask={(taskId) => handleDeleteTask(taskId)}
                onSetWip={(colId, max) =>
                  kanban.setColumns((prev) =>
                    prev.map((c) =>
                      c.id === colId ? { ...c, maxTasks: max } : c
                    )
                  )
                }
                onDrop={onDrop}
                onDragStart={onDragStart}
                draggingTask={draggingTask}
                dark={kanban.dark}
                wipCount={wipCount}
                wipLimit={wipLimit}
                onEditTask={openTaskDetailModal}
                // Working Edit Column
                onEditColumn={(colId, currentTitle) => {
                  const newTitle = prompt("Enter new column title:", currentTitle);
                  if (newTitle && newTitle.trim()) {
                    kanban.setColumns((prev) =>
                      prev.map((c) =>
                        c.id === colId ? { ...c, title: newTitle.trim() } : c
                      )
                    );
                    showToast("Column renamed successfully");
                  }
                }}
                //  Working Delete Column
                onDeleteColumn={(colId) => {
                  if (window.confirm("Are you sure you want to delete this column?")) {
                    kanban.setColumns((prev) => prev.filter((c) => c.id !== colId));
                    kanban.setTasks((prev) => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach((taskId) => {
                        if (col.taskIds.includes(taskId)) delete updated[taskId];
                      });
                      return updated;
                    });
                    showToast("Column deleted successfully");
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {/* Add Column Modal */}
<AnimatePresence>
  {showColumnModal && (
    <motion.div
      className="kanban-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowColumnModal(false)}
    >
      <motion.div
        className="kanban-modal-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="kanban-modal-title">Add New Column</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateColumn();
          }}
        >
          <input
            type="text"
            placeholder="Column Title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="kanban-modal-input"
            required
          />
          <input
            type="number"
            placeholder="WIP Limit (optional)"
            value={newColumnWIP}
            onChange={(e) => setNewColumnWIP(e.target.value)}
            className="kanban-modal-input"
          />
          <div className="kanban-modal-actions">
            <button
              type="button"
              onClick={() => setShowColumnModal(false)}
              className="kanban-modal-btn kanban-modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="kanban-modal-btn kanban-modal-btn-confirm"
            >
              Add Column
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Task Detail Modal */}
      {showDetailModal && task && (
        <TaskDetailModal
          task={task}
          columns={kanban.columns}
          onClose={closeTaskDetailModal}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          darkMode={kanban.dark}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#2563eb",
              color: "#fff",
              padding: "0.8rem 1.5rem",
              borderRadius: "0.6rem",
              fontWeight: 600,
              zIndex: 2000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KanbanBoard;
