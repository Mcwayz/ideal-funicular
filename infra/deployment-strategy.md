# Deployment Strategy

This document outlines the deployment strategy for the Enterprise Project Management Platform, ensuring zero downtime and high availability.

## Environments

1. **Development (Local):** `docker-compose.yml` is used by engineers to spin up the entire stack locally.
2. **Staging:** A Kubernetes namespace (`pm-staging`) mirroring production. Deployed automatically from the `staging` branch. Used for E2E testing and QA sign-off.
3. **Production:** The live environment (`pm-prod` namespace). Deployed from the `main` branch upon approval.

## Deployment Rollout Plan (Production)

We utilize a **Rolling Update** deployment strategy managed by Kubernetes to ensure zero-downtime updates.

### 1. Database Migrations
* **Pre-Deployment:** Database migrations (managed via Liquibase or Flyway in Spring Boot) are executed *before* the new application pods start accepting traffic.
* **Backward Compatibility:** All database changes (e.g., adding columns, modifying tables) must be backward compatible with the currently running application version to prevent errors during the rolling update.

### 2. Backend Rollout
* Kubernetes will start new backend pods with the latest Docker image.
* **Readiness Probes:** The new pods will not receive traffic until the `/actuator/health/readiness` endpoint returns HTTP 200 OK (ensuring Spring Boot has fully started and connected to the database).
* Once ready, Kubernetes gradually routes traffic to the new pods while gracefully terminating the old ones.

### 3. Frontend Rollout
* Similar to the backend, new Next.js pods are spun up.
* Since the frontend relies on the backend API, the backend must always be deployed and stable before the frontend deployment begins.

## Disaster Recovery & Backups

* **Database:** AWS RDS PostgreSQL is configured with Multi-AZ for high availability and automatic daily snapshots retained for 30 days. Point-in-Time Recovery (PITR) is enabled.
* **Object Storage:** AWS S3 buckets containing documents have versioning enabled to prevent accidental deletion or overwriting. Cross-region replication (CRR) is configured for critical compliance data.

## Monitoring & Alerting

* **Metrics:** Prometheus scrapes metrics from Spring Boot Actuator and Next.js.
* **Dashboards:** Grafana visualizes system health (CPU, Memory, API latency, Database connections).
* **Alerts:** PagerDuty is integrated to alert the on-call DevOps engineer if error rates spike above 1% or if API latency exceeds 500ms for more than 5 minutes.
