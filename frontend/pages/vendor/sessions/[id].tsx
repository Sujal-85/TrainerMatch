import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import api from '@/lib/api';
import {
    Calendar, Clock, MapPin, User, FileText, CheckCircle, AlertTriangle,
    MessageSquare, Star, Users, ArrowLeft, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function SessionDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [newTrainerId, setNewTrainerId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) fetchSession();
    }, [id]);

    const fetchSession = async () => {
        try {
            const res = await api.get(`/sessions/${id}`);
            setSession(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReplaceTrainer = async () => {
        if (!newTrainerId) return;
        setSubmitting(true);
        try {
            await api.post(`/sessions/${id}/replace-trainer`, { trainerId: newTrainerId });
            alert('Trainer replaced successfully');
            fetchSession();
        } catch (error) {
            alert('Failed to replace trainer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFeedback = async () => {
        setSubmitting(true);
        try {
            await api.post(`/sessions/${id}/feedback`, { feedback, rating });
            alert('Feedback submitted');
            fetchSession();
        } catch (error) {
            alert('Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };



    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <main className="flex-1 md:pl-64 p-8">
                    <Head><title>{session?.title} | Session Details</title></Head>

                    <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sessions
                    </Button>

                    {loading ? (
                        <div className="flex bg-white rounded-xl shadow-sm border border-slate-100 min-h-[500px] items-center justify-center">
                            <Spinner size="lg" className="text-blue-600" />
                        </div>
                    ) : !session ? (
                        <div className="p-8 text-center text-slate-500">Session not found</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-white border-b pb-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{session.title}</CardTitle>
                                                <div className="flex gap-4 text-slate-500 text-sm">
                                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(session.startTime).toDateString()}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <Badge variant={session.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                                                {session.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Topic Description</h3>
                                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                                                {session.topic || session.description || 'No detailed topic provided.'}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /> Location</h3>
                                            <p className="text-slate-600">{session.location || session.college?.address || 'TBD'}</p>
                                        </div>

                                        {/* Attendance Section placeholder */}
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                                                    <Users className="w-5 h-5" /> Attendance
                                                </h3>
                                                <Button size="sm" variant="outline" className="bg-white text-blue-600 border-blue-200">Mark Attendance</Button>
                                            </div>
                                            <p className="text-sm text-blue-700">Attendance data not yet marked.</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-md">
                                    <CardHeader><CardTitle>Feedback & Rating</CardTitle></CardHeader>
                                    <CardContent>
                                        {session.feedback ? (
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2 text-yellow-500 font-bold">
                                                    <Star className="fill-current w-5 h-5" /> {session.feedbackRating}/5
                                                </div>
                                                <p className="text-slate-700 italic">"{session.feedback}"</p>
                                            </div>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full bg-slate-900 text-white">Submit Feedback</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Session Feedback</DialogTitle></DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div>
                                                            <Label>Rating (1-5)</Label>
                                                            <Input type="number" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} />
                                                        </div>
                                                        <div>
                                                            <Label>Comments</Label>
                                                            <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="How did the session go?" />
                                                        </div>
                                                        <Button onClick={handleFeedback} disabled={submitting} className="w-full">
                                                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <Card className="shadow-sm">
                                    <CardHeader className="pb-2"><CardTitle className="text-lg">Trainer Info</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                                {session.trainer?.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{session.trainer?.name}</p>
                                                <p className="text-xs text-slate-500">{session.trainer?.email}</p>
                                            </div>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                                                    <RefreshCw className="w-4 h-4 mr-2" /> Replace Trainer
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Replace Trainer</DialogTitle></DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <Label>New Trainer ID (Temp Input)</Label>
                                                    <Input value={newTrainerId} onChange={e => setNewTrainerId(e.target.value)} placeholder="Enter Trainer ID" />
                                                    <Button onClick={handleReplaceTrainer} disabled={submitting} className="w-full bg-red-600 hover:bg-red-700">
                                                        Confirm Replacement
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm">
                                    <CardHeader className="pb-2"><CardTitle className="text-lg">College Info</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className="font-semibold">{session.college?.name}</p>
                                        <p className="text-sm text-slate-500 mt-1">{session.college?.location}</p>
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Contacts</p>
                                            {session.college?.contacts?.map((c: any) => (
                                                <p key={c.id} className="text-sm">{c.name} - {c.phone}</p>
                                            )) || <p className="text-sm italic text-slate-400">No contacts listed</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
