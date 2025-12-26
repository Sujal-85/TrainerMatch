import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import api from '@/lib/api';
import {
    User, Mail, MapPin, Star, CheckCircle, AlertCircle,
    Send, ChevronRight, BarChart2, Shield, DollarSign, Building2, ArrowLeft, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export default function RequirementMatches() {
    const router = useRouter();
    const { id } = router.query;
    const [requirement, setRequirement] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifying, setNotifying] = useState(false);

    const handleAcceptCandidate = async (matchId: string, trainerName: string) => {
        try {
            setLoading(true);
            await api.post(`/matches/${matchId}/status`, { status: 'ACCEPTED' });
            toast.success(`Successfully accepted ${trainerName} for this requirement!`);
            // Refresh data
            fetchData();
        } catch (error) {
            console.error('Error accepting candidate:', error);
            toast.error('Failed to accept candidate');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            console.log("Fetching data for requirement ID:", id);
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqRes, matchesRes] = await Promise.all([
                api.get(`/requirements/${id}`),
                api.get(`/matches/${id}`)
            ]);
            console.log("Requirement Data:", reqRes.data);
            console.log("Matches Data:", matchesRes.data);

            setRequirement(reqRes.data);
            setMatches(matchesRes.data.matches || []);
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load requirement details. Please check if the ID is valid.");
        } finally {
            setLoading(false);
        }
    };

    const handleAutoNotify = async () => {
        setNotifying(true);
        try {
            await api.post(`/matches/${id}/auto-notify`);
            toast.success('Top matches notified successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send notifications.');
        } finally {
            setNotifying(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <main className="flex-1 md:ml-64 pt-0 transition-all duration-300 min-h-screen bg-slate-50/50">
                    <Head>
                        <title>{requirement?.title ? `${requirement.title} | AI Matching` : 'AI Matching Engine'} | Avalytics</title>
                    </Head>

                    {/* Premium Header */}
                    <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white pb-32 pt-12 px-6 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px]"></div>

                        <div className="container mx-auto relative z-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge className="bg-white/20 text-blue-50 border-white/20 hover:bg-white/30 px-3 py-1 backdrop-blur-md">
                                            <SparklesIcon className="w-3 h-3 mr-1.5" />
                                            AI Matching Active
                                        </Badge>
                                        <Badge variant="outline" className="border-blue-300/30 text-blue-100 bg-blue-400/10">
                                            Req ID: {id}
                                        </Badge>
                                    </div>
                                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                                        {requirement?.title || "AI Matching Engine"}
                                    </h1>
                                    <p className="text-blue-100/80 text-lg line-clamp-2">
                                        {requirement?.description || "Analyzing skills, location, budget, and domain expertise to find your perfect trainers."}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleAutoNotify}
                                        disabled={notifying || matches.length === 0}
                                        className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl h-11 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105"
                                    >
                                        {notifying ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                                                Notifying...
                                            </>
                                        ) : (
                                            <>
                                                Auto-Notify Matches
                                                <Send className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/vendor/requirements">
                                        <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/20 h-11 px-4 rounded-xl">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">

                        {/* Requirement Overview Card */}
                        {!loading && requirement && (
                            <Card className="border-none shadow-xl shadow-blue-900/5 mb-8 overflow-hidden bg-white text-slate-900">
                                <CardHeader className="border-b border-slate-50 pb-4">
                                    <CardTitle className="text-lg font-bold text-slate-800">Requirement Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                                                <p className="text-slate-600 leading-relaxed text-sm">
                                                    {requirement.description || 'No description available.'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills Needed</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {requirement.tags && requirement.tags.length > 0 ? requirement.tags.map((tag: string) => (
                                                        <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100">
                                                            {tag}
                                                        </Badge>
                                                    )) : (
                                                        <span className="text-sm text-slate-400 italic">No specific skills listed</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                                    <DollarSign size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Budget</p>
                                                    <p className="font-bold text-slate-800">
                                                        {requirement.budgetMin ? `$${requirement.budgetMin}` : 'N/A'} - {requirement.budgetMax ? `$${requirement.budgetMax}` : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <MapPin size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Location</p>
                                                    <p className="font-bold text-slate-800">{requirement.location || 'Remote'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                                    <Building2 size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">College</p>
                                                    <p className="font-bold text-slate-800">{requirement.college?.name || 'Affiliated College'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Sparkles size={20} className="text-blue-600" />
                                Top AI Matches
                            </h2>
                            {!loading && (
                                <Badge variant="secondary" className="bg-white shadow-sm border-slate-100 text-slate-600 font-bold px-3 py-1">
                                    {matches.length} Candidates
                                </Badge>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center bg-white rounded-2xl shadow-sm">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                    <p className="text-slate-500 font-medium animate-pulse">Running AI Matching Engine...</p>
                                </div>
                            ) : matches.length > 0 ? (
                                matches.map((match, index) => (
                                    <Card key={match.trainer.id} className={`border-none shadow-lg ${index === 0 ? 'shadow-blue-500/20 ring-2 ring-blue-500 scale-105 z-10' : 'shadow-slate-200/50'} hover:shadow-xl transition-all duration-300 bg-white`}>
                                        <CardHeader className={index === 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-xl' : ''}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                                        {match.trainer.profilePicture ? (
                                                            <img src={match.trainer.profilePicture} alt={match.trainer.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User size={24} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg font-bold text-slate-800">{match.trainer.name}</CardTitle>
                                                        <CardDescription className="flex items-center gap-1 text-slate-500">
                                                            <MapPin size={12} /> {match.trainer.location || 'Remote'}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                {index === 0 && (
                                                    <Badge className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 border-none">Top Match</Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2 font-medium">
                                                    <span className="text-slate-600">Match Score</span>
                                                    <span className="text-blue-600 font-bold">{Math.round(match.score * 100)}%</span>
                                                </div>
                                                <Progress value={match.score * 100} className="h-2 bg-slate-100" />
                                            </div>

                                            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed min-h-[80px]">
                                                {match.explanation}
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                {match.trainer.skills?.slice(0, 3).map((skill: string) => (
                                                    <Badge key={skill} variant="secondary" className="text-xs font-medium bg-white text-slate-600 border border-slate-200 shadow-sm">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="pt-4 flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 text-xs h-9 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-semibold"
                                                    onClick={() => router.push(`/vendor/trainers/${match.trainer.id}`)}
                                                >
                                                    View Profile
                                                </Button>
                                                <Button
                                                    className="flex-1 text-xs h-9 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all font-semibold"
                                                    onClick={() => handleAcceptCandidate(match.id, match.trainer.name)}
                                                    disabled={match.status === 'ACCEPTED'}
                                                >
                                                    {match.status === 'ACCEPTED' ? 'Accepted' : 'Accept Candidate'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="text-slate-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">No Matches Found</h3>
                                    <p className="text-slate-500 mt-2">We couldn't find any trainers matching this requirement yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}
