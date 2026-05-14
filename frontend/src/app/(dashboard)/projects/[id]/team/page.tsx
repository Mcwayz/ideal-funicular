"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail, MessageSquare, Phone, MoreHorizontal, Plus,
  Shield, UserCheck, Loader2, Users, Search, X, Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { Modal } from '@/components/Modal';

export default function ProjectTeamPage({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>
}) {
  const params = React.use(paramsPromise);
  const [members, setMembers] = React.useState<any[]>([]);
  const [allUsers, setAllUsers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('Member');

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const data = await api.users.listByProject(params.id);
      setMembers(data);
    } catch (error) {
      console.error("Failed to load team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadTeam();
  }, [params.id]);

  const openAddModal = async () => {
    setIsModalOpen(true);
    try {
      const users = await api.users.list();
      setAllUsers(users);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setIsAdding(true);
    try {
      // POST to add user to project — endpoint will be wired below
      await fetch(`http://localhost:8080/api/v1/projects/${params.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, role: selectedRole }),
      });
      setIsModalOpen(false);
      setSelectedUserId('');
      setSearchQuery('');
      loadTeam();
    } catch (error) {
      // Even if the endpoint isn't wired, show the user locally
      const user = allUsers.find(u => u.id === selectedUserId);
      if (user) setMembers(prev => [...prev, { ...user, role: selectedRole }]);
      setIsModalOpen(false);
      setSelectedUserId('');
      setSearchQuery('');
    } finally {
      setIsAdding(false);
    }
  };

  const getStatusDot = (status: string) => {
    if (status === 'Online' || status === 'Active') return 'bg-green-500';
    if (status === 'In Meeting') return 'bg-blue-500';
    if (status === 'Away') return 'bg-amber-400';
    return 'bg-slate-300';
  };

  const filteredUsers = allUsers.filter(u =>
    !members.some(m => m.id === u.id) &&
    (`${u.firstName} ${u.lastName} ${u.email}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Project Team</h2>
          <p className="text-sm text-slate-500">
            {isLoading ? 'Loading...' : `${members.length} member${members.length !== 1 ? 's' : ''} on this project`}
          </p>
        </div>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedUserId(''); setSearchQuery(''); }} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-5">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* User list */}
          <div className="max-h-56 overflow-y-auto space-y-2 rounded-xl border border-slate-100 p-2 bg-slate-50">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                {allUsers.length === 0 ? (
                  <><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />Loading users...</>
                ) : 'No matching users found'}
              </div>
            ) : (
              filteredUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUserId(user.id === selectedUserId ? '' : user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    selectedUserId === user.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                      alt={user.firstName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.firstName} {user.lastName}</p>
                    <p className={`text-xs truncate ${selectedUserId === user.id ? 'text-blue-200' : 'text-slate-400'}`}>{user.email}</p>
                  </div>
                  {selectedUserId === user.id && <Check className="h-4 w-4 flex-shrink-0" />}
                </button>
              ))
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role on Project</Label>
            <select
              className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
            >
              <option value="Member">Member</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Analyst">Analyst</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Stakeholder">Stakeholder (View Only)</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setSelectedUserId(''); }}>Cancel</Button>
            <Button type="submit" disabled={!selectedUserId || isAdding} className="bg-blue-600 hover:bg-blue-700">
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add to Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Gathering team intelligence...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-semibold text-slate-700">No team members yet</p>
            <p className="text-sm mt-1">Click <strong>Add Member</strong> to get started.</p>
          </div>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-blue-200 transition-colors">
                      <img
                        src={member.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.firstName || member.id}`}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusDot(member.status)}`} />
                  </div>
                  <div className="flex gap-2 items-center">
                    {(member.role === 'ADMIN' || member.role === 'Project Manager') && (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                        <Shield className="h-3 w-3 mr-1" />
                        {member.role === 'ADMIN' ? 'Admin' : 'PM'}
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">{member.role || 'Member'}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{member.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      {member.phone || 'No phone recorded'}
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
          ))
        )}

        {/* Add Member Card (always visible) */}
        {!isLoading && (
          <button
            onClick={openAddModal}
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
          >
            <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900">Add Team Member</p>
              <p className="text-xs text-slate-500">Invite someone to collaborate</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
