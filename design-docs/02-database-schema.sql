-- PostgreSQL Database Schema for Enterprise Project Management Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants (Organizations)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Roles & Permissions
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PLANNING', -- PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
    type VARCHAR(50), -- SOFTWARE, CONSTRUCTION, MARKETING
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    milestone_id UUID REFERENCES milestones(id),
    parent_task_id UUID REFERENCES tasks(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'TODO', -- TODO, IN_PROGRESS, REVIEW, DONE, BLOCKED
    priority VARCHAR(50) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    assignee_id UUID REFERENCES users(id),
    reporter_id UUID REFERENCES users(id),
    start_date TIMESTAMP,
    due_date TIMESTAMP,
    estimated_hours DECIMAL(6, 2),
    actual_hours DECIMAL(6, 2),
    story_points INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Task Dependencies
CREATE TABLE task_dependencies (
    predecessor_id UUID REFERENCES tasks(id),
    successor_id UUID REFERENCES tasks(id),
    dependency_type VARCHAR(50) DEFAULT 'FINISH_TO_START', -- FS, SS, FF, SF
    PRIMARY KEY (predecessor_id, successor_id)
);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Time Logs
CREATE TABLE time_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id),
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    hours DECIMAL(5, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risks
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    probability INTEGER, -- 1-5
    impact INTEGER, -- 1-5
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, MITIGATED, CLOSED
    mitigation_plan TEXT,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets & Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    submitted_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    task_id UUID REFERENCES tasks(id), -- Optional
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Seed Data (Example)
INSERT INTO organizations (id, name, domain) VALUES 
('11111111-1111-1111-1111-111111111111', 'Acme Corp', 'acme.com');

INSERT INTO roles (id, organization_id, name, description, is_system_default) VALUES 
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Super Admin', 'Full access to all system features', TRUE),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Project Manager', 'Can manage projects and resources', TRUE);

INSERT INTO users (id, organization_id, email, first_name, last_name) VALUES 
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'admin@acme.com', 'Admin', 'User');

INSERT INTO user_roles (user_id, role_id) VALUES 
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222');
