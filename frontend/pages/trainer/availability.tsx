import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function TrainerAvailability() {
    const [loading, setLoading] = useState(true);
    const [availabilities, setAvailabilities] = useState<any[]>([]);
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const res = await api.get('/trainers/availability');
            setAvailabilities(res.data);
        } catch (error) {
            console.error("Failed to fetch availability", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBlock = async () => {
        try {
            if (!date) return;
            // Construct ISO dates
            const start = new Date(`${date}T${startTime}`);
            const end = new Date(`${date}T${endTime}`);

            await api.post('/trainers/availability', {
                date: new Date(date),
                startTime: start,
                endTime: end,
                isAvailable: false // Blocked
            });
            fetchAvailability();
            setDate('');
        } catch (error) {
            console.error("Failed to add block", error);
            alert("Failed to add block");
        }
    };



    const blockedDates = availabilities.filter(a => !a.isAvailable);

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white pb-24 pt-10 px-6 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    <div className="container mx-auto relative z-10">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Availability</h1>
                                <p className="text-indigo-100">Set your working hours and block out dates</p>
                            </div>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Date Block
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Block a Date</SheetTitle>
                                        <SheetDescription>
                                            Select a date and time range to mark as unavailable.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="start">Start Time</Label>
                                                <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="end">End Time</Label>
                                                <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button type="submit" onClick={handleAddBlock}>Save Block</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-6 -mt-20 relative  z-20 pb-10">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full flex min-h-[400px] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                            </div>
                        ) : (
                            <>

                                <Card className="lg:col-span-2 shadow-lg border border-border bg-white " >
                                    <CardHeader>
                                        <CardTitle>Calendar</CardTitle>
                                        <CardDescription>Manage your schedule visually</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-4 flex justify-center bg-muted/50 rounded-xl border border-border">
                                            <style>{`
                                      .rdp { --rdp-cell-size: 50px; --rdp-accent-color: #7c3aed; --rdp-background-color: #ede9fe; margin: 0; }
                                      .rdp-day_selected { background-color: var(--rdp-accent-color); color: white; }
                                      .rdp-day_today { font-weight: bold; color: var(--rdp-accent-color); }
                                    `}</style>
                                            <DayPicker
                                                mode="single"
                                                selected={date ? new Date(date) : undefined}
                                                onSelect={(val) => {
                                                    if (val) {
                                                        setDate(val.toISOString().split('T')[0]);
                                                        // Programmatically open the sheet if we could, but for now just setting date
                                                        // We can trigger the sheet or just show the date is selected
                                                    }
                                                }}
                                                modifiers={{
                                                    blocked: blockedDates.map(b => new Date(b.date))
                                                }}
                                                modifiersStyles={{
                                                    blocked: { textDecoration: 'line-through', color: 'red', opacity: 0.5 }
                                                }}
                                                disabled={[{ before: new Date() }]}
                                                showOutsideDays
                                                className="bg-white p-6 rounded-lg shadow-sm"
                                            />
                                            {/* Helper text or auto-trigger logic could go here */}
                                        </div>
                                        <div className="mt-4 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                {date ? `Selected Date: ${new Date(date).toLocaleDateString()}` : "Select a date to manage availability"}
                                            </p>
                                            {date && (
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button className="mt-2 bg-violet-600 hover:bg-violet-700 text-white gap-2">
                                                            <Plus className="w-4 h-4" />
                                                            Block {new Date(date).toLocaleDateString()}
                                                        </Button>
                                                    </SheetTrigger>
                                                    <SheetContent>
                                                        <SheetHeader>
                                                            <SheetTitle>Block {new Date(date).toLocaleDateString()}</SheetTitle>
                                                            <SheetDescription>
                                                                Set time range to mark as unavailable.
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="start-cal">Start Time</Label>
                                                                    <Input id="start-cal" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="end-cal">End Time</Label>
                                                                    <Input id="end-cal" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <SheetFooter>
                                                            <SheetClose asChild>
                                                                <Button type="submit" onClick={handleAddBlock}>Save Block</Button>
                                                            </SheetClose>
                                                        </SheetFooter>
                                                    </SheetContent>
                                                </Sheet>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <Card className="shadow-lg border border-border bg-white">
                                        <CardHeader>
                                            <CardTitle className="text-base">Working Hours</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                                <div key={day} className="flex items-center justify-between text-sm">
                                                    <span className="font-medium w-12">{day}</span>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <div className="bg-muted px-2 py-1 rounded">09:00 AM</div>
                                                        <span>-</span>
                                                        <div className="bg-muted px-2 py-1 rounded">05:00 PM</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-lg border border-border bg-white">
                                        <CardHeader>
                                            <CardTitle className="text-base">Blocked Dates</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {blockedDates.length === 0 && <p className="text-sm text-muted-foreground">No dates blocked.</p>}
                                            {blockedDates.map((block: any) => (
                                                <div key={block.id} className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-100">
                                                    <div>
                                                        <div className="font-medium text-red-900">Unavailable</div>
                                                        <div className="text-xs text-red-700">
                                                            {new Date(block.date).toLocaleDateString()} • {new Date(block.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(block.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
