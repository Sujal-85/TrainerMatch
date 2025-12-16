import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Video, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';

export default function TrainerSessions() {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<any[]>([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await api.get('/sessions');
                setSessions(res.data);
            } catch (error) {
                console.error("Failed to load sessions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const upcomingSessions = sessions.filter(s => new Date(s.startTime) > new Date() && s.status !== 'COMPLETED' && s.status !== 'CANCELLED');
    const pastSessions = sessions.filter(s => new Date(s.endTime) < new Date() || s.status === 'COMPLETED');
    // Pending requests filter could be based on status 'SCHEDULED' vs 'CONFIRMED' if strictly pending approval, 
    // but schema uses SCHEDULED as default. Let's assume SCHEDULED is upcoming.
    // If "requests" means something else, I'll allow empty for now or filter PENDING if status existed.
    // Schema has MATCH status but SESSION status is SCHEDULED, CONFIRMED...
    // Let's assume Requests logic is future work or purely mock. I'll leave it empty or mock for now as backend doesn't have "Request" model distinct from Session yet, 
    // maybe "Match" with status PENDING is a request?
    // Let's stick to simple time/status filtering for sessions.


    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white pb-24 pt-10 px-6 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    <div className="container mx-auto relative z-10">
                        <h1 className="text-3xl font-bold mb-2">My Sessions</h1>
                        <p className="text-indigo-100">Manage your upcoming training schedule</p>
                    </div>
                </div>

                <main className="container mx-auto px-6 -mt-20 relative z-20 pb-10">

                    {loading ? (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <Tabs defaultValue="upcoming" className="space-y-6">
                            <TabsList className="bg-white p-1 border border-slate-200 rounded-xl">
                                <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Upcoming</TabsTrigger>
                                <TabsTrigger value="past" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Past & Completed</TabsTrigger>
                                <TabsTrigger value="requests" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Pending Requests</TabsTrigger>
                            </TabsList>

                            <TabsContent value="upcoming" className="space-y-8 min-h-[400px]">
                                {upcomingSessions.length > 0 ? (
                                    upcomingSessions.map(session => (
                                        <Card key={session.id} className="overflow-hidden border-l-4 mt-20 border-l-blue-500 hover:shadow-md transition-all">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                {session.status}
                                                            </Badge>
                                                            <span className="text-sm text-slate-500">Online</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-slate-900">{session.title}</h3>
                                                        <p className="text-slate-600 font-medium">{session.college?.name || 'Unknown Client'}</p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                                <CalendarIcon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-400">Date & Time</p>
                                                                <p className="font-semibold text-slate-900">
                                                                    {new Date(session.startTime).toLocaleDateString()} {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                                                <Clock className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-400">End Time</p>
                                                                <p className="font-semibold text-slate-900">
                                                                    {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button variant="outline">Reschedule</Button>
                                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                                            {session.type === 'Online' ? 'Join Link' : 'View Location'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-iner">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                                                <CalendarIcon className="w-8 h-8 text-blue-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Upcoming Sessions</h3>
                                        <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                                            Your schedule looks clear for now! Any new training sessions assigned to you will appear here automatically.
                                        </p>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-8 rounded-full">
                                            Refresh Schedule
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="past" className="space-y-4 min-h-[400px]">
                                {pastSessions.length > 0 ? (
                                    pastSessions.map(session => (
                                        <Card key={session.id} className="opacity-75 hover:opacity-100 transition-opacity">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">{session.title}</h3>
                                                        <p className="text-slate-500">{session.college?.name} • {new Date(session.startTime).toLocaleDateString()}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Completed
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 grayscale opacity-50">
                                            <Clock className="w-8 h-8" />
                                        </div>
                                        <p className="font-medium">No past sessions found</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="requests" className="space-y-4 min-h-[400px]">
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-purple-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Pending Requests</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">
                                        You're all caught up! New training requests will show up here for your approval.
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </main>
            </div>
        </div>
    );
}
