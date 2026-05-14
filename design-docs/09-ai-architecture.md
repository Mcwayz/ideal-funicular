# AI Module Architecture

To provide intelligent capabilities like timeline predictions, smart assignment, and automated summaries, the platform integrates a dedicated AI microservice.

## 1. Architecture Overview

* **Service:** Python FastAPI application running independently of the Spring Boot core.
* **Communication:** Spring Boot core communicates with the AI service via synchronous REST calls (for immediate tasks like search) and asynchronous Message Queues (RabbitMQ or Kafka) for heavy processing (like retraining models or massive batch predictions).
* **AI Provider:** Integration with OpenAI (GPT-4o / GPT-4-turbo) via API for NLP tasks, and custom Scikit-Learn/TensorFlow models for numerical predictions (delay risk).
* **Vector Database:** Pinecone or PostgreSQL + pgvector for semantic search over documents and tasks.

## 2. Core Capabilities

### 2.1 Project Timeline & Delay Prediction

* **Mechanism:** A Machine Learning regression model trained on historical project data (estimated vs. actual hours, task dependencies, assigned user velocity).
* **Trigger:** Runs nightly for all active projects or manually triggered by the PM.
* **Output:** A "Risk Score" (0-100) and a predicted end date, displayed on the Project Dashboard.

### 2.2 Smart Task Assignment & Resource Optimization

* **Mechanism:** Heuristic algorithm combined with AI. Evaluates team members based on:

  1. Current workload / capacity.
  2. Historical velocity on similar tasks.
  3. Skill matrix (tags matching).

* **UX:** When creating a task, the "Assignee" dropdown highlights the top 3 "AI Recommended" users.

### 2.3 Automated Status Summaries & NLP

* **Mechanism:** Uses a Large Language Model (LLM) to read all comments, time logs, and status changes made over the last 7 days for a specific project.
* **Output:** Generates a 3-paragraph executive summary highlighting:

  * Key accomplishments.
  * Current blockers.
  * Focus for next week.

* **UX:** Available as a "Generate AI Summary" button in the Reports module.

### 2.4 Natural Language Search

* **Mechanism:** User queries (e.g., "Show me all critical bugs related to the login API from last month") are parsed by the LLM into structured GraphQL/SQL queries, executed against the database, and results are returned directly to the UI.

## 3. Data Privacy & Security

* **Tenant Isolation:** AI vector embeddings are tagged with the `organization_id` to prevent cross-tenant data leakage during semantic search.
* **Zero Retention:** Enterprise agreements with AI providers (like OpenAI) ensure that customer data sent via API is NOT used to train their foundational models and is retained for exactly 0 days.
