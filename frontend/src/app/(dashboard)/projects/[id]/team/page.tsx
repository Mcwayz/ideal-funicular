"use client";

import React, { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MoreHorizontal, 
  Plus,
  Shield,
  UserCheck
} from 'lucide-react';

const teamMembers = [
  { 
    id: '1', 
    name: 'Sarah Johnson', 
    role: 'Project Manager', 
    email: 'sarah.j@acmecorp.com', 
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'Active',
    isAdmin: true
  },
  { 
    id: '2', 
    name: 'David Chen', 
    role: 'Lead Architect', 
    email: 'd.chen@acmecorp.com', 
    phone: '+1 (555) 987-6543',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'In Meeting',
    isAdmin: false
  },
  { 
    id: '3', 
    name: 'Emma Wilson', 
    role: 'Senior Developer', 
    email: 'emma.w@acmecorp.com', 
    phone: '+1 (555) 456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    status: 'Active',
    isAdmin: false
  },
  { 
    id: '4', 
    name: 'Felix Adams', 
    role: 'UI/UX Designer', 
    email: 'f.adams@acmecorp.com', 
    phone: '+1 (555) 789-0123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    status: 'Away',
    isAdmin: false
  },
];

export default function ProjectTeamPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ id: string }> 
}) {
  const params = use(paramsPromise);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'In Meeting': return 'bg-blue-100 text-blue-700';
      case 'Away': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Project Team</h2>
          <p className="text-sm text-slate-500">Manage collaborators and permissions for this project.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-blue-200 transition-colors">
                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                    member.status === 'Active' ? 'bg-green-500' : 
                    member.status === 'In Meeting' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                </div>
                <div className="flex gap-2">
                  {member.isAdmin && (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-slate-500">{member.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {member.phone}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <Button variant="outline" className="flex-1 h-9 text-xs border-slate-200">
                    <MessageSquare className="h-3 w-3 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="flex-1 h-9 text-xs border-slate-200">
                    <UserCheck className="h-3 w-3 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Member Card */}
        <button className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
          <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">Add Team Member</p>
            <p className="text-xs text-slate-500">Invite someone to collaborate</p>
          </div>
        </button>
      </div>
    </div>
  );
}
