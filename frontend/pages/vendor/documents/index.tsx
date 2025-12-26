import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    FileText, Folder, MoreVertical, Download, Trash2, Eye,
    Search, Upload, ArrowLeft, Filter, Grid, List as ListIcon,
    File
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

export default function DocumentHub() {
    const [currentPath, setCurrentPath] = useState<string[]>([]); // Folder navigation
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock folder structure derived from documents
    // Ideally, folders could be actual entities, but here we group by 'folderName' or 'college.name'
    const [folders, setFolders] = useState<string[]>([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);

            // Extract unique folders (e.g., College Names)
            const uniqueFolders = Array.from(new Set(response.data.map((d: any) => d.folderName || 'Uncategorized')));
            setFolders(uniqueFolders as string[]);
        } catch (error) {
            console.error('Failed to load documents', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            await api.delete(`/documents/${id}`);
            fetchDocuments(); // Refresh
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    // Filter logic
    const filteredItems = () => {
        if (currentPath.length === 0 && searchQuery === '') {
            return { type: 'folders', items: folders };
        }

        let docs = documents;

        // Apply Folder Filter if not searching globally and currentPath is set
        // If searching, we search ALL documents globally, ignoring folders for convenience?
        // Let's stick to folder navigation unless searching.
        if (searchQuery) {
            docs = docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
            return { type: 'files', items: docs };
        }

        if (currentPath.length > 0) {
            const currentFolder = currentPath[0];
            docs = docs.filter(d => (d.folderName || 'Uncategorized') === currentFolder);
            return { type: 'files', items: docs };
        }

        return { type: 'folders', items: folders }; // Should not happen given logic above
    };

    const { type, items } = filteredItems();



    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background text-foreground">
                <Head>
                    <title>Document Hub | Avalytics</title>
                </Head>
                <Sidebar />
                <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen">
                    {/* Header Section with Gradient */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                        <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <nav className="flex items-center text-sm text-blue-100 mb-2">
                                    <span className="cursor-pointer hover:text-white" onClick={() => setCurrentPath([])}>Documents</span>
                                    {currentPath.map((folder, index) => (
                                        <React.Fragment key={folder}>
                                            <span className="mx-2">/</span>
                                            <span className="font-semibold text-white">{folder}</span>
                                        </React.Fragment>
                                    ))}
                                </nav>
                                <h1 className="text-3xl font-bold mb-2">Document Hub</h1>
                                <p className="text-blue-50/80">Centralized hub for all your proposals, invoices, and reports.</p>
                            </div>
                            <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document
                            </Button>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 -mt-16 relative z-20 pb-10">
                        {/* Search and Filter Bar */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10 w-full border-border bg-background focus:ring-blue-500"
                                    placeholder="Search documents by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                    className={viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}
                                >
                                    <ListIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                    className={viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Content Area */}
                        {loading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
                                <div className="bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <File className="h-10 w-10 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">No documents found</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                    {searchQuery ? `No documents match "${searchQuery}"` : "This folder is empty."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {type === 'folders' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {items.map((folder: any, i) => (
                                            <div
                                                key={i}
                                                onClick={() => { setCurrentPath([folder]); setSearchQuery(''); }}
                                                className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                                        <Folder className="h-8 w-8 text-blue-500" />
                                                    </div>
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                                        {documents.filter(d => d.folderName === folder).length} files
                                                    </Badge>
                                                </div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-900 text-lg mb-1">{folder}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-500">College Folder</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
                                        {items.map((doc: any) => (
                                            viewMode === 'grid' ? (
                                                <Card key={doc.id} className="group hover:shadow-md transition-all border-border bg-white">
                                                    <CardContent className="p-5">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                                                                <FileText className="h-6 w-6 text-orange-500" />
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-white border-border">
                                                                    <DropdownMenuItem className="hover:bg-muted cursor-pointer">
                                                                        <Eye className="h-4 w-4 mr-2" /> View
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="hover:bg-muted cursor-pointer">
                                                                        <Download className="h-4 w-4 mr-2" /> Download
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>
                                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        <h3 className="font-bold text-slate-900 dark:text-slate-900 mb-1 truncate" title={doc.title}>{doc.title}</h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-500 mb-3 uppercase tracking-wider font-semibold">{doc.type}</p>
                                                        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 border-t border-slate-100 dark:border-slate-100 pt-3">
                                                            <span>{(doc.size / 1024).toFixed(1)} KB</span>
                                                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ) : (
                                                <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-border hover:shadow-sm transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                                                            <FileText className="h-5 w-5 text-orange-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 dark:text-slate-900 text-sm">{doc.title}</h3>
                                                            <p className="text-xs text-slate-500 dark:text-slate-500">{doc.type} • {(doc.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground mr-4 hidden md:inline-block">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleDelete(doc.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Back Button when in Folder View */}
                        {currentPath.length > 0 && !searchQuery && (
                            <div className="mt-8">
                                <Button variant="outline" onClick={() => setCurrentPath([])}>
                                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Folders
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
