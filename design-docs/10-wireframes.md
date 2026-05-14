# Wireframes & UI/UX Expectations

The platform's design aesthetic should be modern, clean, and enterprise-ready, combining the best aspects of tools like Jira, Monday.com, and Asana.

## Global Layout (App Shell)

```text
+-----------------------------------------------------------------------------+
| [Logo] Acme Corp         [Search Projects/Tasks...]     [Notifications] [User]|
+-------------+---------------------------------------------------------------+
| Dashboard   |                                                               |
| Projects    |  +---------------------------------------------------------+  |
| My Tasks    |  |  Project Alpha > Board                                  |  |
| Team        |  +---------------------------------------------------------+  |
| Reports     |  |                                                         |  |
| Documents   |  |  [TODO]           [IN PROGRESS]       [REVIEW]          |  |
| Settings    |  |  +-------------+  +-------------+     +-------------+   |  |
|             |  |  | Task 1      |  | Task 3      |     | Task 5      |   |  |
|             |  |  | [High]      |  | [Medium]    |     | [Low]       |   |  |
|             |  |  | (Avatar)    |  | (Avatar)    |     | (Avatar)    |   |  |
|             |  |  +-------------+  +-------------+     +-------------+   |  |
|             |  |  | Task 2      |  | Task 4      |                       |  |
|             |  |  | [Medium]    |  | [High]      |                       |  |
|             |  |  | (Avatar)    |  | (Avatar)    |                       |  |
|             |  |  +-------------+  +-------------+                       |  |
+-------------+---------------------------------------------------------------+
```

## Key Views

### 1. Executive Dashboard
* **Header:** Welcome back, User. Here is your portfolio overview.
* **Top Row (Cards):** Total Active Projects (Number + Sparkline), Overall Budget Variance ($), Tasks Delayed (Red Text).
* **Middle Left (Chart):** Bar chart showing Resource Capacity vs. Demand for the next 3 months.
* **Middle Right (List):** "AI Risk Alerts" (e.g., "Project Delta is 15% behind schedule").

### 2. Project View (Tabs)
When a user clicks on a specific project, they see a sub-navigation bar:
`[Overview]  [List]  [Board]  [Timeline/Gantt]  [Budget]  [Files]  [Settings]`

#### 2.1 The Timeline / Gantt View
* **Left Column:** WBS (Work Breakdown Structure). Collapsible tree grid showing Phase > Milestone > Task.
* **Right Column:** Visual Gantt chart bars connected by arrows representing dependencies (Finish-to-Start).
* **Interaction:** Dragging the edge of a bar extends the duration and auto-pushes dependent tasks forward.

#### 2.2 Task Detail Modal (Side Sheet)
* Slides in from the right when a task is clicked.
* **Header:** Breadcrumb (Project > Milestone > Task), Status Dropdown, Priority Dropdown.
* **Body:** Title (Editable H1), Rich Text Description.
* **Sidebar (Right of modal):** Assignee, Due Date, Estimated Hours, Actual Hours logged.
* **Bottom Tabs:** Comments (Chat style UI with @mentions), Activity Log (Audit trail of field changes), Attachments (Drag & Drop zone).

## UI/UX Rules
1. **Glassmorphism & Depth:** Use subtle drop shadows for cards and modals to create visual hierarchy. The background should be a very light gray (`#f9fafb`), with cards being pure white (`#ffffff`).
2. **Typography:** Sans-serif (Inter) with clear weights. `h1` for page titles, `text-sm` for table data.
3. **Empty States:** Never show a blank screen. If there are no projects, show a beautifully illustrated empty state with a clear "Create your first project" CTA.
4. **Micro-animations:** Buttons should have a slight scale down on click. Toast notifications should slide in from the bottom right.
5. **Accessibility:** Minimum contrast ratios for all text. Focus rings on all inputs.
