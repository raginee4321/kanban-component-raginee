import React from "react";
import type { KanbanTask } from "./KanbanTypes";
import { Edit, Trash2 } from "lucide-react";

// Utility to generate initials from assignee name
const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const KanbanCard: React.FC<{
  task: KanbanTask;
  onDelete?: () => void;
  onDragStart?: () => void;
  draggable?: boolean;
  dark?: boolean;
  onEdit?: () => void;
}> = ({ task, onDelete, onDragStart, draggable, dark, onEdit }) => {
  // Format due date nicely (YYYY-MM-DD)
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toISOString().slice(0, 10)
    : null;

  return (
    <div
      className="kanban-card styled-kanban-card"
      draggable={draggable}
      onDragStart={onDragStart}
      // Make card clickable if onEdit provided
      onClick={onEdit}
      style={{ cursor: onEdit ? "pointer" : "default" }}
    >
      {/* Title and priority */}
      <div className="kanban-card-header">
        <div className="kanban-card-title">{task.title}</div>
        {task.priority && (
          <span className={`kanban-priority priority-${task.priority}`}>
            {task.priority}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <div className="kanban-card-description">{task.description}</div>
      )}

      {/* Due date display below description */}
      {formattedDueDate && (
        <div
          style={{
            fontSize: "0.82rem",
            fontWeight: 500,
            color: dark ? "#d0d0ff" : "#374151",
            marginBottom: "0.3rem",
          }}
        >
          📅 Due: {formattedDueDate}
        </div>
      )}

      {/* Tags */}
      <div className="kanban-tag-row">
        {task.tags?.map((tag, idx) => (
          <span key={idx} className="kanban-tag">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer with avatar and edit/delete buttons */}
      <div className="kanban-card-footer">
        {task.assignee && (
          <span className="kanban-card-avatar">
            {getInitials(task.assignee)}
          </span>
        )}
        <div className="kanban-card-actions">
          {onEdit && (
            <button
              className="kanban-card-btn edit-btn"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double modal open
                onEdit();
              }}
            >
              <Edit size={18} />
            </button>
          )}
          {onDelete && (
            <button
              className="kanban-card-btn delete-btn"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering modal
                onDelete();
              }}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
