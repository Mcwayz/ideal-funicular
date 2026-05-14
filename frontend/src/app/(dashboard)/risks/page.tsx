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
  MoreHorizontal
} from 'lucide-react';

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
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
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
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Register Risk
          </Button>
        </div>
      </div>

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
                <p className="text-3xl font-black text-red-700">2</p>
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
                <p className="text-3xl font-black text-orange-700">8</p>
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
                <p className="text-3xl font-black text-green-700">14</p>
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
                          {risk.mitigation}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white text-slate-500 font-medium border-slate-200">
                          {risk.project}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`font-bold text-[10px] ${getImpactColor(risk.impact)}`}>
                        {risk.impact}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            risk.probability === 'HIGH' ? 'bg-orange-500' : 
                            risk.probability === 'MEDIUM' ? 'bg-blue-500' : 'bg-slate-400'
                          }`} style={{ width: risk.probability === 'HIGH' ? '90%' : risk.probability === 'MEDIUM' ? '50%' : '20%' }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{risk.probability}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {risk.owner.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-slate-600">{risk.owner}</span>
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
        </CardContent>
      </Card>
    </div>
  );
}
