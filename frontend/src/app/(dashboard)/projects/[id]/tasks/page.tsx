"use client";

import React, { useState, useEffect, use } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, User, Clock, Flag, Loader2, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { useWebSockets } from '@/hooks/useWebSockets';

const columns = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-100 border-slate-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50/50 border-blue-100' },
  { id: 'DONE', title: 'Completed', color: 'bg-green-50/50 border-green-100' },
];

export default function ProjectTasksPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ id: string }> 
}) {
  const params = use(paramsPromise);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lastMessage } = useWebSockets(`/topic/tasks/project/${params.id}`);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await api.tasks.listByProject(params.id);
        setTasks(data);
      } catch (error) {
        console.error("Failed to load project tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, [params.id]);

  // Handle live updates
  useEffect(() => {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Task Board</h2>
          <p className="text-sm text-slate-500">Manage and track your project tasks across stages.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              placeholder="Search tasks..." 
              className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
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
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-slate-400 text-xs">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
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
      )}
    </div>
  );
}
