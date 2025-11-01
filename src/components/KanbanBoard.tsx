import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Plus } from "lucide-react";
import KanbanColumn from "./KanbanColumn";
import TaskDetailModal from "./TaskDetailModal";
import type { Column } from "./kanbanSampleData";
import type { KanbanTask } from "./KanbanTypes";
import { useKanbanBoard } from "./hooks/useKanbanBoard";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

import { defaultColumns as importedColumns, defaultTasks } from "./kanbanSampleData";

// Extend your defaultColumns with a 4th column "Review"
const enhancedColumns: Column[] = [
  ...importedColumns,
  {
    id: "review",
    title: "Review",
    taskIds: [],
    maxTasks: 5,
    color: "#f59e0b",
  },
];

const KanbanBoard: React.FC = () => {
  // use enhanced columns with the added Review column, and existing tasks
  const kanban = useKanbanBoard(enhancedColumns, defaultTasks);

  const { draggingTask, onDragStart, onDrop } = useDragAndDrop(
    kanban.columns,
    kanban.setColumns,
    kanban.tasks,
    kanban.setTasks
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentTaskColumnId, setCurrentTaskColumnId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<"add" | "edit">("edit");

  useEffect(() => {
    console.log("Kanban Columns:", kanban.columns);
    console.log("Kanban Tasks:", kanban.tasks);
  }, [kanban.columns, kanban.tasks]);

  const openTaskDetailModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setTaskModalMode("edit");
    setShowDetailModal(true);
  };

  const openAddTaskModal = (colId: string) => {
    setCurrentTaskColumnId(colId);
    const newTaskId = `task-${Date.now()}`;
    setSelectedTaskId(newTaskId);
    setTaskModalMode("add");
    setShowDetailModal(true);
  };

  const blankTask: KanbanTask = {
    id: selectedTaskId || "",
    title: "",
    description: "",
    assignee: "",
    tags: [],
    priority: "low",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: currentTaskColumnId || "",
    dueDate: "",
  };

  const task =
    taskModalMode === "edit" && selectedTaskId && kanban.tasks[selectedTaskId]
      ? kanban.tasks[selectedTaskId]
      : blankTask;

  const handleSaveTask = (updatedTask: KanbanTask) => {
    if (taskModalMode === "add") {
      kanban.setTasks((prev) => ({
        ...prev,
        [updatedTask.id]: updatedTask,
      }));
      kanban.setColumns((prev) =>
        prev.map((col) =>
          col.id === updatedTask.status
            ? { ...col, taskIds: [...col.taskIds, updatedTask.id] }
            : col
        )
      );
      showToast("Task added successfully");
    } else {
      const oldStatus = kanban.tasks[updatedTask.id]?.status;
      kanban.setTasks((prev) => ({ ...prev, [updatedTask.id]: updatedTask }));
      if (updatedTask.status !== oldStatus) {
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
    }
    setShowDetailModal(false);
    setSelectedTaskId(null);
    setCurrentTaskColumnId(null);
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
    setShowDetailModal(false);
    setSelectedTaskId(null);
    setCurrentTaskColumnId(null);
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header-row">
        <h1 className="kanban-title">Kanban Board</h1>
        <div className="header-actions-topright">
          <button onClick={() => kanban.setShowColumnModal(true)} className="kanban-btn">
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
                onDeleteTask={handleDeleteTask}
                onSetWip={(colId, max) =>
                  kanban.setColumns((prev) =>
                    prev.map((c) => (c.id === colId ? { ...c, maxTasks: max } : c))
                  )
                }
                onDrop={onDrop}
                onDragStart={onDragStart}
                draggingTask={draggingTask}
                dark={kanban.dark}
                wipCount={wipCount}
                wipLimit={wipLimit}
                onEditTask={openTaskDetailModal}
                onEditColumn={(colId, currentTitle) => {
                  const newTitle = prompt("Enter new column title:", currentTitle);
                  if (newTitle && newTitle.trim()) {
                    kanban.setColumns((prev) =>
                      prev.map((c) => (c.id === colId ? { ...c, title: newTitle.trim() } : c))
                    );
                    showToast("Column renamed successfully");
                  }
                }}
                onDeleteColumn={(colId) => {
                  if (window.confirm("Are you sure you want to delete this column?")) {
                    kanban.setColumns((prev) => prev.filter((c) => c.id !== colId));
                    kanban.setTasks((prev) => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach((taskId) => {
                        if (kanban.columns.find((col) => col.id === colId)?.taskIds.includes(taskId))
                          delete updated[taskId];
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
      <AnimatePresence>
        {kanban.showColumnModal && (
          <motion.div
            className="kanban-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => kanban.setShowColumnModal(false)}
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
                  kanban.handleCreateColumn();
                }}
              >
                <input
                  type="text"
                  placeholder="Column Title"
                  value={kanban.newColumnTitle}
                  onChange={(e) => kanban.setNewColumnTitle(e.target.value)}
                  className="kanban-modal-input"
                  required
                />
                <input
                  type="number"
                  placeholder="WIP Limit (optional)"
                  value={kanban.newColumnWIP}
                  onChange={(e) => kanban.setNewColumnWIP(e.target.value)}
                  className="kanban-modal-input"
                />
                <div className="kanban-modal-actions">
                  <button
                    type="button"
                    onClick={() => kanban.setShowColumnModal(false)}
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
      {showDetailModal && task && (
        <TaskDetailModal
          task={task}
          columns={kanban.columns}
          onClose={() => setShowDetailModal(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          darkMode={kanban.dark}
        />
      )}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="kanban-toast"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KanbanBoard;
