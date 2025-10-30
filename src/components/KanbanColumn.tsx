import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import type { Column } from "./kanbanSampleData";
import type { KanbanTask } from "./KanbanTypes";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  column: Column;
  tasks: Record<string, KanbanTask>;
  onAddTask?: () => void;
  onDeleteTask: (taskId: string) => void;
  onSetWip: (colId: string, max?: number) => void;
  onDrop: (toColId: string) => void;
  onDragStart: (taskId: string) => void;
  draggingTask: string | null;
  dark: boolean;
  wipCount: number;
  wipLimit: number | string;
  onEditTask: (taskId: string) => void;
  onDeleteColumn: (colId: string) => void;  // New delete column prop
  onEditColumn: (colId: string, currentTitle: string) => void; // New edit column prop
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onSetWip,
  onDrop,
  onDragStart,
  draggingTask,
  dark,
  wipCount,
  wipLimit,
  onEditTask,
  onDeleteColumn,
  onEditColumn,
}) => {
  const handleWipClick = () => {
    const input = prompt(
      "Set WIP limit (leave empty to unset)",
      column.maxTasks?.toString() ?? ""
    );
    if (input !== null) {
      const num = input.trim() === "" ? undefined : parseInt(input);
      if (num !== undefined && (isNaN(num) || num < 0)) {
        alert("Please enter a valid positive number or leave empty");
        return;
      }
      onSetWip(column.id, num);
    }
  };

  return (
    <motion.div
      layout
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(column.id);
      }}
      className={`kanban-column ${dark ? "dark" : ""}`}
      style={{ borderTop: `5px solid ${column.color || "#6366f1"}` }}
    >
      <div className="kanban-column-header">
        <span>{column.title}</span>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <Edit
            size={18}
            className="text-indigo-500 cursor-pointer"
            onClick={() => onEditColumn(column.id, column.title)}
          />
          <Trash2
            size={18}
            className="text-red-600 cursor-pointer"
           
            onClick={() => onDeleteColumn(column.id)}
          />
        </div>
      </div>
      <div
        className="kanban-wip"
        title="Click to edit WIP limit"
        onClick={handleWipClick}
      >
        WIP {wipCount}/{wipLimit}
      </div>
      <div className="kanban-tasks-list">
        {column.taskIds.map((taskId) => {
          const task = tasks[taskId];
          if (!task) return null;
          return (
            <KanbanCard
              key={task.id}
              task={task}
              onDelete={() => onDeleteTask(task.id)}
              onDragStart={() => onDragStart(task.id)}
              dark={dark}
              draggable
              onEdit={() => onEditTask(task.id)}
            />
          );
        })}
      </div>
      {column.title.toLowerCase() === "to do" && onAddTask && (
        <button onClick={onAddTask} className="kanban-add-task">
          + Add Task
        </button>
      )}
    </motion.div>
  );
};

export default KanbanColumn;
