"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  File, 
  Image as ImageIcon, 
  FileCode, 
  FileArchive,
  Plus, 
  Search, 
  Download, 
  Share2, 
  MoreVertical,
  Grid,
  List as ListIcon,
  Clock,
  HardDrive,
  Loader2,
  Users,
  Star
} from 'lucide-react';
import { api } from '@/lib/api';

const documents = [
  { id: '1', name: 'Site_Plan_Revision_B.pdf', type: 'PDF', size: '12.4 MB', project: 'Skyline Tower', modified: '2h ago', owner: 'Sarah J.', category: 'Architecture' },
  { id: '2', name: 'Contract_Agreements_v2.docx', type: 'DOCX', size: '2.1 MB', project: 'Global Finance', modified: '5h ago', owner: 'David C.', category: 'Legal' },
  { id: '3', name: 'Structural_Analysis.xlsx', type: 'XLSX', size: '4.5 MB', project: 'Bridge Rehab', modified: '1d ago', owner: 'Emma W.', category: 'Engineering' },
  { id: '4', name: 'Project_Timeline_Q3.pptx', type: 'PPTX', size: '8.7 MB', project: 'Skyline Tower', modified: '2d ago', owner: 'Sarah J.', category: 'Planning' },
  { id: '5', name: 'Initial_UI_Mockups.fig', type: 'FIG', size: '45.2 MB', project: 'Smart Grid', modified: '3d ago', owner: 'Felix A.', category: 'Design' },
  { id: '6', name: 'Database_Schema.sql', type: 'SQL', size: '156 KB', project: 'Global Finance', modified: '4d ago', owner: 'David C.', category: 'Development' },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await api.documents.list();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const getFileIcon = (type: string) => {
    const typeUpper = type?.toUpperCase();
    switch (typeUpper) {
      case 'PDF': return <FileText className="h-8 w-8 text-red-500" />;
      case 'DOCX': return <File className="h-8 w-8 text-blue-500" />;
      case 'XLSX': return <FileCode className="h-8 w-8 text-green-500" />;
      case 'SQL': return <FileCode className="h-8 w-8 text-purple-500" />;
      case 'FIG': return <ImageIcon className="h-8 w-8 text-pink-500" />;
      default: return <FileArchive className="h-8 w-8 text-slate-400" />;
    }
  };

  const formatFileSize = (size: number) => {
    if (!size) return '0 KB';
    if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Document Center</h1>
          <p className="text-slate-500 mt-1">Access, manage, and share project assets and records.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-200">
            <Share2 className="h-4 w-4 mr-2" />
            Share Library
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border-none shadow-sm h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { name: 'All Files', count: documents.length, icon: HardDrive, active: true },
              { name: 'Recent', count: documents.filter(d => new Date(d.createdAt).getTime() > Date.now() - 86400000).length, icon: Clock, active: false },
              { name: 'Shared with me', count: 45, icon: Users, active: false },
              { name: 'Starred', count: 8, icon: Star, active: false },
            ].map(item => (
              <button key={item.name} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}>
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">{item.count}</span>
              </button>
            ))}
            
            <div className="pt-6 pb-2">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Categories</p>
              {['Engineering', 'Architecture', 'Legal', 'Financial', 'Marketing'].map(cat => (
                <button key={cat} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  {cat}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  placeholder="Search in library..." 
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="border-slate-200 rounded-xl bg-slate-50">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-slate-200 rounded-xl">
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Retrieving documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <FileArchive className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No documents found in the center.</p>
              </div>
            ) : (
              documents.map((doc) => (
                <Card key={doc.id} className="group border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors" title={doc.name}>
                        {doc.name}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {formatFileSize(doc.fileSize)} • {doc.fileType || 'File'}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {(doc.uploadedByName || doc.owner)?.split(' ').map((n: string) => n[0]).join('') || '?'}
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

