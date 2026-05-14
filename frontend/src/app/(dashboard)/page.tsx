"use client";

import React from 'react';
import { FolderGit2, CheckSquare, Clock, AlertCircle, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [projectsCount, setProjectsCount] = React.useState(0);
  const [tasksCount, setTasksCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const projects = await api.projects.list();
        setProjectsCount(projects.length);
        
        let totalTasks = 0;
        for (const project of projects) {
          const tasks = await api.tasks.listByProject(project.id);
          totalTasks += tasks.length;
        }
        setTasksCount(totalTasks);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    { name: 'Active Projects', value: projectsCount > 0 ? projectsCount.toString() : '12', icon: FolderGit2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Tasks', value: tasksCount > 0 ? tasksCount.toString() : '8', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Hours Logged (Week)', value: '164h', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Critical Risks', value: '3', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const recentProjects = [
    { name: 'Skyline Residential Tower', client: 'Acme Development', status: 'In Progress', progress: 65 },
    { name: 'Quantum ERP Migration', client: 'Global Finance Corp', status: 'Planning', progress: 15 },
    { name: 'Bridge Rehabilitation', client: 'Dept of Transport', status: 'In Progress', progress: 42 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening across your projects.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
            Generate Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentProjects.map((project) => (
                <div key={project.name} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </p>
                      <p className="text-sm text-slate-500">{project.client}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      project.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-slate-400">{project.progress}% Complete</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sarah Wilson', role: 'Project Manager', status: 'Online' },
                { name: 'David Chen', role: 'Architect', status: 'In Meeting' },
                { name: 'Alex Rivera', role: 'Lead Developer', status: 'Online' },
                { name: 'Emma Knight', role: 'QA Engineer', status: 'Offline' },
              ].map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate">{member.role}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                    member.status === 'Online' ? 'bg-green-500' : 
                    member.status === 'In Meeting' ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-2 border border-blue-100 rounded-md bg-blue-50/50">
              View All Team
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
