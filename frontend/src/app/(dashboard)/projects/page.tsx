"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar, 
  Users, 
  BarChart3, 
  Building2,
  Code2,
  HardHat,
  Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Modal } from '@/components/Modal';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', type: 'GENERAL', status: 'PLANNING' });
  const router = useRouter();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.projects.list();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.projects.create(newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', type: 'GENERAL', status: 'PLANNING' });
      loadProjects();
    } catch (error) {
      alert("Failed to create project. Check console.");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONSTRUCTION': return <HardHat className="h-4 w-4" />;
      case 'SOFTWARE': return <Code2 className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'success';
      case 'PLANNING': return 'secondary';
      case 'DONE': return 'default';
      case 'ON_HOLD': return 'warning';
      default: return 'outline';
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-slate-500">Manage and monitor all enterprise initiatives.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name" 
              required 
              placeholder="e.g. Skyline Tower" 
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <textarea 
              id="desc"
              className="w-full min-h-[100px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="Brief overview of project goals..."
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select 
                id="type"
                className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
                value={newProject.type}
                onChange={(e) => setNewProject({...newProject, type: e.target.value})}
              >
                <option value="GENERAL">General</option>
                <option value="CONSTRUCTION">Construction</option>
                <option value="SOFTWARE">Software</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <select 
                id="status"
                className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
                value={newProject.status}
                onChange={(e) => setNewProject({...newProject, status: e.target.value})}
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-200">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-slate-200">
                <BarChart3 className="h-4 w-4 mr-2" />
                Views
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No projects found</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-1">
            {searchQuery ? "Try adjusting your search query." : "Get started by creating your first project."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="group hover:border-blue-300 transition-all cursor-pointer border-slate-200 shadow-sm hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 transition-colors">
                      {getTypeIcon(project.type)}
                    </div>
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-xl group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">
                    {project.description || "No description provided."}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-medium">{project.teamCount || 0} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium">Due in {project.daysLeft || 0}d</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
