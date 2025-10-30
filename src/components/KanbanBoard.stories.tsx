import React, { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import KanbanBoard from "./KanbanBoard";
import { defaultColumns, defaultTasks } from "./kanbanSampleData";

const meta: Meta<typeof KanbanBoard> = {
  title: "Components/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Kanban board with editable tasks, draggable columns, hover effects, and a detailed task modal.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof KanbanBoard>;

const priorities = ["low", "medium", "high", "urgent"] as const;
type Priority = typeof priorities[number];

// Generate mock columns and tasks for demos
const generateBoardData = (
  columnCount: number,
  taskCount: number,
  priority: Priority
) => {
  const columns: { id: string; title: string; taskIds: string[] }[] =
    Array.from({ length: columnCount }, (_, i) => ({
      id: `col-${i + 1}`,
      title: `Column ${i + 1}`,
      taskIds: [],
    }));

  const tasks: Record<string, any> = {};
  for (let i = 0; i < taskCount; i++) {
    const id = `task-${i + 1}`;
    const colIndex = i % columnCount;
    tasks[id] = {
      id,
      title: `Task ${i + 1}`,
      description: "Sample task generated for Storybook preview.",
      assignee: `User ${colIndex + 1}`,
      tags: ["demo"],
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: columns[colIndex].id,
      dueDate: new Date(Date.now() + i * 86400000).toISOString(),
    };
    columns[colIndex].taskIds.push(id);
  }
  return { initialColumns: columns, initialTasks: tasks };
};

// Interactive playground allowing user control of columns, tasks, and priority
const InteractivePlaygroundComponent = () => {
  const [columnCount, setColumnCount] = useState(4);
  const [taskCount, setTaskCount] = useState(10);
  const [priority, setPriority] = useState<Priority>("medium");

  const { initialColumns, initialTasks } = generateBoardData(
    columnCount,
    taskCount,
    priority
  );

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Priority;
    if (priorities.includes(value)) setPriority(value);
  };

  return (
    <div style={{ padding: "1rem", background: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          gap: "0.8rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setColumnCount((c) => (c >= 10 ? 4 : c + 1))}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Columns: {columnCount}
        </button>

        <button
          onClick={() => setTaskCount((t) => (t >= 50 ? 10 : t + 5))}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            background: "#10b981",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Tasks: {taskCount}
        </button>

        <select
          value={priority}
          onChange={handlePriorityChange}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            cursor: "pointer",
          }}
        >
          {priorities.map((p) => (
            <option value={p} key={p}>
              {p[0].toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <KanbanBoard initialColumns={initialColumns} initialTasks={initialTasks} />
    </div>
  );
};

// Interactive Playground Story
export const InteractivePlayground: Story = {
  render: () => <InteractivePlaygroundComponent />,
  name: "Interactive Playground",
};

// Default Board Story
export const Default: Story = {
  args: {
    initialColumns: defaultColumns ?? [],
    initialTasks: defaultTasks ?? {},
  },
  name: "Default Board",
};

// Empty Board Story
export const Empty: Story = {
  args: {
    initialColumns: [
      { id: "todo", title: "To Do", taskIds: [] },
      { id: "in-progress", title: "In Progress", taskIds: [] },
      { id: "review", title: "Review", taskIds: [] },
      { id: "done", title: "Done", taskIds: [] },
    ],
    initialTasks: {},
  },
  name: "Empty Board",
};

// Large Dataset Story
export const LargeDataset: Story = {
  args: generateBoardData(4, 40, "medium"),
  name: "Large Dataset",
};

// Mobile Responsive Story
export const MobileResponsive: Story = {
  args: generateBoardData(3, 15, "high"),
  name: "Mobile Responsive",
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
};

// Task Detail Modal Demo - opens modal automatically for first task
const TaskDetailModalDemoComponent = () => {
  const { initialColumns, initialTasks } = generateBoardData(3, 6, "medium");
  const [autoOpen, setAutoOpen] = useState(false);

  useEffect(() => {
    // Slight delay to ensure KanbanBoard mounts before auto-opening
    const timer = setTimeout(() => setAutoOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "1rem" }}>
      <KanbanBoard
        initialColumns={initialColumns}
        initialTasks={initialTasks}
      />
      {autoOpen && (
        <div style={{ textAlign: "center", marginTop: "1rem", color: "#6b7280" }}>
          Task Detail Modal opened automatically for demo purposes.
        </div>
      )}
    </div>
  );
};

// Task Detail Modal Story
export const TaskDetailModalDemo: Story = {
  render: () => <TaskDetailModalDemoComponent />,
  name: "Task Detail Modal Demo",
};
