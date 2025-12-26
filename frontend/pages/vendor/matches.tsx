import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Users, ChevronRight, Search, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import api from '@/lib/api';

export default function Matches() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/requirements');
      const data = response.data.map((req: any) => ({
        id: req.id,
        title: req.title,
        description: req.description,
        matchCount: req.matches ? req.matches.length : 0,
        posted: new Date(req.createdAt).toLocaleDateString()
      }));
      setRequirements(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Head>
          <title>TrainerMatch - Matches</title>
          <meta name="description" content="Trainer matches" />
        </Head>

        <Sidebar />

        <main className="md:ml-64 pt-0 transition-all duration-300 min-h-screen bg-transparent">
          {/* Premium Header - Reverted to Blue Theme */}
          <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white pb-32 pt-12 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px]"></div>

            <div className="container mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-white/20 text-blue-100 border-white/20 hover:bg-white/30 px-3 py-1 backdrop-blur-md">
                      <Zap className="w-3 h-3 mr-1.5 fill-blue-300 text-blue-300" />
                      Live Matching
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                    Trainer Matches
                  </h1>
                  <p className="text-slate-200/80 text-lg max-w-2xl font-medium">
                    Select a requirement to discover the most qualified trainers handpicked by our AI.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Card className="border border-border shadow-lg shadow-blue-900/5 overflow-hidden bg-white">
                <CardHeader className="bg-white border-b border-border pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Available Requirements</CardTitle>
                      <CardDescription className="text-slate-500 dark:text-zinc-400">
                        Top {requirements.length} active requirements
                      </CardDescription>
                    </div>
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <input
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-white/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-slate-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 bg-white">
                  <div className="divide-y divide-border">
                    {requirements.map((req) => (
                      <Link href={`/vendor/match/${req.id}`} key={req.id} className="block group">
                        <div className="p-5 flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Users className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{req.title}</h3>
                              <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-1">{req.description || "No description provided."}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                              <div className="flex items-center justify-end gap-1.5 font-semibold text-slate-700 dark:text-zinc-300">
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                {req.matchCount} Matches
                              </div>
                              <div className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                                Posted {req.posted}
                              </div>
                            </div>
                            <Button size="icon" variant="ghost" className="text-slate-400 dark:text-zinc-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {requirements.length === 0 && (
                      <div className="text-center py-12">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">No requirements found.</p>
                        <p className="text-slate-400 text-sm mt-1">Create a requirement to start matching.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}