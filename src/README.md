# Kanban Board Component – Storybook Documentation

## Project Overview
The **Kanban Board Component** is an interactive task management interface built using **React**, **TypeScript**, and **Vite**.  
It allows users to visualize workflows across multiple stages such as “To Do,” “In Progress,” and “Done.”  

The component supports key features like:
- Adding, editing, and deleting tasks and columns  
- Drag-and-drop functionality  
- Work-in-progress limits  
- Dark and light mode toggle  
- Smooth transitions using **Framer Motion**

To demonstrate the reusability and functionality of the component, **Storybook** is used for documentation and interactive testing.

---

## Objective
The goal of integrating Storybook is to:
- Document the Kanban Board as a reusable and modular UI component.  
- Visually test different states (default, empty, large dataset).  
- Provide an isolated environment for interaction without running the full application.

---

## Technologies Used
- **React + TypeScript + Vite** – Component-based UI development  
- **Tailwind CSS** – Styling framework  
- **Framer Motion** – Animations and transitions  
- **Lucide React** – Icon library  
- **Storybook (v10)** – UI documentation and testing  

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kanban-component-ragini-final
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the main project:
   ```bash
   npm run dev
   ```

4. Run Storybook:
   ```bash
   npm run storybook
   ```

Storybook will launch locally at:
```
http://localhost:6006/
```

---

## Storybook Configuration

### .storybook/main.ts
```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
```

### .storybook/preview.ts
```ts
import "../src/styles/globals.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

---

## Stories Implemented

The file `KanbanBoard.stories.tsx` demonstrates three use-case scenarios for the Kanban component.

### 1. Default
Displays the Kanban Board with sample columns and tasks.

```tsx
export const Default = {
  args: {
    initialColumns: defaultColumns,
    initialTasks: defaultTasks,
  },
};
```

### 2. Empty
Displays a board with no tasks to show the initial structure.

```tsx
export const Empty = {
  args: {
    initialColumns: [
      { id: "todo", title: "To Do", taskIds: [] },
      { id: "in-progress", title: "In Progress", taskIds: [] },
      { id: "done", title: "Done", taskIds: [] },
    ],
    initialTasks: {},
  },
};
```

### 3. LargeBoard
Demonstrates scalability and responsiveness with multiple columns and tasks.

```tsx
export const LargeBoard = {
  args: {
    initialColumns: Array.from({ length: 5 }).map((_, i) => ({
      id: `col-${i + 1}`,
      title: `Column ${i + 1}`,
      taskIds: Array.from({ length: 5 }).map((__, j) => `task-${i}-${j}`),
    })),
    initialTasks: Object.fromEntries(
      Array.from({ length: 25 }).map((_, i) => [
        `task-${i}`,
        {
          id: `task-${i}`,
          title: `Task ${i + 1}`,
          description: "Example description",
          assignee: "User",
          tags: ["demo"],
          priority: "medium",
          createdAt: new Date().toISOString(),
          status: `col-${Math.floor(i / 5) + 1}`,
        },
      ])
    ),
  },
};
```

---

## Testing in Storybook

Once Storybook starts, you will see:
- **Default View:** Fully functional Kanban board with sample data.  
- **Empty View:** Columns without any tasks.  
- **LargeBoard:** Demonstration of performance with more data.

All interactive features (drag-and-drop, adding columns, dark mode, etc.) are available directly inside Storybook.

---

## Advantages of Storybook Integration
- Enables isolated testing of components.  
- Simplifies UI debugging and iteration.  
- Provides clear visual documentation of all component states.  
- Promotes component reusability across different projects.  
- Improves development workflow and consistency.

---

## Conclusion
The **Kanban Board Component** fulfills all requirements mentioned in the assignment:  
- Complete CRUD and drag-and-drop functionality  
- Modular React component design  
- Fully documented and testable via Storybook  

This approach ensures better maintainability, scalability, and professional presentation of component-based development.
