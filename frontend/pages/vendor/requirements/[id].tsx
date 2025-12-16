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
                    <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white pb-24 pt-10 px-6 shadow-xl">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                        <div className="container mx-auto relative z-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                        <SparklesIcon className="text-violet-100" />
                                        AI Trainer Matching Engine
                                    </h1>
                                    <p className="text-violet-100 max-w-2xl">
                                        Our AI analyzes skills, location, budget, and domain expertise to find the perfect trainers for your requirements.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleAutoNotify}
                                    disabled={notifying}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center gap-2"
                                >
                                    {notifying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Escalating...
                                        </>
                                    ) : (
                                        <>
                                            Auto-Notify Top Matches
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
                                                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border-2 border-white shadow-sm">
                                                    <User size={24} />
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
                                            <Button variant="outline" className="flex-1 text-xs h-9 border-slate-200 text-slate-700 hover:bg-slate-50">View Profile</Button>
                                            <Button className="flex-1 text-xs h-9 bg-slate-900 text-white hover:bg-slate-800 shadow-md">Contact</Button>
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
