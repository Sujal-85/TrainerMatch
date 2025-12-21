import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import api from '@/lib/api';
import {
    User, Mail, Phone, MapPin, Star, Award,
    Calendar, Download, ArrowLeft, CheckCircle2,
    Globe, Linkedin, Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export default function TrainerProfileView() {
    const router = useRouter();
    const { id } = router.query;
    const [trainer, setTrainer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTrainer();
        }
    }, [id]);

    const fetchTrainer = async () => {
        try {
            const res = await api.get(`/trainers/${id}`);
            setTrainer(res.data);
        } catch (error) {
            console.error("Failed to load trainer profile", error);
            toast.error("Failed to load trainer profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!trainer) {
        return (
            <div className="flex min-h-screen bg-slate-50 items-center justify-center">
                <p>Trainer not found</p>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50">
                <Head>
                    <title>{trainer.name} | Trainer Profile</title>
                </Head>
                <Sidebar />
                <main className="md:ml-64 transition-all duration-300 min-h-screen">
                    {/* Header */}
                    <div className="bg-[#020617] text-white pt-12 pb-32 px-6">
                        <div className="container mx-auto">
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="text-slate-400 hover:text-white hover:bg-white/10 mb-6 pl-0"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Matches
                            </Button>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <Avatar className="h-24 w-24 border-4 border-white/10 shadow-2xl">
                                    <AvatarImage src={trainer.profilePicture} />
                                    <AvatarFallback className="bg-blue-600 text-2xl font-bold">{trainer.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h1 className="text-4xl font-extrabold mb-2">{trainer.name}</h1>
                                    <div className="flex flex-wrap gap-4 text-slate-300">
                                        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-400" /> {trainer.location || 'Remote'}</div>
                                        <div className="flex items-center gap-1.5"><Star size={16} className="text-amber-400 fill-amber-400" /> {trainer.rating || 'N/A'} (12+ Workshops)</div>
                                        <div className="flex items-center gap-1.5"><Award size={16} className="text-emerald-400" /> Verified Expert</div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4 md:mt-0">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-8 h-12 rounded-xl">
                                        Shortlist Trainer
                                    </Button>
                                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 -mt-16 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="border-none shadow-xl shadow-blue-900/5 overflow-hidden rounded-2xl">
                                    <CardHeader className="bg-white border-b border-slate-50">
                                        <CardTitle className="text-xl font-bold">About {trainer.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 bg-white prose dark:prose-invert max-w-none">
                                        <p className="text-slate-600 leading-relaxed">
                                            {trainer.bio || "No biography provided. This trainer is a verified expert in their field with extensive experience in corporate and academic training."}
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900">12+</div>
                                                <div className="text-xs text-slate-500 uppercase font-semibold">Workshops</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900">4.9</div>
                                                <div className="text-xs text-slate-500 uppercase font-semibold">User Rating</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900">8y</div>
                                                <div className="text-xs text-slate-500 uppercase font-semibold">Experience</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900">100%</div>
                                                <div className="text-xs text-slate-500 uppercase font-semibold">Success Rate</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-xl shadow-blue-900/5 overflow-hidden rounded-2xl">
                                    <CardHeader className="bg-white border-b border-slate-50">
                                        <CardTitle className="text-xl font-bold">Expertise & Skills</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 bg-white">
                                        <div className="flex flex-wrap gap-2">
                                            {trainer.skills?.map((skill: string) => (
                                                <Badge
                                                    key={skill}
                                                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-4 py-1.5 rounded-lg font-medium transition-all"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <Card className="border-none shadow-xl shadow-blue-900/5 overflow-hidden rounded-2xl bg-white">
                                    <CardHeader className="border-b border-slate-50 pb-4">
                                        <CardTitle className="text-lg font-bold">Quick Contact</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                                            <div className="p-2 rounded-lg bg-white shadow-sm text-blue-600"><Mail size={18} /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                                                <p className="font-semibold text-slate-700 truncate">{trainer.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                                            <div className="p-2 rounded-lg bg-white shadow-sm text-blue-600"><Phone size={18} /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Phone Number</p>
                                                <p className="font-semibold text-slate-700">{trainer.phone || '+91-XXXXXXXXXX'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-4 pt-4 border-t border-slate-50">
                                            <Button size="icon" variant="ghost" className="hover:bg-blue-50 text-blue-600"><Linkedin size={20} /></Button>
                                            <Button size="icon" variant="ghost" className="hover:bg-slate-900 hover:text-white text-slate-600"><Github size={20} /></Button>
                                            <Button size="icon" variant="ghost" className="hover:bg-blue-400 hover:text-white text-blue-400"><Globe size={20} /></Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-xl shadow-blue-900/5 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                                    <CardContent className="p-8 text-center space-y-4">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="text-white" size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold">Check Availability</h3>
                                        <p className="text-blue-100 text-sm opacity-90">
                                            Schedule a quick sync or check the trainer's availability for your workshop dates.
                                        </p>
                                        <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold h-12 rounded-xl transition-all">
                                            View Calendar
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
