"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, User, Clock, Flag, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useWebSockets } from '@/hooks/useWebSockets';
import { Modal } from '@/components/Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const initialTasks = [
  { id: '1', title: 'Site Preparation & Fencing', status: 'TODO', priority: 'HIGH', assignee: 'Sarah W.', dueDate: '2024-06-15' },
  { id: '2', title: 'Procure Structural Steel', status: 'TODO', priority: 'CRITICAL', assignee: 'Felix A.', dueDate: '2024-06-10' },
  { id: '3', title: 'Foundation Excavation', status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'David C.', dueDate: '2024-07-01' },
  { id: '4', title: 'Concrete Pouring (Section A)', status: 'IN_PROGRESS', priority: 'MEDIUM', assignee: 'Sarah W.', dueDate: '2024-07-05' },
  { id: '5', title: 'Initial Design Review', status: 'DONE', priority: 'MEDIUM', assignee: 'Emma K.', dueDate: '2024-05-20' },
  { id: '6', title: 'Soil Testing Report', status: 'DONE', priority: 'LOW', assignee: 'Felix A.', dueDate: '2024-05-15' },
];

const columns = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-100 border-slate-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50/50 border-blue-100' },
  { id: 'DONE', title: 'Completed', color: 'bg-green-50/50 border-green-100' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'MEDIUM', 
    status: 'TODO', 
    dueDate: '',
    projectId: ''
  });
  const { lastMessage, sendMessage } = useWebSockets('/topic/tasks');

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const projectsData = await api.projects.list();
      setProjects(projectsData);
      
      let allTasks: any[] = [];
      if (projectsData.length > 0) {
        if (!newTask.projectId) setNewTask(prev => ({ ...prev, projectId: projectsData[0].id }));
        
        for (const p of projectsData) {
          const pt = await api.tasks.listByProject(p.id);
          allTasks = [...allTasks, ...pt];
        }
        setTasks(allTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.projectId) return;
    setIsCreating(true);
    try {
      await api.tasks.create(newTask.projectId, newTask);
      setIsModalOpen(false);
      setNewTask({ ...newTask, title: '', description: '', dueDate: '' });
      loadTasks();
    } catch (error) {
      alert("Failed to create task");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle incoming live updates
  React.useEffect(() => {
    if (lastMessage) {
      setTasks(prev => {
        const index = prev.findIndex(t => t.id === lastMessage.id);
        if (index > -1) {
          const newTasks = [...prev];
          newTasks[index] = { ...newTasks[index], ...lastMessage };
          return newTasks;
        }
        return [lastMessage, ...prev];
      });
    }
  }, [lastMessage]);

  React.useEffect(() => {
    loadTasks();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      case 'HIGH': return 'bg-orange-100 text-orange-700';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700';
      case 'LOW': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Board</h1>
          <p className="text-slate-500">Manage and track your project tasks across stages.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">Sort</Button>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <select 
              id="project"
              className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
              value={newTask.projectId}
              onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
              required
            >
              <option value="" disabled>Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input 
              id="title" 
              required 
              placeholder="e.g. Design System update" 
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select 
                id="priority"
                className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                required
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-h-full">
          {columns.map((column) => (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-700">{column.title}</h3>
                  <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                    {tasks.filter(t => t.status === column.id).length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className={`flex-1 rounded-xl border-2 border-dashed p-3 space-y-3 ${column.color}`}>
                {tasks.filter(t => t.status === column.id).map((task) => (
                  <Card key={task.id} className="group cursor-pointer border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <Badge className={`text-[10px] font-bold ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {task.title}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-400">
                          <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                            {task.assignee?.split(' ').map((n: string) => n[0]).join('') || '?'}
                          </div>
                          <span className="text-xs">{task.assignee || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 justify-start h-10 border-none">
                  <Plus className="h-4 w-4 mr-2" />
                  Add another card
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
