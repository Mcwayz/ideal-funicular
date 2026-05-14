# Key User Journeys

This document outlines the primary flows for different personas using the Project Management Platform.

## 1. Project Manager: Planning a New Project

**Goal:** Create a project, define milestones, and allocate resources.

1. **Dashboard:** PM clicks "New Project".
2. **Project Form:** Enters Name, Type (e.g., Software Development), Start/End Dates, Budget, and selects the Organization.
3. **WBS / Gantt View:** PM navigates to the Gantt view and starts creating Milestones.
4. **Task Breakdown:** Under each Milestone, PM adds Tasks, estimates hours, and defines dependencies (e.g., Task B cannot start until Task A finishes).
5. **Resource Allocation:** PM switches to the "Team" tab, views availability heatmaps, and assigns team members to the newly created tasks.
6. **Publish:** PM changes the project status from `PLANNING` to `ACTIVE`.

## 2. Software Developer: Daily Execution

**Goal:** Check assigned tasks, log time, and update status.

1. **My Tasks Dashboard:** Developer logs in and immediately sees a personalized Kanban board or list of tasks assigned to them across all projects.
2. **Task Details:** Clicks on a high-priority task. Reads the description, acceptance criteria, and attached Figma links.
3. **Status Update:** Drags the task from `TODO` to `IN_PROGRESS`.
4. **Collaboration:** Mentions the QA Engineer in the comments: `@qa_engineer Please review the test cases.`
5. **Time Logging:** At the end of the day, clicks "Log Time" on the task, enters "4 hours," and adds a brief note.
6. **Completion:** Developer moves the task to `PENDING_REVIEW` or `DONE`.

## 3. Executive / Stakeholder: Portfolio Review

**Goal:** Quickly assess the health of multiple projects.

1. **Executive Dashboard:** Logs in and sees high-level KPIs: Total Budget Variance, Overall Resource Utilization, Active Projects Health Score.
2. **AI Insights Widget:** Reads a summarized alert: "Project X is predicted to be delayed by 2 weeks due to resource bottlenecks in Phase 2."
3. **Project Drill-down:** Clicks on Project X.
4. **Reports Tab:** Views the Burndown Chart, Earned Value (EVM) metrics, and recent risk logs.
5. **Export:** Clicks "Export to PDF" to share the weekly status report with the board of directors.

## 4. Site Engineer (Construction): Field Updates

**Goal:** Upload daily site photos and update progress on a mobile device.

1. **Mobile App / Responsive Web:** Engineer opens the app on a tablet at the construction site.
2. **Daily Logs:** Navigates to the specific construction project and clicks "Add Daily Log".
3. **Uploads:** Takes a photo of the foundation pour and uploads it directly to the platform.
4. **Issue Flagging:** Flags a new "Risk": "Material delivery delayed due to weather."
5. **Save:** Submits the log, which instantly notifies the Project Manager back at the office.
