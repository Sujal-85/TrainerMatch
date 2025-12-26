import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
    Building2, Search, Plus, Filter, MoreVertical,
    Phone, Mail, MapPin, User, FileText, Calendar,
    ArrowRight, ChevronRight, Clock, CheckCircle2, Sparkles
} from 'lucide-react';
import Sidebar from '../../../components/sidebar';
import Link from 'next/link';
import Head from 'next/head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import api from '@/lib/api';

const STATUS_COLORS: any = {
    'Proposal Prepared': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Proposal Sent': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'AI Auto Follow-Up Initiated': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Meeting Scheduled': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Negotiation': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'Deal Closed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'On Hold / Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const CollegeDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const res = await api.get('/colleges');
            setColleges(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredColleges = colleges.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contacts?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            <main className="md:ml-64 pt-0 transition-all duration-300 min-h-screen bg-transparent">
                <Head>
                    <title>College CRM | Avalytics</title>
                </Head>

                {/* Premium Header - Reverted to Blue Theme */}
                <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white pb-32 pt-12 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px]"></div>

                    <div className="container mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-white/20 text-blue-50 border-white/20 hover:bg-white/30 px-3 py-1 backdrop-blur-md">
                                        <Building2 className="w-3 h-3 mr-1.5" />
                                        Active Pipeline
                                    </Badge>
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                                    College CRM
                                </h1>
                                <p className="text-slate-200/80 text-lg max-w-2xl font-medium">
                                    Manage your college relationships, track proposals, and automate follow-ups.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={async () => {
                                        const toastId = toast.loading('Running AI Agent...');
                                        try {
                                            const res = await api.post('/colleges/ai/trigger-follow-up');
                                            toast.success(`AI Agent processed ${res.data.processed} colleges for follow-up.`, { id: toastId });
                                            fetchColleges(); // Refresh list to show status changes
                                        } catch (e: any) {
                                            console.error(e);
                                            toast.error(e?.response?.data?.message || 'Failed to trigger AI Agent.', { id: toastId });
                                        }
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 h-11 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105"
                                >
                                    <Sparkles size={20} />
                                    Run AI Agent
                                </Button>
                                <Link href="/vendor/colleges/new">
                                    <Button
                                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 h-11 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/10 transition-all border border-blue-100"
                                    >
                                        <Plus size={20} />
                                        Add New College
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
                    {/* Filters & Search */}
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-border mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search colleges, TPOs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors font-medium">
                                <Filter size={18} />
                                <span>Filter</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors font-medium">
                                <ArrowRight size={18} />
                                <span>Pipeline View</span>
                            </button>
                        </div>
                    </div>

                    {/* College List Grid */}
                    {filteredColleges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredColleges.map((college, index) => (
                                <motion.div
                                    key={college.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Decorative subtle background gradient on hover */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px] -mr-10 -mt-10" />

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                <Building2 size={28} strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1 min-w-0 overflow-hidden">
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors truncate pr-4" title={college.name}>
                                                    {college.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-500">
                                                    <MapPin size={12} className="text-blue-500" />
                                                    {college.city || college.location || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-300 hover:text-slate-600 dark:text-zinc-600 dark:hover:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-full transition-all">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 mb-6 relative z-10">
                                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-transparent group-hover:border-blue-50 group-hover:bg-white transition-all duration-300">
                                            <div className="w-8 h-8 rounded-xl bg-blue-100/50 flex items-center justify-center">
                                                <User size={16} className="text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-500 mb-0.5">Primary Contact / TPO</p>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-800 truncate">{college.contacts?.[0]?.name || 'Not Available'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-transparent group-hover:border-blue-50 group-hover:bg-white transition-all duration-300">
                                            <div className="w-8 h-8 rounded-xl bg-cyan-100/50 flex items-center justify-center">
                                                <Phone size={16} className="text-cyan-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-500 mb-0.5">Contact Number</p>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-800 truncate">{college.contacts?.[0]?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5 relative z-10">
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[college.status] || 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                            {college.status}
                                        </div>
                                        <Link href={`/vendor/colleges/${college.id}`}>
                                            <button className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold group/btn">
                                                View Details
                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        loading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                                        <Building2 className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Colleges Found</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                                    {searchTerm ? "We couldn't find any colleges matching your search." : "Start building your network by adding your first college to the CRM."}
                                </p>
                                {searchTerm ? (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <Link href="/vendor/colleges/new">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
                                        >
                                            <Plus size={20} />
                                            Add First College
                                        </motion.button>
                                    </Link>
                                )}
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default CollegeDirectory;
