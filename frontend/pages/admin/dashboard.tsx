import React, { useState } from 'react';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    Users,
    Building2,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    Activity
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const iconMap: any = {
        'Users': Users,
        'Building2': Building2,
        'Activity': Activity,
        'ShieldCheck': ShieldCheck
    };

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/admin-stats');
                setStats(res.data.stats);
                setRecentUsers(res.data.recentUsers);
            } catch (error) {
                console.error("Failed to load admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Head>
                    <title>TrainerMatch - Admin Dashboard</title>
                </Head>

                <Sidebar />

                <main className="md:pl-64 pt-0 min-h-screen bg-slate-50">
                    <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white pb-24 pt-10 px-6 shadow-xl">
                        <div className="container mx-auto">
                            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                            <p className="text-blue-200">Manage your organization, trainers, and training requirements.</p>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 -mt-20 pb-10">
                        {loading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {stats.map((stat) => {
                                        const Icon = iconMap[stat.icon] || Activity;
                                        return (
                                            <Card key={stat.name} className="border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg ring-4 ring-blue-50`}>
                                                            <Icon className="h-6 w-6" />
                                                        </div>
                                                        <span className="text-xs font-bold bg-blue-50 px-2 py-1 rounded-full text-blue-600">
                                                            {stat.change}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                                                    <p className="text-sm font-medium text-slate-500 mt-1">{stat.name}</p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {/* Admin Content Area - Recent Registrations */}
                                <Card className="border-none shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Recent Registrations</CardTitle>
                                        <CardDescription>Latest users joined the platform</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                                    <tr>
                                                        <th className="px-6 py-3">User</th>
                                                        <th className="px-6 py-3">Role</th>
                                                        <th className="px-6 py-3">Organization/Bio</th>
                                                        <th className="px-6 py-3">Joined</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentUsers.map((user) => (
                                                        <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                                {user.email}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                    {user.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-500">
                                                                {user.vendor?.name || user.trainer?.bio?.substring(0, 30) || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-500">
                                                                {new Date(user.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {recentUsers.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="text-center py-4 text-slate-500">
                                                                No recent registrations found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
