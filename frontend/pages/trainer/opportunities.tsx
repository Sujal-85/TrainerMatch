import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, DollarSign, Calendar, ArrowRight, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";

export default function TrainerOpportunities() {
    const [generating, setGenerating] = useState(false);
    const [selectedOpp, setSelectedOpp] = useState<any>(null);
    const [proposalText, setProposalText] = useState('');
    const [trainerProfile, setTrainerProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [cost, setCost] = useState('');
    const [duration, setDuration] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [selectedOppDetails, setSelectedOppDetails] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [oppsRes, profileRes] = await Promise.all([
                    api.get('/requirements'),
                    api.get('/trainers/profile')
                ]);
                setOpportunities(oppsRes.data);
                setTrainerProfile(profileRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmitProposal = async () => {
        if (!selectedOpp || !trainerProfile) return;
        if (!cost || !duration) {
            toast.error("Please provide cost and duration.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/proposals', {
                requirementId: selectedOpp.id,
                trainerId: trainerProfile.id,
                content: proposalText,
                cost: parseFloat(cost),
                duration: parseInt(duration),
                status: 'SUBMITTED'
            });
            toast.success("Proposal submitted successfully!");
            setCost('');
            setDuration('');
        } catch (error) {
            console.error("Submission failed", error);
            toast.error("Failed to submit proposal.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleGenerateProposal = async (opp: any) => {
        if (!trainerProfile) {
            alert("Please complete your profile first.");
            return;
        }
        setSelectedOpp(opp);
        setGenerating(true);
        setProposalText("Generating AI proposal...");

        try {
            // Context for AI
            const requirementContext = `Title: ${opp.title}, Skills: ${opp.skills?.join(', ')}, Description: ${opp.description}`;
            const trainerContext = `Name: ${trainerProfile.user.name}, Skills: ${trainerProfile.skills?.join(', ')}, Bio: ${trainerProfile.bio}`;

            const res = await api.post('/ai/generate-proposal', {
                requirement: requirementContext,
                trainerProfile: trainerContext
            });
            setProposalText(res.data);
        } catch (error) {
            console.error("AI Generation failed", error);
            setProposalText("Failed to generate proposal. Please try again.");
        } finally {
            setGenerating(false);
        }
    };



    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white pb-24 pt-10 px-6 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    <div className="container mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
                                <p className="text-indigo-100">Find your next training gig matched to your skills</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
                    {loading ? (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="relative mb-8">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    placeholder="Search by skill, company, or location..."
                                    className="pl-10 h-12 bg-white shadow-lg border border-border"
                                />
                            </div>

                            <div className="space-y-4">
                                {opportunities.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center animate-pulse">
                                                <Search className="w-8 h-8 text-violet-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">No Opportunities Found</h3>
                                        <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                                            We couldn't find any open opportunities matching your criteria right now. Try adjusting your filters or check back later!
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
                                            onClick={() => window.location.reload()}
                                        >
                                            Refresh List
                                        </Button>
                                    </div>
                                ) : (
                                    opportunities.map((opp) => (
                                        <Card key={opp.id} className="hover:shadow-lg transition-all duration-300 bg-white border border-border group cursor-pointer overflow-hidden">
                                            <CardContent className="p-6 relative z-10">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                                    New
                                                                </Badge>
                                                                <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                                                                    {opp.title}
                                                                </h3>
                                                                <p className="text-muted-foreground font-medium truncate">{opp.vendor?.name || opp.college?.name || 'Unknown Organization'}</p>
                                                            </div>
                                                            <div className="text-right hidden md:block">
                                                                <div className="text-lg font-bold text-foreground">
                                                                    {opp.budgetMin && opp.budgetMax ? `$${opp.budgetMin} - $${opp.budgetMax}` : 'Budget Negotiable'}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">Estimated value</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-4 my-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-4 h-4 text-muted-foreground/60" />
                                                                {opp.location || 'Remote'}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 md:hidden">
                                                                <DollarSign className="w-4 h-4 text-slate-400" />
                                                                {opp.budgetMin ? `$${opp.budgetMin}` : 'Negotiable'}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mt-4">
                                                            {opp.tags && opp.tags.map((tag: string) => (
                                                                <Badge key={tag} variant="outline" className="border-border text-muted-foreground">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2 justify-end">
                                                        <Sheet>
                                                            <SheetTrigger asChild>
                                                                <Button
                                                                    className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 gap-2"
                                                                    onClick={() => handleGenerateProposal(opp)}
                                                                >
                                                                    <Zap className="w-4 h-4" />
                                                                    AI Proposal
                                                                </Button>
                                                            </SheetTrigger>
                                                            <SheetContent className="w-[400px] sm:w-[540px]">
                                                                <SheetHeader>
                                                                    <SheetTitle>AI Generated Proposal</SheetTitle>
                                                                    <SheetDescription>
                                                                        Review and edit the proposal generated based on your profile.
                                                                    </SheetDescription>
                                                                </SheetHeader>
                                                                <div className="mt-6 flex-1 h-[80%] flex flex-col">
                                                                    {generating ? (
                                                                        <div className="flex items-center justify-center h-40">
                                                                            <Spinner />
                                                                            <span className="ml-2 text-slate-500">Generating magic...</span>
                                                                        </div>
                                                                    ) : (
                                                                        <textarea
                                                                            className="flex-1 w-full p-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-foreground leading-relaxed"
                                                                            value={proposalText}
                                                                            onChange={(e) => setProposalText(e.target.value)}
                                                                        />
                                                                    )}
                                                                    <div className="grid grid-cols-2 gap-4 my-4">
                                                                        <div>
                                                                            <label className="text-xs font-bold text-muted-foreground uppercase">Cost ($)</label>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="e.g. 500"
                                                                                value={cost}
                                                                                onChange={(e) => setCost(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-xs font-bold text-muted-foreground uppercase">Duration (days)</label>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="e.g. 5"
                                                                                value={duration}
                                                                                onChange={(e) => setDuration(e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        className="mt-4 w-full bg-violet-600 hover:bg-violet-700"
                                                                        onClick={handleSubmitProposal}
                                                                        disabled={submitting || generating}
                                                                    >
                                                                        {submitting ? "Submitting..." : "Submit Proposal"}
                                                                    </Button>
                                                                </div>
                                                            </SheetContent>
                                                        </Sheet>

                                                        <Button
                                                            variant="outline"
                                                            className="w-full md:w-auto gap-2"
                                                            onClick={() => {
                                                                setSelectedOppDetails(opp);
                                                                setIsDetailsOpen(true);
                                                            }}
                                                        >
                                                            View Details
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </main>

                <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                        <SheetHeader className="border-b pb-4 mb-6">
                            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                                <Search className="text-violet-600" />
                                Opportunity Details
                            </SheetTitle>
                            <SheetDescription>
                                Full description and requirements for this training session.
                            </SheetDescription>
                        </SheetHeader>

                        {selectedOppDetails && (
                            <div className="space-y-8">
                                <div>
                                    <Badge className="mb-2 bg-violet-100 text-violet-700 hover:bg-violet-200 border-none px-3 py-1">
                                        Open Opportunity
                                    </Badge>
                                    <h3 className="text-2xl font-bold text-foreground">{selectedOppDetails.title}</h3>
                                    <p className="text-muted-foreground font-medium mt-1">
                                        {selectedOppDetails.vendor?.name || selectedOppDetails.college?.name || 'Organization'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <DollarSign size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Budget</span>
                                        </div>
                                        <p className="text-lg font-bold text-foreground">
                                            {selectedOppDetails.budgetMin && selectedOppDetails.budgetMax
                                                ? `$${selectedOppDetails.budgetMin} - $${selectedOppDetails.budgetMax}`
                                                : 'Negotiable'}
                                        </p>
                                    </div>
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <MapPin size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                                        </div>
                                        <p className="text-lg font-bold text-foreground">{selectedOppDetails.location || 'Remote'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Description</h4>
                                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                        {selectedOppDetails.description || 'No detailed description provided.'}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedOppDetails.tags?.map((tag: string) => (
                                            <Badge key={tag} variant="secondary" className="bg-violet-50 text-violet-700 border-violet-100">
                                                {tag}
                                            </Badge>
                                        )) || <span className="text-slate-400 italic">No specific skills listed</span>}
                                    </div>
                                </div>

                                <div className="pt-6 border-t">
                                    <Button
                                        className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-lg font-bold shadow-lg shadow-violet-500/20"
                                        onClick={() => {
                                            setIsDetailsOpen(false);
                                            handleGenerateProposal(selectedOppDetails);
                                        }}
                                    >
                                        <Zap className="w-5 h-5 mr-2" />
                                        Generate AI Proposal
                                    </Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
