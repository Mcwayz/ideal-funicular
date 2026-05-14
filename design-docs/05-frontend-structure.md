# Frontend Component Structure & Architecture

The frontend is built with React and Next.js (App Router), utilizing Tailwind CSS for styling and ShadCN UI for accessible, customizable components.

## Application State Management
* **Global State:** Zustand (for UI state, sidebar toggles, theme).
* **Server State:** React Query (TanStack Query) + GraphQL Apollo Client (for dashboard aggregations).
* **Form State:** React Hook Form + Zod (for validation).

## Directory Structure

```text
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth routes (login, register, forgot-password)
│   ├── (dashboard)/          # Authenticated routes
│   │   ├── layout.tsx        # Main dashboard layout (Sidebar, Header)
│   │   ├── page.tsx          # Main Executive Dashboard
│   │   ├── projects/         # Project Listing & Creation
│   │   │   ├── [id]/         # Project Details Layout
│   │   │   │   ├── board/    # Kanban Board
│   │   │   │   ├── gantt/    # Timeline / Gantt
│   │   │   │   ├── budget/   # Financials
│   │   │   │   ├── team/     # Resource allocation
│   │   │   │   └── docs/     # Document Manager
│   │   ├── reports/          # BI & Analytics
│   │   └── settings/         # Organization & User Settings
│   └── api/                  # Next.js API Routes (BFF - Backend for Frontend)
├── components/
│   ├── ui/                   # ShadCN base components (Button, Input, Dialog, etc.)
│   ├── layout/               # Sidebar, Topbar, PageHeader
│   ├── dashboard/            # KPI Widgets, Charts (Recharts)
│   ├── projects/             # ProjectCard, ProjectForm
│   ├── tasks/                # TaskCard, TaskModal, KanbanColumn
│   └── shared/               # AvatarGroup, StatusBadge, FileUploader
├── lib/                      # Utilities
│   ├── api/                  # Axios instances and API wrappers
│   ├── utils.ts              # Tailwind merge (cn), formatting utils
│   └── hooks/                # Custom React hooks (useAuth, usePermissions)
├── types/                    # TypeScript interfaces and types
│   ├── project.ts
│   ├── task.ts
│   └── user.ts
└── store/                    # Zustand stores
    └── useAppStore.ts
```

## Key High-Level Components

### 1. `DashboardLayout`
Wraps all authenticated routes. Includes the vertical `Sidebar` (navigation) and horizontal `Topbar` (Global Search, Notifications, User Menu).

### 2. `KanbanBoard`
A drag-and-drop interface utilizing `@hello-pangea/dnd`.
* `KanbanColumn`: Represents a status (TODO, IN_PROGRESS).
* `TaskCard`: Displays task title, assignee avatar, priority icon, and tags.

### 3. `GanttChart`
A visual timeline component. Can use a library like `dhtmlx-gantt` or a custom implementation using standard CSS grids and SVG lines for dependencies.

### 4. `KpiWidget`
A reusable card component for dashboards.
* Props: `title`, `value`, `trend` (up/down percentage), `icon`, `chartData` (optional sparkline).

### 5. `TaskModal`
A sliding side-panel or large dialog for creating/editing a task. Includes tabs for "Details", "Comments", "Time Logs", and "Attachments".

## Theming & UI/UX
* **Colors:** Enterprise dark mode support. Slate/Zinc base colors with an accent color (e.g., Indigo or Violet) for primary actions.
* **Typography:** Inter or Roboto font family.
* **Animations:** Framer Motion for smooth page transitions, modal openings, and list reordering.
