import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import api from '@/lib/api';
import {
    User, Mail, MapPin, Star, CheckCircle, AlertCircle,
    Send, ChevronRight, BarChart2, Shield
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
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifying, setNotifying] = useState(false);

    useEffect(() => {
        if (id) {
            fetchMatches();
        }
    }, [id]);

    const fetchMatches = async () => {
        try {
            const res = await api.get(`/matches/${id}`);
            setMatches(res.data.matches);
        } catch (error) {
            console.error("Failed to load matches", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoNotify = async () => {
        setNotifying(true);
        try {
            await api.post(`/matches/${id}/auto-notify`);
            alert('Top matches notified successfully via WhatsApp, Email & SMS!');
        } catch (error) {
            console.error(error);
            alert('Failed to send notifications.');
        } finally {
            setNotifying(false);
        }
    };



    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
                <Sidebar />
                <main className="md:ml-64 pt-0 transition-all duration-300 min-h-screen bg-slate-50/50">
                    <Head>
                        <title>AI Matching Engine | Avalytics</title>
                    </Head>

                    {/* Premium Header */}
                    <div className="relative bg-[#020617] text-white pb-32 pt-12 px-6 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-500/20 opacity-50"></div>
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]"></div>

                        <div className="container mx-auto relative z-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 px-3 py-1">
                                            <SparklesIcon className="w-3 h-3 mr-1.5" />
                                            AI Matching Active
                                        </Badge>
                                    </div>
                                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                                        AI Matching Engine
                                    </h1>
                                    <p className="text-slate-400 text-lg max-w-2xl">
                                        Analyzing skills, location, budget, and domain expertise to find your perfect trainers.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleAutoNotify}
                                    disabled={notifying}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 h-11 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105"
                                >
                                    {notifying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Notifying...
                                        </>
                                    ) : (
                                        <>
                                            Auto-Notify Matches
                                            <Send className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full flex min-h-[400px] items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                                </div>
                            ) : matches.length > 0 ? matches.map((match, index) => (
                                <Card key={match.trainer.id} className={`border-none shadow-lg ${index === 0 ? 'shadow-violet-500/20 ring-2 ring-violet-500 scale-105 z-10' : 'shadow-slate-200/50'} hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900`}>
                                    <CardHeader className={index === 0 ? 'bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-t-xl' : ''}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                                    {match.trainer.profilePicture ? (
                                                        <img src={match.trainer.profilePicture} alt={match.trainer.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">{match.trainer.name}</CardTitle>
                                                    <CardDescription className="flex items-center gap-1 text-slate-500">
                                                        <MapPin size={12} /> {match.trainer.location || 'Remote'}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            {index === 0 && (
                                                <Badge className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/30 border-none">Top Match</Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2 font-medium">
                                                <span className="text-slate-600 dark:text-gray-300">Match Score</span>
                                                <span className="text-violet-600 font-bold">{Math.round(match.score * 100)}%</span>
                                            </div>
                                            <Progress value={match.score * 100} className="h-2 bg-slate-100 dark:bg-zinc-800" />
                                        </div>

                                        <div className="text-xs text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 leading-relaxed">
                                            {match.explanation}
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            {match.trainer.skills?.slice(0, 3).map((skill: string) => (
                                                <Badge key={skill} variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
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
                                                className="flex-1 text-xs h-9 bg-slate-900 text-white hover:bg-blue-600 shadow-md transition-all font-semibold"
                                                onClick={() => {
                                                    toast.success(`Contact request sent to ${match.trainer.name}!`);
                                                }}
                                            >
                                                Contact
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="text-slate-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">No Matches Found</h3>
                                    <p className="text-slate-500 mt-2">We couldn't find any trainers matching this requirement yet.</p>
                                </div>
                            )}
                        </div>
                    </div> {/* Close container */}
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
