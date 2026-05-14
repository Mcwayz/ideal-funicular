"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ProjectFinancesPage() {
  const financialData = {
    totalBudget: 125000000,
    actualSpend: 82500000,
    forecast: 122000000,
    roi: 18.5,
  };

  const categories = [
    { name: 'Labor', budgeted: 45000000, actual: 48000000, color: 'bg-blue-500' },
    { name: 'Materials', budgeted: 60000000, actual: 28000000, color: 'bg-indigo-500' },
    { name: 'Equipment', budgeted: 15000000, actual: 4500000, color: 'bg-cyan-500' },
    { name: 'Permits', budgeted: 5000000, actual: 2000000, color: 'bg-sky-500' },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Financial Overview</h2>
          <p className="text-sm text-slate-500">Real-time budget tracking and utilization analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Total Budget', value: formatCurrency(financialData.totalBudget), icon: DollarSign, trend: 'neutral' },
          { name: 'Actual Spend', value: formatCurrency(financialData.actualSpend), icon: Activity, trend: 'up', trendVal: '+12%' },
          { name: 'Projected ROI', value: `${financialData.roi}%`, icon: ArrowUpRight, trend: 'up', trendVal: 'Target 15%' },
          { name: 'Cost Variance', value: formatCurrency(financialData.totalBudget - financialData.actualSpend), icon: BarChart3, trend: 'down', trendVal: 'Under budget' },
        ].map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <stat.icon className="h-5 w-5 text-slate-600" />
                </div>
                {stat.trendVal && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {stat.trendVal}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Budget vs Actual by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{cat.name}</span>
                    <span className="text-slate-500">{formatCurrency(cat.actual)} / {formatCurrency(cat.budgeted)}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${cat.color} rounded-full`} 
                      style={{ width: `${(cat.actual / cat.budgeted) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Financial Health</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="relative h-40 w-40 flex items-center justify-center">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle className="text-slate-100 stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                <circle className="text-green-500 stroke-current" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.85)} strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" transform="rotate(-90 50 50)" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900">85</span>
                <span className="text-xs font-medium text-slate-500 uppercase">Health Score</span>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              Your project is currently <span className="font-bold text-green-600">low risk</span>. Cost variance is within acceptable margins.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
