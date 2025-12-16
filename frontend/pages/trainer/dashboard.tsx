import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/sidebar';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';
import {
    TrendingUp,
    Target,
    BookOpen,
    Calendar,
    MessageCircle,
    Briefcase,
    Star,
    Award,
    ArrowRight,
    Users
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function TrainerDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { name: 'Profile Views', value: '1,240', icon: Users, change: '', color: 'from-violet-500 to-purple-500' },
        { name: 'Job Matches', value: '0', icon: Target, change: '', color: 'from-pink-500 to-rose-500' },
        { name: 'Active Proposals', value: '0', icon: Briefcase, change: '', color: 'from-amber-500 to-orange-500' },
        { name: 'Rating', value: '5.0', icon: Star, change: '', color: 'from-yellow-400 to-amber-500' },
    ]);
    const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, statsRes, sessionsRes, reqRes] = await Promise.all([
                    api.get('/trainers/profile'),
                    api.get('/trainers/stats'),
                    api.get('/sessions'),
                    api.get('/requirements')
                ]);

                setProfile(profileRes.data);

                setStats([
                    { name: 'Profile Views', value: statsRes.data.views.toString(), icon: Users, change: '', color: 'from-violet-500 to-purple-500' },
                    { name: 'Job Matches', value: statsRes.data.matches.toString(), icon: Target, change: '', color: 'from-pink-500 to-rose-500' },
                    { name: 'Active Proposals', value: statsRes.data.proposals.toString(), icon: Briefcase, change: '', color: 'from-amber-500 to-orange-500' },
                    { name: 'Rating', value: statsRes.data.rating.toFixed(1), icon: Star, change: '', color: 'from-yellow-400 to-amber-500' },
                ]);

                // Filter sessions logic
                const upcoming = sessionsRes.data
                    .filter((s: any) => new Date(s.startTime) > new Date())
                    .slice(0, 3); // Take top 3
                setUpcomingSessions(upcoming);

                // Recommended jobs (just take first 3 for now)
                setRecommendedJobs(reqRes.data.slice(0, 3));

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Head>
                    <title>TrainerMatch - Trainer Dashboard</title>
                </Head>

                <Sidebar />

                <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen bg-slate-50/50">
                    {/* Header Section */}
                    <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white pb-24 pt-10 px-6 shadow-xl">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                        <div className="container mx-auto relative z-10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Trainer Dashboard</h1>
                                    <p className="text-indigo-100">Track your applications and upcoming sessions.</p>
                                </div>
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-3">
                                        <Link href="/trainer/profile">
                                            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md">
                                                Update Profile
                                            </Button>
                                        </Link>
                                        <Link href="/trainer/opportunities">
                                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg">
                                                Find Jobs
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
                        {loading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {stats.map((stat) => {
                                        const Icon = stat.icon;
                                        return (
                                            <Card key={stat.name} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                                                <CardContent className="p-0">
                                                    <div className="p-6 bg-white">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-indigo-500/20`}>
                                                                <Icon className="h-6 w-6" />
                                                            </div>
                                                            {stat.change && (
                                                                <span className="flex items-center text-sm font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                                    {stat.change}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                                                            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Recommended Jobs */}
                                    <Card className="lg:col-span-2 border-none shadow-lg shadow-slate-200/50">
                                        <CardHeader className="bg-white border-b border-slate-50 flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-bold text-slate-800">Recommended Jobs</CardTitle>
                                                <CardDescription>Based on your skills and experience</CardDescription>
                                            </div>
                                            <Button variant="ghost" className="text-indigo-600">View All</Button>
                                        </CardHeader>
                                        <CardContent className="p-0 bg-white">
                                            {recommendedJobs.length === 0 ? (
                                                <div className="p-8 text-center text-slate-500">No recommended jobs found.</div>
                                            ) : recommendedJobs.map((job: any) => (
                                                <div key={job.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                            <Briefcase className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-slate-800">{job.title}</h4>
                                                            <p className="text-sm text-slate-500">{job.location || 'Remote'} • ${job.budgetMin || 50}-{job.budgetMax || 80}/hr</p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                                        Apply Now
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Upcoming Schedule */}
                                    <Card className="border-none shadow-lg shadow-slate-200/50">
                                        <CardHeader className="bg-white border-b border-slate-50">
                                            <CardTitle className="text-lg font-bold text-slate-800">Upcoming Schedule</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 bg-white space-y-6">
                                            {upcomingSessions.length === 0 ? (
                                                <div className="text-center py-4 text-slate-500">No upcoming sessions.</div>
                                            ) : upcomingSessions.map((session) => (
                                                <div key={session.id} className="relative pl-6 pb-6 border-l-2 border-indigo-100 last:pb-0">
                                                    <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-white" />
                                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                                                        {new Date(session.startTime).toLocaleDateString()} {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <h4 className="font-semibold text-slate-800">{session.title}</h4>
                                                    <p className="text-sm text-slate-500">{session.college?.name || 'Unknown Client'}</p>
                                                    <span className="inline-block mt-2 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                                                        {session.status}
                                                    </span>
                                                </div>
                                            ))}
                                            <Button className="w-full mt-4 bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800" variant="outline">
                                                View Calibration
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}

