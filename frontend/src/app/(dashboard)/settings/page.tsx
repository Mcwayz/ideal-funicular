"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User, Bell, Shield, Palette, Globe, Key, Trash2,
  Camera, Check, Moon, Sun, Monitor, Save, LogOut,
  Mail, Phone, Building2, MapPin, Loader2
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('system');
  const [profile, setProfile] = useState({
    firstName: 'Alex', lastName: 'Morgan',
    email: 'alex.morgan@acmecorp.com',
    phone: '+1 (555) 234-5678',
    organization: 'AcmeCorp', location: 'New York, USA',
    bio: 'Senior Project Manager with 8+ years of experience in enterprise delivery.',
    role: 'ADMIN',
  });
  const [notifications, setNotifications] = useState({
    taskAssigned: true, projectUpdates: true, riskAlerts: true,
    documentUploads: false, weeklyDigest: true, emailAlerts: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="lg:w-56 flex-shrink-0">
          <Card className="border-none shadow-sm">
            <CardContent className="p-3 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
              <div className="pt-3 border-t border-slate-100 mt-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-slate-100">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`} alt="Avatar" className="h-full w-full object-cover" />
                      </div>
                      <button className="absolute -bottom-1 -right-1 h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors">
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{profile.firstName} {profile.lastName}</p>
                      <Badge variant="secondary" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">{profile.role}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-9" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-9" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-9" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Organization</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-9" value={profile.organization} onChange={e => setProfile({...profile, organization: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-9" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <textarea
                      rows={3}
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                      value={profile.bio}
                      onChange={e => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50/50">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Delete Account</p>
                      <p className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all data.</p>
                    </div>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what alerts you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { key: 'taskAssigned', label: 'Task Assigned', desc: 'Notify when a task is assigned to you' },
                  { key: 'projectUpdates', label: 'Project Updates', desc: 'Notify on project status changes' },
                  { key: 'riskAlerts', label: 'Risk Alerts', desc: 'Notify when a new risk is flagged' },
                  { key: 'documentUploads', label: 'Document Uploads', desc: 'Notify when files are added' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary email' },
                  { key: 'emailAlerts', label: 'Email Notifications', desc: 'All notifications sent via email' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({...prev, [item.key]: !prev[item.key as keyof typeof prev]}))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all ${
                        notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Use a strong password of at least 12 characters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                    <div key={label} className="space-y-2">
                      <Label>{label}</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-9" type="password" placeholder="••••••••••••" />
                      </div>
                    </div>
                  ))}
                  <Button className="bg-blue-600 hover:bg-blue-700 mt-2">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-200 rounded-xl flex items-center justify-center">
                        <Shield className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Authenticator App</p>
                        <p className="text-xs text-slate-400">Not configured</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-slate-200">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Devices currently signed in to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { device: 'Windows · Chrome', location: 'New York, US', time: 'Active now', current: true },
                    { device: 'macOS · Safari', location: 'Chicago, US', time: '2 days ago', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{session.device}</p>
                        <p className="text-xs text-slate-400">{session.location} · {session.time}</p>
                      </div>
                      {session.current
                        ? <Badge className="bg-green-100 text-green-700 border-green-200">Current</Badge>
                        : <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">Revoke</Button>
                      }
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the platform looks for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'system', label: 'System', icon: Monitor },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          theme === t.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <t.icon className={`h-6 w-6 ${theme === t.id ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className={`text-xs font-semibold ${theme === t.id ? 'text-blue-700' : 'text-slate-600'}`}>{t.label}</span>
                        {theme === t.id && <Check className="h-3 w-3 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">Accent Color</Label>
                  <div className="flex gap-3">
                    {['#2563EB','#7C3AED','#059669','#DC2626','#D97706','#0891B2'].map(color => (
                      <button
                        key={color}
                        className="h-8 w-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select className="w-full pl-9 p-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none">
                      <option>English (US)</option>
                      <option>French</option>
                      <option>Spanish</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className={`min-w-[140px] transition-all ${saved ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
              ) : saved ? (
                <><Check className="h-4 w-4 mr-2" /> Saved!</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
