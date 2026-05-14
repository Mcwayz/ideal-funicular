# API Design Documentation

The backend exposes a RESTful API for standard CRUD operations and standard flows, and a GraphQL endpoint for complex dashboard aggregations.

## Base URL
`/api/v1`

## Authentication

All endpoints (except `/auth/*`) require a Bearer token in the `Authorization` header.
`Authorization: Bearer <jwt_access_token>`

## REST Endpoints

### 1. Authentication (`/auth`)
* `POST /auth/login`: Authenticate user and return JWT tokens.
* `POST /auth/refresh`: Refresh an expired access token using a refresh token.
* `POST /auth/sso`: Authenticate via OAuth provider (Google/Azure).

### 2. Users & Organizations (`/organizations`, `/users`)
* `GET /organizations/{id}`: Get organization details.
* `GET /users/me`: Get current user profile and permissions.
* `GET /organizations/{id}/users`: List all users in the organization (Paginated).
* `POST /users`: Invite a new user to the organization.
* `PUT /users/{id}/roles`: Update user roles.

### 3. Projects (`/projects`)
* `GET /projects`: List projects (Filter by status, type).
* `POST /projects`: Create a new project.
* `GET /projects/{id}`: Get project details.
* `PUT /projects/{id}`: Update project.
* `DELETE /projects/{id}`: Soft delete project.

### 4. Tasks & Milestones (`/projects/{id}/tasks`, `/projects/{id}/milestones`)
* `GET /projects/{id}/tasks`: Get all tasks for a project (Filter by assignee, sprint, status).
* `POST /projects/{id}/tasks`: Create a new task.
* `PUT /projects/{id}/tasks/{taskId}`: Update a task.
* `PATCH /projects/{id}/tasks/{taskId}/status`: Quickly update task status (Kanban drag-and-drop).
* `POST /tasks/{taskId}/dependencies`: Add a task dependency (FS, SS).

### 5. Comments & Activity (`/tasks/{taskId}/comments`)
* `GET /tasks/{taskId}/comments`: Get comments.
* `POST /tasks/{taskId}/comments`: Add a comment.

### 6. Documents (`/projects/{id}/documents`)
* `POST /projects/{id}/documents/upload`: Upload a file to S3 and save metadata. Returns S3 URL.
* `GET /projects/{id}/documents`: List documents for a project.
* `DELETE /documents/{docId}`: Delete a document.

### 7. AI & Predictions (`/ai`)
* `POST /ai/predict-delay`: Analyze task dependencies and velocity to predict project delays.
* `POST /ai/summarize-status`: Generate a weekly executive summary for a project.

## GraphQL Endpoint

`/graphql`

Used primarily by the frontend dashboards to avoid over-fetching.

### Query Examples

```graphql
query GetDashboardData($userId: ID!) {
  me(id: $userId) {
    firstName
    activeProjects {
      id
      name
      healthScore
      progressPercentage
      upcomingMilestones(limit: 3) {
        name
        dueDate
      }
      myTasks(status: ["TODO", "IN_PROGRESS"]) {
        id
        title
        dueDate
      }
    }
    utilization {
      currentWeekHours
      capacity
    }
  }
}
```

## Error Handling

Standardized JSON error responses:

```json
{
  "error": "Not Found",
  "message": "Project with ID 1234 not found.",
  "status": 404,
  "timestamp": "2026-05-14T09:00:00Z"
}
```
