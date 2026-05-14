"use client";

import React, { useEffect, useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  Users, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ProjectOverviewPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ id: string }> 
}) {
  const params = use(paramsPromise);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await api.projects.get(params.id);
        setProject(data);
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="h-32 bg-slate-100 rounded-xl col-span-1 md:col-span-3"></div>
        <div className="h-64 bg-slate-100 rounded-xl"></div>
        <div className="h-64 bg-slate-100 rounded-xl"></div>
        <div className="h-64 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completion', value: `${project?.progress || 0}%`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Budget Utilized', value: '64%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Risks', value: '3 High', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Days Left', value: project?.daysLeft || '42', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Project Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Overall Progress</p>
                  <p className="text-3xl font-bold text-slate-900">{project?.progress || 0}%</p>
                </div>
                <Badge variant="outline" className="bg-white">{project?.status || 'Active'}</Badge>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000" 
                  style={{ width: `${project?.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Project Type</span>
                    <span className="font-medium">{project?.type || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Start Date</span>
                    <span className="font-medium">Jan 12, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">End Date</span>
                    <span className="font-medium">Dec 20, 2024</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Team Summary</h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                        U{i}
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                      +12
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Lead: Sarah Johnson (Senior Architect)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                Upcoming Milestones
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Structural Review', date: 'May 24', status: 'upcoming' },
                { name: 'Electrical Grid Sync', date: 'Jun 02', status: 'upcoming' },
                { name: 'Foundation Pour', date: 'Jun 15', status: 'upcoming' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Collaborators</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">You have 15 active members working on this project.</p>
              <button className="w-full py-2 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
                Manage Team
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
