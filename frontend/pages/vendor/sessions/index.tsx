import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Users,
  CalendarCheck
} from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import api from '@/lib/api';

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions');
      const data = response.data.map((sess: any) => ({
        id: sess.id,
        title: sess.title || 'Untitled Session',
        trainer: sess.trainer?.name || sess.trainer?.email || 'Unknown Trainer',
        status: (sess.status || 'upcoming').toLowerCase(),
        date: new Date(sess.startTime).toLocaleDateString(),
        time: `${new Date(sess.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(sess.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        location: sess.location || 'Remote',
        attendees: sess.attendeesCount || 0,
      }));
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 shadow-sm"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="shadow-sm"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 shadow-sm"><AlertCircle className="h-3 w-3 mr-1" /> Upcoming</Badge>;
    }
  };

  const filteredSessions = (status: string) => {
    if (status === 'all') return sessions;
    return sessions.filter(session => session.status === status);
  };



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Head>
          <title>TrainerMatch - Sessions</title>
          <meta name="description" content="Manage and track training sessions" />
        </Head>

        <Sidebar />

        <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
            <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Training Sessions</h1>
                <p className="text-blue-100">Manage your schedule and track upcoming training sessions.</p>
              </div>
              <Link href="/vendor/sessions/new">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </Link>
            </div>
          </div>

          <div className="container mx-auto px-6 -mt-16 relative z-20 pb-10">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-lg shadow-blue-900/5 border border-blue-50 w-full sm:w-fit">
              <Button
                variant="ghost"
                onClick={() => setFilter('all')}
                className={`rounded-lg ${filter === 'all' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All Sessions
              </Button>
              <Button
                variant="ghost"
                onClick={() => setFilter('upcoming')}
                className={`rounded-lg ${filter === 'upcoming' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Upcoming
              </Button>
              <Button
                variant="ghost"
                onClick={() => setFilter('completed')}
                className={`rounded-lg ${filter === 'completed' ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Completed
              </Button>
              <Button
                variant="ghost"
                onClick={() => setFilter('cancelled')}
                className={`rounded-lg ${filter === 'cancelled' ? 'bg-red-50 text-red-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Cancelled
              </Button>
            </div>

            {/* Sessions List */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {filteredSessions(filter).map((session) => (
                    <Card key={session.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                      <CardHeader className="bg-white border-b border-slate-50 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <CardTitle className="text-lg font-bold text-slate-800">{session.title}</CardTitle>
                              {getStatusBadge(session.status)}
                            </div>
                            <CardDescription className="flex flex-wrap items-center gap-4 text-sm mt-1">
                              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                {session.date}
                              </span>
                              <span className="flex items-center gap-1.5 text-slate-500">
                                <Clock className="h-3.5 w-3.5" />
                                {session.time}
                              </span>
                              <span className="flex items-center gap-1.5 text-slate-500">
                                {session.location.includes('Virtual') ? (
                                  <Video className="h-3.5 w-3.5" />
                                ) : (
                                  <MapPin className="h-3.5 w-3.5" />
                                )}
                                {session.location}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="flex items-center justify-end font-bold text-slate-800 text-lg">
                                <Users className="h-4 w-4 mr-2 text-blue-500" />
                                {session.attendees}
                              </div>
                              <p className="text-sm text-slate-400">Attendees</p>
                            </div>
                            <div className="text-right border-l border-slate-100 pl-6">
                              <p className="text-sm font-medium text-slate-800">{session.trainer}</p>
                              <p className="text-xs text-slate-400">Trainer</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="bg-slate-50/50 pt-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                          <div className="text-sm text-slate-400">
                            Session ID: <span className="font-mono text-slate-600">#{session.id.substring(0, 8)}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
                            {session.status === 'upcoming' && (
                              <>
                                <Button variant="outline" className="h-9 border-red-100 text-red-600 hover:bg-red-50">Cancel</Button>
                                <Button variant="outline" className="h-9 border-blue-200 text-blue-600 hover:bg-blue-50">Reschedule</Button>
                              </>
                            )}
                            {session.status === 'completed' && (
                              <Button variant="outline" className="h-9 border-blue-200 text-blue-600 hover:bg-blue-50">View Feedback</Button>
                            )}
                            <Link href={`/vendor/sessions/${session.id}`}>
                              <Button className="h-9 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 shadow-sm">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredSessions(filter).length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CalendarCheck className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No sessions found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                      {filter === 'all'
                        ? "You don't have any scheduled sessions yet."
                        : `You don't have any ${filter} sessions.`}
                    </p>
                    <Link href="/vendor/sessions/new">
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 rounded-full px-8">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    </Link>
                  </div>
                )}
                    </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}