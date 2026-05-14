"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Filter, Download, Maximize2 } from 'lucide-react';

const timelineData = [
  { id: '1', task: 'Site Survey & Soil Analysis', start: 0, duration: 4, progress: 100, color: 'bg-blue-500' },
  { id: '2', task: 'Foundation Engineering Design', start: 3, duration: 5, progress: 85, color: 'bg-indigo-500' },
  { id: '3', task: 'Excavation & Shoring', start: 7, duration: 8, progress: 40, color: 'bg-cyan-500' },
  { id: '4', task: 'Utility Connections', start: 12, duration: 6, progress: 10, color: 'bg-sky-500' },
  { id: '5', task: 'Structural Steel Procurement', start: 10, duration: 12, progress: 0, color: 'bg-slate-400' },
  { id: '6', task: 'Concrete Substructure', start: 20, duration: 10, progress: 0, color: 'bg-slate-400' },
];

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const dayWidth = 20;

export default function ProjectTimelinePage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Timeline Roadmap</h2>
          <p className="text-sm text-slate-500">Visual schedule of milestones and deliverables.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline" size="sm"><Maximize2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border-none shadow-xl">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Timeline Header */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <div className="w-64 flex-shrink-0 p-4 border-r border-slate-100 font-semibold text-slate-600 text-sm">
              Task Name
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex">
                {months.map(month => (
                  <div key={month} className="w-[120px] text-center py-2 text-xs font-bold text-slate-400 border-r border-slate-100 uppercase tracking-wider">
                    {month} 2024
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex min-h-full">
              {/* Task Names Column */}
              <div className="w-64 flex-shrink-0 border-r border-slate-100 bg-white">
                {timelineData.map(item => (
                  <div key={item.id} className="h-16 px-4 flex items-center border-b border-slate-50 text-sm font-medium text-slate-700">
                    {item.task}
                  </div>
                ))}
              </div>

              {/* Grid Column */}
              <div className="flex-1 relative bg-white overflow-x-auto group">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="w-[40px] h-full border-r border-slate-50 flex-shrink-0" />
                  ))}
                </div>

                {/* Bars */}
                <div className="relative z-10 py-0">
                  {timelineData.map((item, index) => (
                    <div key={item.id} className="h-16 flex items-center border-b border-slate-50 relative">
                      <div 
                        className={`h-8 rounded-lg ${item.color} shadow-sm relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer`}
                        style={{ 
                          marginLeft: `${item.start * dayWidth}px`, 
                          width: `${item.duration * dayWidth}px` 
                        }}
                      >
                        {/* Progress Overlay */}
                        <div 
                          className="absolute inset-y-0 left-0 bg-white/20" 
                          style={{ width: `${item.progress}%` }} 
                        />
                        <div className="absolute inset-0 flex items-center px-3 justify-between">
                          <span className="text-[10px] font-bold text-white truncate">{item.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Today Indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-px bg-red-400 z-20 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                  style={{ left: `${6 * dayWidth}px` }}
                >
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-xs text-slate-500 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-400 rounded" />
            <span className="text-xs text-slate-500 font-medium">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span className="text-xs text-slate-500 font-medium">Today</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-bold text-slate-700">June 2024</span>
          <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
