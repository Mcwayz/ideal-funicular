# System & Security Architecture

## 1. High-Level System Architecture

The Enterprise Project Management Platform will be built using a robust, cloud-native microservices-ready architecture. The system is designed to handle multiple tenants (organizations), heavy data loads (documents, schedules), and real-time collaboration.

### 1.1 Core Components
* **Frontend Application (Client Layer):**
  * Built with React / Next.js (TypeScript).
  * Server-Side Rendering (SSR) for initial load performance and SEO.
  * Static Site Generation (SSG) for documentation and help pages.
  * Communicates with backend via REST for standard operations and GraphQL for complex dashboard data fetching. WebSocket/SSE for real-time updates.
* **API Gateway & Load Balancer:**
  * Nginx or AWS API Gateway.
  * Handles SSL termination, rate limiting, and request routing.
* **Backend Services (Application Layer):**
  * Built with Java Spring Boot.
  * **Auth Service:** Manages user authentication, SSO (OAuth2), and JWT token issuance.
  * **Core Project Service:** Manages projects, WBS, milestones, tasks.
  * **Resource & Financial Service:** Manages budgets, human resources, and utilization.
  * **Communication & Doc Service:** Handles chat, notifications, and file attachments.
  * **AI & Analytics Service:** Python (FastAPI) based service for AI predictions, reporting, and natural language search.
* **Database Layer:**
  * **Primary Data Store:** PostgreSQL (Relational schema for structured data, Multi-tenant).
  * **Caching & Message Broker:** Redis (Session caching, real-time presence, rate limiting, pub/sub for WebSockets).
  * **Search Engine:** Elasticsearch (Full-text search for tasks, documents, and logs).
  * **Object Storage:** AWS S3 or equivalent (PDFs, images, construction drawings).
* **Background Processing:**
  * Spring Boot `@Async` or Quartz Scheduler for background jobs (report generation, email notifications, status syncs).

## 2. Authentication System

* **Strategy:** Stateless authentication using JWT (JSON Web Tokens).
* **Standard Login:** Email/Password backed by strong hashing (Argon2 / BCrypt).
* **SSO / Enterprise Login:** OAuth2 and SAML integrations (Google Workspace, Azure AD, Microsoft 365).
* **Multi-Factor Authentication (MFA):** TOTP (Time-based One-Time Password) using Google Authenticator / Authy.
* **Session Management:** Short-lived access tokens (15 mins) and long-lived, rotating refresh tokens securely stored as HttpOnly cookies.

## 3. Security Architecture

### 3.1 Data Protection
* **Encryption at Rest:** All databases (PostgreSQL, Elasticsearch) and Object Storage (S3) will use AES-256 encryption.
* **Encryption in Transit:** Strict TLS 1.3 enforcement for all client-to-server and internal service-to-service communication.
* **File Upload Security:** Strict MIME-type checking, file size limits, and antivirus scanning for uploaded documents before saving to S3.

### 3.2 Access Control & Network Security
* **Role-Based Access Control (RBAC):** Fine-grained permission matrix mapped to user roles (Super Admin, Project Manager, Viewer, etc.). Evaluated at both API Gateway and Service levels.
* **IP Restrictions:** Ability for Organization Admins to whitelist IP addresses for corporate network access.
* **API Rate Limiting:** Throttling via Redis to prevent DDoS and brute-force attacks.

### 3.3 Compliance & Auditing
* **Audit Logs:** Immutable audit trail logging (Who, What, When, IP, Device) for all critical actions (budget changes, permission updates, document deletions).
* **Soft Deletes:** Records are never hard-deleted; instead, an `is_deleted` flag is flipped, maintaining relational integrity and allowing recovery.

## 4. Multi-Tenancy Strategy
* **Logical Separation:** A single shared database with a `tenant_id` (organization_id) column on every relevant table. Row-Level Security (RLS) policies in PostgreSQL will enforce tenant isolation at the database level to prevent accidental cross-tenant data leaks.
