package com.acmecorp.pmplatform.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "task_dependencies")
@IdClass(TaskDependency.TaskDependencyId.class)
public class TaskDependency {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predecessor_id")
    private Task predecessor;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "successor_id")
    private Task successor;

    @Column(name = "dependency_type", length = 50)
    private String dependencyType = "FINISH_TO_START";

    // Inner class for Composite Key
    public static class TaskDependencyId implements Serializable {
        private Task predecessor;
        private Task successor;

        public TaskDependencyId() {}

        public TaskDependencyId(Task predecessor, Task successor) {
            this.predecessor = predecessor;
            this.successor = successor;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            TaskDependencyId that = (TaskDependencyId) o;
            return predecessor.equals(that.predecessor) && successor.equals(that.successor);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(predecessor, successor);
        }
    }

    // Getters and Setters
    public Task getPredecessor() {
        return predecessor;
    }

    public void setPredecessor(Task predecessor) {
        this.predecessor = predecessor;
    }

    public Task getSuccessor() {
        return successor;
    }

    public void setSuccessor(Task successor) {
        this.successor = successor;
    }

    public String getDependencyType() {
        return dependencyType;
    }

    public void setDependencyType(String dependencyType) {
        this.dependencyType = dependencyType;
    }
}
