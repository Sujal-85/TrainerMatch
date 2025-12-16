import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Building,
    User as UserIcon
} from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function NewSession() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<any[]>([]);
    const [trainers, setTrainers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        trainerId: '',
        collegeId: '',
        location: 'Remote',
        status: 'SCHEDULED'
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [collegesRes, trainersRes] = await Promise.all([
                    api.get('/colleges'),
                    api.get('/trainers')
                ]);
                setColleges(collegesRes.data);
                setTrainers(trainersRes.data);
            } catch (error) {
                console.error("Failed to fetch dependencies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString(),
            };
            await api.post('/sessions', payload);
            router.push('/vendor/sessions');
        } catch (error) {
            console.error('Failed to create session:', error);
            alert('Failed to create session. Please check inputs.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Head>
                    <title>TrainerMatch - Schedule Session</title>
                </Head>
                <Sidebar />
                <main className="md:pl-55-safe pt-0 transition-all duration-300">
                    <div className="container py-6 md:py-8 pr-6 md:pr-10 max-w-full">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Schedule New Session</h1>
                            <p className="text-muted-foreground">Create a new training session for a college.</p>
                        </div>

                        {loading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <Card className="max-w-3xl">
                                <CardHeader>
                                    <CardTitle>Session Details</CardTitle>
                                    <CardDescription>Fill in the required information.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Session Title</Label>
                                            <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Intro to AI" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="startTime">Start Time</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input id="startTime" name="startTime" type="datetime-local" className="pl-10" value={formData.startTime} onChange={handleChange} required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="endTime">End Time</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input id="endTime" name="endTime" type="datetime-local" className="pl-10" value={formData.endTime} onChange={handleChange} required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="collegeId">College</Label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <select
                                                        id="collegeId"
                                                        name="collegeId"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={formData.collegeId}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select College</option>
                                                        {colleges.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="trainerId">Trainer</Label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <select
                                                        id="trainerId"
                                                        name="trainerId"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={formData.trainerId}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select Trainer</option>
                                                        {trainers.map(t => (
                                                            <option key={t.id} value={t.id}>{t.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                                            <Button type="submit" disabled={loading}>{loading ? 'Scheduling...' : 'Schedule Session'}</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
