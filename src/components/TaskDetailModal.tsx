import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { KanbanTask } from "./KanbanTypes";
import type { Column } from "./kanbanSampleData";

interface TaskDetailModalProps {
  task: KanbanTask; // The currently selected task
  columns: Column[]; // For status/column reassignment
  onClose: () => void; // Close modal handler
  onSave: (updatedTask: KanbanTask) => void; // Save task handler
  onDelete: (taskId: string) => void; // Delete task handler
  darkMode?: boolean; // Optional dark mode support
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  columns,
  onClose,
  onSave,
  onDelete,
  darkMode = false,
}) => {
  // ------------------------
  // Local editable state
  // ------------------------
  const [editableTask, setEditableTask] = useState<KanbanTask>({ ...task });

  // Update local state if the parent updates the task reference
  useEffect(() => {
    setEditableTask({ ...task });
  }, [task]);

  // ------------------------
  // Controlled field handlers
  // ------------------------
  const handleChange = (field: keyof KanbanTask, value: any) => {
    setEditableTask((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------------
  // Handle Save
  // Updates timestamp and passes updated task to parent
  // ------------------------
  const handleSave = () => {
    const updatedTask = {
      ...editableTask,
      updatedAt: new Date().toISOString(), // Track last update time
    };
    onSave(updatedTask);
    onClose();
  };

  // ------------------------
  // Handle Delete (with confirmation)
  // ------------------------
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {task && (
        <motion.div
          className="kanban-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="kanban-modal-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click
          >
            {/* Modal Header */}
            <h2 className="kanban-modal-title">Task Details</h2>

            {/* Form Fields */}
            <div className="kanban-modal-fields">
              {/* Title */}
              <div className="kanban-field-label">
                <label>Title</label>
                <input
                  type="text"
                  className="kanban-modal-input"
                  value={editableTask.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="kanban-field-label">
                <label>Description</label>
                <textarea
                  className="kanban-modal-input"
                  rows={3}
                  value={editableTask.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              {/* Assignee */}
              <div className="kanban-field-label">
                <label>Assignee</label>
                <input
                  type="text"
                  className="kanban-modal-input"
                  value={editableTask.assignee || ""}
                  onChange={(e) => handleChange("assignee", e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="kanban-field-label">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  className="kanban-modal-input"
                  value={(editableTask.tags || []).join(", ")}
                  onChange={(e) =>
                    handleChange(
                      "tags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>

              {/* Priority */}
              <div className="kanban-field-label">
                <label>Priority</label>
                <select
                  className="kanban-modal-input"
                  value={editableTask.priority || "low"}
                  onChange={(e) =>
                    handleChange(
                      "priority",
                      e.target.value as "low" | "medium" | "high" | "urgent"
                    )
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Status (Column Reassignment) */}
              <div className="kanban-field-label">
                <label>Status</label>
                <select
                  className="kanban-modal-input"
                  value={editableTask.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="kanban-field-label">
                <label>Due Date</label>
                <input
                  type="date"
                  className="kanban-modal-input"
                  value={
                    editableTask.dueDate
                      ? editableTask.dueDate.slice(0, 10)
                      : ""
                  }
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                />
              </div>
            </div>

            {/* Last Updated Timestamp */}
            {editableTask.updatedAt && (
              <p
                style={{
                  fontSize: "0.9rem",
                  textAlign: "right",
                  color: darkMode ? "#d0d0ff" : "#555",
                  marginTop: "0.5rem",
                }}
              >
                Last Updated:{" "}
                {new Date(editableTask.updatedAt).toLocaleString()}
              </p>
            )}

            {/* Action Buttons */}
            <div className="kanban-modal-actions">
              <button
                className="kanban-modal-btn kanban-modal-btn-cancel"
                onClick={handleDelete}
              >
                <Trash2 size={18} style={{ marginRight: "0.4rem" }} />
                Delete
              </button>
              <button
                className="kanban-modal-btn kanban-modal-btn-confirm"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal;
