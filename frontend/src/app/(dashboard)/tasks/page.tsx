"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, User, Clock, Flag, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useWebSockets } from '@/hooks/useWebSockets';

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
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const { lastMessage, sendMessage } = useWebSockets('/topic/tasks');

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
    const loadTasks = async () => {
      try {
        const projects = await api.projects.list();
        if (projects.length > 0) {
          const projectTasks = await api.tasks.listByProject(projects[0].id);
          if (projectTasks.length > 0) setTasks(projectTasks);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
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
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

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
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs">{task.assignee}</span>
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
