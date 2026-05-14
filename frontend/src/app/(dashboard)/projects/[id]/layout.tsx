"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronRight, 
  LayoutDashboard, 
  Clock, 
  DollarSign, 
  CheckSquare, 
  Users, 
  Settings,
  ArrowLeft
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ProjectLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const pathname = usePathname();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await api.projects.get(params.id);
        setProject(data);
      } catch (error) {
        console.error("Failed to load project:", error);
      }
    };
    loadProject();
  }, [params.id]);

  const tabs = [
    { name: 'Overview', href: `/projects/${params.id}`, icon: LayoutDashboard },
    { name: 'Timeline', href: `/projects/${params.id}/timeline`, icon: Clock },
    { name: 'Finances', href: `/projects/${params.id}/finances`, icon: DollarSign },
    { name: 'Tasks', href: `/projects/${params.id}/tasks`, icon: CheckSquare },
    { name: 'Team', href: `/projects/${params.id}/team`, icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/projects" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            Projects
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-slate-900">{project?.name || 'Loading...'}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {project?.name || 'Project Details'}
            </h1>
            <p className="text-slate-500 mt-1">
              {project?.description || 'Manage your project milestones and resources.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
