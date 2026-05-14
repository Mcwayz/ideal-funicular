"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Plus, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  ShieldAlert,
  Clock,
  ExternalLink,
  MoreHorizontal,
  Loader2,
  Users
} from 'lucide-react';
import { api } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const risks = [
  { 
    id: '1', 
    title: 'Materials Supply Chain Delay', 
    project: 'Skyline Residential Tower', 
    impact: 'HIGH', 
    probability: 'MEDIUM', 
    status: 'ACTIVE', 
    owner: 'Sarah J.', 
    mitigation: 'Identifying alternative suppliers in the region.'
  },
  { 
    id: '2', 
    title: 'Environmental Permit Revision', 
    project: 'Quantum ERP Migration', 
    impact: 'CRITICAL', 
    probability: 'LOW', 
    status: 'MITIGATED', 
    owner: 'David C.', 
    mitigation: 'Engaged specialized legal counsel for expedited review.'
  },
  { 
    id: '3', 
    title: 'Labor Shortage (Concrete)', 
    project: 'Bridge Rehabilitation', 
    impact: 'MEDIUM', 
    probability: 'HIGH', 
    status: 'ACTIVE', 
    owner: 'Emma W.', 
    mitigation: 'Reviewing overtime options and subcontractor availability.'
  },
  { 
    id: '4', 
    title: 'Data Migration Integrity', 
    project: 'Quantum ERP Migration', 
    impact: 'CRITICAL', 
    probability: 'MEDIUM', 
    status: 'ACTIVE', 
    owner: 'Felix A.', 
    mitigation: 'Implementing additional validation scripts and dual-run phase.'
  },
];

export default function RisksPage() {
  const [risks, setRisks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [newRisk, setNewRisk] = React.useState({ 
    title: '', 
    description: '', 
    impact: 'MEDIUM', 
    probability: 'MEDIUM', 
    projectId: '',
    mitigationPlan: ''
  });

  const loadRisks = async () => {
    setIsLoading(true);
    try {
      const data = await api.risks.list();
      setRisks(data);
      
      const projectsData = await api.projects.list();
      setProjects(projectsData);
      if (projectsData.length > 0 && !newRisk.projectId) {
        setNewRisk(prev => ({ ...prev, projectId: projectsData[0].id }));
      }
    } catch (error) {
      console.error("Failed to load risks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadRisks();
  }, []);

  const handleCreateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRisk.projectId) return;
    setIsCreating(true);
    try {
      await api.risks.create(newRisk.projectId, newRisk);
      setIsModalOpen(false);
      setNewRisk({ ...newRisk, title: '', description: '', mitigationPlan: '' });
      loadRisks();
    } catch (error) {
      alert("Failed to register risk");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const getImpactColor = (impact: any) => {
    const impactStr = typeof impact === 'number' ? 
      (impact >= 4 ? 'CRITICAL' : impact === 3 ? 'HIGH' : impact === 2 ? 'MEDIUM' : 'LOW') : 
      impact;

    switch (impactStr) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getProbabilityLabel = (prob: any) => {
    if (typeof prob === 'number') {
      return prob >= 4 ? 'HIGH' : prob === 3 ? 'MEDIUM' : 'LOW';
    }
    return prob;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Risk Registry</h1>
          <p className="text-slate-500 mt-1">Identify, track, and mitigate potential project threats.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-200">
            <Filter className="h-4 w-4 mr-2" />
            Impact View
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Register Risk
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Register New Risk"
      >
        <form onSubmit={handleCreateRisk} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Associated Project</Label>
            <select 
              id="project"
              className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
              value={newRisk.projectId}
              onChange={(e) => setNewRisk({...newRisk, projectId: e.target.value})}
              required
            >
              <option value="" disabled>Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Risk Title</Label>
            <Input 
              id="title" 
              required 
              placeholder="e.g. Supplier Insolvency" 
              value={newRisk.title}
              onChange={(e) => setNewRisk({...newRisk, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="impact">Impact Level</Label>
              <select 
                id="impact"
                className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
                value={newRisk.impact}
                onChange={(e) => setNewRisk({...newRisk, impact: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prob">Probability</Label>
              <select 
                id="prob"
                className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
                value={newRisk.probability}
                onChange={(e) => setNewRisk({...newRisk, probability: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mitigation">Mitigation Strategy</Label>
            <textarea 
              id="mitigation"
              className="w-full min-h-[80px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none"
              placeholder="How will we address this if it occurs?"
              value={newRisk.mitigationPlan}
              onChange={(e) => setNewRisk({...newRisk, mitigationPlan: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Register Risk
            </Button>
          </div>
        </form>
      </Modal>

      {/* Risk Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-red-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-2xl">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-600/70 uppercase tracking-wider">Critical Risks</p>
                <p className="text-3xl font-black text-red-700">
                  {risks.filter(r => (typeof r.impact === 'number' ? r.impact >= 4 : r.impact === 'CRITICAL')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-2xl">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-600/70 uppercase tracking-wider">Active Risks</p>
                <p className="text-3xl font-black text-orange-700">
                  {risks.filter(r => r.status === 'ACTIVE' || r.status === 'OPEN').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-2xl">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600/70 uppercase tracking-wider">Mitigated</p>
                <p className="text-3xl font-black text-green-700">
                  {risks.filter(r => r.status === 'MITIGATED' || r.status === 'CLOSED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-slate-50 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Active Risk Inventory</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                placeholder="Search risks..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Synchronizing risk intelligence...</p>
            </div>
          ) : risks.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No risks currently registered.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Risk Detail</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Impact</th>
                  <th className="px-6 py-4">Probability</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {risks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {risk.title}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5 truncate max-w-xs italic">
                          {risk.mitigationPlan || risk.mitigation || "No mitigation plan recorded."}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white text-slate-500 font-medium border-slate-200">
                          {risk.projectName || risk.project?.name || "Global"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`font-bold text-[10px] ${getImpactColor(risk.impact)}`}>
                        {typeof risk.impact === 'number' ? (risk.impact >= 4 ? 'CRITICAL' : risk.impact === 3 ? 'HIGH' : 'MEDIUM') : risk.impact}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            getProbabilityLabel(risk.probability) === 'HIGH' ? 'bg-orange-500' : 
                            getProbabilityLabel(risk.probability) === 'MEDIUM' ? 'bg-blue-500' : 'bg-slate-400'
                          }`} style={{ width: getProbabilityLabel(risk.probability) === 'HIGH' ? '90%' : getProbabilityLabel(risk.probability) === 'MEDIUM' ? '50%' : '20%' }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{getProbabilityLabel(risk.probability)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {(risk.ownerName || risk.owner)?.split(' ').map((n: string) => n[0]).join('') || '?'}
                        </div>
                        <span className="text-sm text-slate-600">{risk.ownerName || risk.owner || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={
                        risk.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }>
                        {risk.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
