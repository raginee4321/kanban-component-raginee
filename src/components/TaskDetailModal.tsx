import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { KanbanTask } from "./KanbanTypes";
import type { Column } from "./kanbanSampleData";

interface TaskDetailModalProps {
  task: KanbanTask;
  columns: Column[];
  onClose: () => void;
  onSave: (updatedTask: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  darkMode?: boolean;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  columns,
  onClose,
  onSave,
  onDelete,
  darkMode = false,
}) => {
  // Editable state and tagInput
  const [editableTask, setEditableTask] = useState<KanbanTask>({ ...task });
  const [tagInput, setTagInput] = useState((task.tags || []).join(", "));

  useEffect(() => {
    setEditableTask({ ...task });
    setTagInput((task.tags || []).join(", "));
  }, [task]);

  // General field change
  const handleChange = (field: keyof KanbanTask, value: any) => {
    setEditableTask((prev) => ({ ...prev, [field]: value }));
  };

  // Save handler including tags parsing
  const handleSave = () => {
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedTask = {
      ...editableTask,
      tags,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedTask);
    onClose();
  };

  // Delete handler
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
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="kanban-modal-title">Task Details</h2>
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
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onBlur={() =>
                    setEditableTask((prev) => ({
                      ...prev,
                      tags: tagInput
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    }))
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
              {/* Status */}
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
                    editableTask.dueDate ? editableTask.dueDate.slice(0, 10) : ""
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
