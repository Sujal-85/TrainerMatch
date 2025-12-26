import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  FileText,
  Calendar,
  MapPin,
  Tag,
  Plus,
  Search,
  Filter,
  Sparkles,
  MoreVertical
} from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import api from '@/lib/api';

export default function Requirements() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await api.get('/requirements');
      const data = response.data.map((req: any) => ({
        id: req.id,
        title: req.title,
        description: req.description,
        status: req.status || 'new',
        tags: req.tags || [],
        budget: req.budget,
        location: req.location || 'Remote',
        datePosted: new Date(req.createdAt).toLocaleDateString(),
        matches: req.matches ? req.matches.length : 0,
      }));
      setRequirements(data);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800/50">Matched</Badge>;
      case 'proposals':
        return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">Proposals Received</Badge>;
      case 'scheduled':
        return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">Scheduled</Badge>;
      default:
        return <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 dark:border-blue-800/50 dark:text-blue-400 dark:bg-blue-900/20">New</Badge>;
    }
  };



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <Head>
          <title>TrainerMatch - Requirements</title>
          <meta name="description" content="Manage your training requirements" />
        </Head>

        <Sidebar />

        <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen bg-transparent">
          {/* Header Section with Gradient Background */}
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
            <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Training Requirements</h1>
                <p className="text-blue-100">Manage and track your training needs efficiently.</p>
              </div>
              <Link href="/vendor/requirements/new">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Requirement
                </Button>
              </Link>
            </div>
          </div>

          <div className="container mx-auto px-6 -mt-16 relative z-20 pb-10">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Search and Filters Card */}
                <div className="bg-white rounded-xl shadow-lg border border-border p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      placeholder="Search requirements..."
                      className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-zinc-800 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-slate-900 dark:text-zinc-100"
                    />
                  </div>
                  <Button variant="outline" className="text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-zinc-800 w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Requirements List */}
                <div className="grid grid-cols-1 gap-6">
                  {requirements.map((requirement) => (
                    <Card key={requirement.id} className="border border-border shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white">
                      <CardHeader className="bg-white border-b border-border pb-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <CardTitle className="text-lg text-slate-800 dark:text-zinc-100 font-bold group-hover:text-blue-600 transition-colors">{requirement.title}</CardTitle>
                              {getStatusBadge(requirement.status)}
                            </div>
                            <CardDescription className="mb-4 text-sm text-slate-500 dark:text-zinc-400 line-clamp-2">
                              {requirement.description}
                            </CardDescription>
                            <div className="flex flex-wrap gap-2">
                              {requirement.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">
                                  <Tag className="h-2.5 w-2.5" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-start gap-6 min-w-[150px] justify-end">
                            <div className="text-right">
                              <div className="flex items-center justify-end gap-1 text-slate-800 dark:text-zinc-100 font-bold mb-1">
                                {requirement.budget}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-end gap-1">
                                <MapPin className="h-3 w-3" />
                                {requirement.location}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                                Posted {requirement.datePosted}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="bg-muted/50 pt-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                            {requirement.matches > 0 ? (
                              <span className="flex items-center text-blue-600 dark:text-blue-400 font-medium px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {requirement.matches} potential matches
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-zinc-600">Searching for trainers...</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <Link href={`/vendor/requirements/${requirement.id}`}>
                              <Button variant="ghost" className="text-xs md:text-sm h-9 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 flex-1 sm:flex-none">
                                View Details
                              </Button>
                            </Link>
                            {requirement.status === 'matched' && (
                              <Link href={`/vendor/requirements/${requirement.id}`}>
                                <Button className="text-xs md:text-sm h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 flex-1 sm:flex-none">Review Matches</Button>
                              </Link>
                            )}
                            {requirement.status === 'proposals' && (
                              <Button className="text-xs md:text-sm h-9 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 flex-1 sm:flex-none">Review Proposals</Button>
                            )}
                            {requirement.status === 'new' && (
                              <Button variant="outline" className="text-xs md:text-sm h-9 border-blue-200 text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none">Edit</Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {requirements.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No requirements found</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                      Get started by creating your first training requirement to find the perfect trainer.
                    </p>
                    <Link href="/vendor/requirements/new">
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 rounded-full px-8">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Requirement
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}