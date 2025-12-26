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
  DollarSign,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Check,
  X,
  Info,
  Building2,
  MapPin,
  Star
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import api from '@/lib/api';

export default function Proposals() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await api.get('/proposals');
      const data = response.data.map((p: any) => ({
        id: p.id,
        title: p.title || p.requirement?.title || 'Untitled Proposal',
        trainer: p.trainer?.name || 'Unknown Trainer',
        trainerData: p.trainer,
        requirementData: p.requirement,
        content: p.content,
        status: (p.status || 'pending').toLowerCase(),
        submittedDate: new Date(p.createdAt).toLocaleDateString(),
        duration: p.duration || 'N/A',
        cost: p.cost || 0,
        rating: p.trainer?.rating || 0,
      }));
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setLoading(true);
      await api.post(`/proposals/${id}/status`, { status });
      toast.success(`Proposal ${status.toLowerCase()} successfully!`);
      setIsSheetOpen(false);
      fetchProposals();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update proposal status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 border-none shadow-sm"><CheckCircle className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="shadow-sm"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 shadow-sm"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const filteredProposals = (status: string) => {
    if (status === 'all') return proposals;
    return proposals.filter(proposal => proposal.status === status);
  };



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <Head>
          <title>TrainerMatch - Proposals</title>
          <meta name="description" content="View and manage training proposals" />
        </Head>

        <Sidebar />

        <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
            <div className="container mx-auto relative z-10">
              <h1 className="text-3xl font-bold mb-2">Training Proposals</h1>
              <p className="text-blue-100">Review and manage incoming proposals from top trainers.</p>
            </div>
          </div>

          <div className="container mx-auto px-6 -mt-16 relative z-20 pb-10">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-lg border border-border w-full sm:w-fit">
              <Button
                variant="ghost"
                onClick={() => setFilter('all')}
                className={`rounded-lg ${filter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                All Proposals
              </Button>
              <Button
                variant="ghost"
                onClick={() => setFilter('pending')}
                className={`rounded-lg ${filter === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Pending
              </Button>
              <Button
                variant="ghost"
                onClick={() => setFilter('accepted')}
                className={`rounded-lg ${filter === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Accepted
              </Button>
              <Button
                variant="ghost"
                onClick={() => setFilter('rejected')}
                className={`rounded-lg ${filter === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Rejected
              </Button>
            </div>

            {/* Proposals List */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {filteredProposals(filter).map((proposal) => (
                    <Card key={proposal.id} className="border-border bg-white shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                      <CardHeader className="bg-white border-b border-border pb-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-900">{proposal.title}</CardTitle>
                              {getStatusBadge(proposal.status)}
                            </div>
                            <CardDescription className="flex flex-wrap items-center gap-4 text-sm mt-1">
                              <span className="flex items-center gap-1.5 text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                <User className="h-3.5 w-3.5 text-blue-500" />
                                {proposal.trainer}
                              </span>
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                Submitted: {proposal.submittedDate}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-slate-900 dark:text-slate-900">${proposal.cost.toLocaleString()}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">{proposal.duration}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="bg-muted/30 pt-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-500">Trainer Rating:</span>
                            <div className="flex items-center bg-white px-2 py-1 rounded-full border border-border shadow-sm">
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-900 mr-1.5">{proposal.rating}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.floor(proposal.rating) ? 'text-amber-400' : 'text-muted'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
                            {proposal.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  className="h-9 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleStatusUpdate(proposal.id, 'REJECTED')}
                                >
                                  <X className="w-4 h-4 mr-1.5" />
                                  Reject
                                </Button>
                                <Button
                                  className="h-9 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 text-white"
                                  onClick={() => handleStatusUpdate(proposal.id, 'ACCEPTED')}
                                >
                                  <Check className="w-4 h-4 mr-1.5" />
                                  Accept Proposal
                                </Button>
                              </>
                            )}
                            {proposal.status === 'accepted' && (
                              <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20">View Session Details</Button>
                            )}
                            <Button
                              variant="ghost"
                              className="h-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setIsSheetOpen(true);
                              }}
                            >
                              View details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProposals(filter).length === 0 && (
                  <div className="text-center py-20 bg-white dark:bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-800 mb-2">No proposals found</h3>
                    <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">
                      {filter === 'all'
                        ? "You don't have any proposals yet from trainers."
                        : `You don't have any ${filter} proposals at the moment.`}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div >

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="border-b pb-4 mb-6">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-blue-600" />
              Proposal Details
            </SheetTitle>
            <SheetDescription>
              Detailed breakdown of the trainer's proposal.
            </SheetDescription>
          </SheetHeader>

          {selectedProposal && (
            <div className="space-y-8">
              {/* Status and Summary */}
              <div className="flex justify-between items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Requirement</h3>
                  <p className="text-lg font-bold text-slate-800">{selectedProposal.title}</p>
                </div>
                {getStatusBadge(selectedProposal.status)}
              </div>

              {/* Proposal Content */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Info size={16} className="text-blue-500" />
                  Trainer's Message
                </h3>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedProposal.content || "No detailed content provided."}
                </div>
              </div>

              {/* Financials & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1">Proposed Cost</p>
                  <p className="text-2xl font-bold text-slate-800">${selectedProposal.cost.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Proposed Duration</p>
                  <p className="text-xl font-bold text-slate-800">{selectedProposal.duration} days</p>
                </div>
              </div>

              {/* Trainer Profile Snippet */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">About the Trainer</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl border-2 border-white shadow-sm">
                    {selectedProposal.trainerData?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">{selectedProposal.trainer}</p>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-bold">{selectedProposal.rating}</span>
                      <span>•</span>
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{selectedProposal.trainerData?.location || 'Remote'}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {selectedProposal.trainerData?.bio || "No biography provided."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProposal.trainerData?.skills?.slice(0, 5).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="bg-white text-slate-600 border-slate-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1">Contact Trainer</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Accept Proposal</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ProtectedRoute >
  );
}