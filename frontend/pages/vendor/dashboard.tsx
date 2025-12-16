import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    Users, Building2, Calendar, FileText, TrendingUp, DollarSign,
    Activity, ArrowUpRight, BarChart3, PieChart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';

export default function VendorDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/analytics')
            ]);
            setStats(statsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error('Failed to load dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        const data = {
            ...stats,
            date: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vendor-report.json';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Fallback if data is missing
    const statCards = [
        {
            label: 'Active Colleges',
            value: stats?.totalColleges || 0,
            icon: Building2,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            label: 'Open Requirements',
            value: stats?.activeRequirements || 0,
            icon: FileText,
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            label: 'Matched Trainers',
            value: stats?.trainersMatched || 0,
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Scheduled Sessions',
            value: stats?.sessionsScheduled || 0,
            icon: Calendar,
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        }
    ];

    const chartData = analytics?.matchSuccessData || [];
    const pieData = analytics?.categoryDistribution || [];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50">
                <Head>
                    <title>Vendor Dashboard | Avalytics</title>
                </Head>
                <Sidebar />
                <main className="md:ml-64 pt-0 transition-all duration-300 min-h-screen bg-slate-50/50">
                    {/* Premium Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                        <div className="container mx-auto relative z-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                        <Activity className="text-blue-100" size={32} />
                                        Dashboard
                                    </h1>
                                    <p className="text-blue-100">
                                        Overview of your training operations and performance.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleDownloadReport}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xl"
                                >
                                    <ArrowUpRight className="w-4 h-4 mr-2" />
                                    Download Report
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
                        {loading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
                                    {statCards.map((stat, i) => (
                                        <Card key={i} className=" shadow-lg hover:shadow-md transition-shadow bg-white border-none h-[150px]">
                                            <CardContent className="p-6 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                                </div>
                                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                    {/* Main Bar Chart */}
                                    <Card className="lg:col-span-2 border-none shadow-sm h-[400px]">
                                        <CardContent className="p-6 h-full flex flex-col">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                                    <BarChart3 className="w-5 h-5 text-blue-500" />
                                                    Match Success Rate (Last 6 Months)
                                                </h3>
                                            </div>
                                            <div className="flex-1 w-full min-h-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={chartData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                            cursor={{ fill: '#F1F5F9' }}
                                                        />
                                                        <Legend />
                                                        <Bar dataKey="total" name="Total Matches" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                                                        <Bar dataKey="success" name="Successful Matches" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Pie Chart */}
                                    <Card className="border-none shadow-sm h-[400px]">
                                        <CardContent className="p-6 h-full flex flex-col">
                                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                                <PieChart className="w-5 h-5 text-purple-500" />
                                                Requirement Categories
                                            </h3>
                                            <div className="flex-1 w-full min-h-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RePieChart>
                                                        <Pie
                                                            data={pieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="percentage"
                                                        >
                                                            {pieData.map((entry: any, index: number) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                                                    </RePieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activity / Top Trainers */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <Card className="border-none shadow-sm">
                                        <CardContent className="p-6">
                                            <h3 className="font-bold text-lg text-slate-800 mb-4">Top Performing Trainers</h3>
                                            <div className="space-y-4">
                                                {analytics?.trainerPerformanceData?.map((trainer: any, i: number) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                                {i + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-900">{trainer.trainer}</p>
                                                                <p className="text-xs text-slate-500">{trainer.matches} matches</p>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                                                            Rank {i + 1}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Activity Mock (Can fetch from activity service later) */}
                                    <Card className="border-none shadow-sm">
                                        <CardContent className="p-6">
                                            <h3 className="font-bold text-lg text-slate-800 mb-4">Recent Activity</h3>
                                            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                                {[
                                                    { text: 'New requirement "Python Bootcamp" posted', time: '2 hours ago', icon: FileText, color: 'bg-blue-500' },
                                                    { text: 'Trainer "John Doe" matched to "Java basics"', time: '5 hours ago', icon: Users, color: 'bg-green-500' },
                                                    { text: 'Proposal for "AI Workshop" generated', time: '1 day ago', icon: TrendingUp, color: 'bg-purple-500' },
                                                ].map((item, i) => (
                                                    <div key={i} className="relative pl-10">
                                                        <div className={`absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white ${item.color} ring-1 ring-slate-100`}></div>
                                                        <p className="text-sm font-medium text-slate-800">{item.text}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                                                    </div>
                                                ))}
                                            </div>
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
