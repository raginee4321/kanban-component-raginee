import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import { defaultColumns, defaultTasks } from "./components/kanbanSampleData";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <KanbanBoard initialColumns={defaultColumns} initialTasks={defaultTasks} />
    </div>
  );
}
