"use client";

import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Loader2, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [intelligence, setIntelligence] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsData = await api.projects.list();
        setProjects(projectsData);
        
        let allTasks: any[] = [];
        for (const project of projectsData) {
          const projectTasks = await api.tasks.listByProject(project.id);
          allTasks = [...allTasks, ...projectTasks.map((t: any) => ({ ...t, projectName: project.name }))];
        }
        setTasks(allTasks);

        // Derive intelligence from recent tasks and projects
        const recentIntel = allTasks
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map(t => ({
            type: 'Task',
            title: t.title,
            project: t.projectName,
            time: 'Recently',
            icon: CheckSquare,
            color: 'text-green-600',
            bg: 'bg-green-100'
          }));
        setIntelligence(recentIntel);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) 
    : 0;

  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

  const stats = [
    { name: 'Active Projects', value: projects.length.toString(), icon: FolderGit2, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', trendUp: true },
    { name: 'Total Tasks', value: tasks.length.toString(), icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50', trend: '+5.4%', trendUp: true },
    { name: 'Avg. Progress', value: `${avgProgress}%`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-2.1%', trendUp: false },
    { name: 'Enterprise Value', value: totalBudget > 0 ? `$${(totalBudget / 1000000).toFixed(1)}M` : '$0M', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Live', trendUp: true },
  ];

  const projectDistribution = [
    { label: 'In Progress', count: projects.filter(p => p.status === 'IN_PROGRESS').length, color: 'bg-blue-500' },
    { label: 'Planning', count: projects.filter(p => p.status === 'PLANNING').length, color: 'bg-amber-500' },
    { label: 'Completed', count: projects.filter(p => p.status === 'DONE').length, color: 'bg-green-500' },
    { label: 'On Hold', count: projects.filter(p => p.status === 'ON_HOLD').length, color: 'bg-red-400' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enterprise Overview</h1>
          <p className="text-slate-500 mt-1">Real-time performance analytics and project health monitoring.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Clock className="h-4 w-4" />
            Last 30 Days
          </button>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
            Export Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Velocity Chart (Mockup with SVG) */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-xl font-bold">Project Velocity</CardTitle>
              <CardDescription>Tasks completion trend over the last 6 months</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                Completed
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-3 h-3 bg-slate-200 rounded-full" />
                Created
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64 w-full relative pt-4">
              {/* SVG Area Chart */}
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                {[0, 50, 100, 150].map(y => (
                  <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                {/* Area */}
                <path 
                  d="M0,180 L50,150 L100,160 L150,110 L200,130 L250,80 L300,90 L350,50 L400,65 L450,30 L500,45 L550,15 L600,10 L600,200 L0,200 Z" 
                  fill="url(#gradient)" 
                />
                {/* Line */}
                <path 
                  d="M0,180 L50,150 L100,160 L150,110 L200,130 L250,80 L300,90 L350,50 L400,65 L450,30 L500,45 L550,15 L600,10" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Dots */}
                {[
                  [0,180], [100,160], [200,130], [300,90], [400,65], [500,45], [600,10]
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                ))}
              </svg>
              <div className="flex justify-between mt-6 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Distribution */}
        <Card className="border-none shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Resource Mix</CardTitle>
            <CardDescription>Project distribution by status</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="relative h-48 w-48 mx-auto mb-8">
              {/* Simplified Pie Chart with CSS Conic Gradient */}
              <div 
                className="w-full h-full rounded-full" 
                style={{
                  background: 'conic-gradient(#3b82f6 0% 40%, #f59e0b 40% 60%, #10b981 60% 90%, #f87171 90% 100%)'
                }}
              />
              <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-slate-900">{projects.length || 0}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Projects</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {projectDistribution.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{item.count}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects Table-like view */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Top Performing Projects</CardTitle>
              <CardDescription>Ranked by delivery velocity and health</CardDescription>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Analyzing project performance...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <FolderGit2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No active projects to display.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {projects.slice(0, 4).map((project, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h4>
                        <p className="text-xs text-slate-500">PM: {project.managerName || 'Sarah J.'}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block w-32">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress || 0}%` }} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">{project.progress || 0}% Complete</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">${((project.budget || 0) / 1000).toFixed(0)}K</p>
                      <Badge variant="outline" className="text-[10px] mt-1 h-5 uppercase">{project.status.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Intelligence</CardTitle>
            <CardDescription>Live updates from your teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-100 before:z-0">
              {isLoading ? (
                <div className="py-10 text-center text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : intelligence.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 italic">
                  No recent activities recorded.
                </div>
              ) : (
                intelligence.map((item, i) => (
                  <div key={i} className="flex gap-4 relative z-10">
                    <div className={`h-8 w-8 rounded-full ${item.bg} flex items-center justify-center shrink-0 shadow-sm border-2 border-white`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-slate-900 truncate max-w-[140px]">{item.title}</h5>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[180px]">{item.project} • {item.type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-8 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest border border-slate-100 rounded-xl hover:bg-slate-50">
              Audit Full Stream
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
