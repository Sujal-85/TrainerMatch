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
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <Sidebar />

            <main className="md:ml-64 pt-0 transition-all duration-300 min-h-screen bg-slate-50/50">
                {/* Header Section with Gradient Background */}
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    <div className="container mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                    <Building2 className="text-blue-100" size={32} />
                                    College CRM
                                </h1>
                                <p className="text-blue-100">
                                    Manage relationships, proposals, and pipeline stages.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={async () => {
                                        const toastId = toast.loading('Running AI Agent...');
                                        try {
                                            const res = await api.post('/colleges/ai/trigger-follow-up');
                                            toast.success(`AI Agent processed ${res.data.processed} colleges for follow-up.`, { id: toastId });
                                            fetchColleges(); // Refresh list to show status changes
                                        } catch (e: any) {
                                            console.error(e);
                                            toast.error(e?.response?.data?.message || 'Failed to trigger AI Agent. Ensure you are an Admin.', { id: toastId });
                                        }
                                    }}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                >
                                    <Sparkles size={20} />
                                    Run AI Agent
                                </motion.button>
                                <Link href="/vendor/colleges/new">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-colors"
                                    >
                                        <Plus size={20} />
                                        Add New College
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
                    {/* Filters & Search */}
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg shadow-slate-200/50 border-none mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
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
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors">
                                <Filter size={18} />
                                <span>Filter</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors">
                                <ArrowRight size={18} />
                                <span>Pipeline View</span>
                            </button>
                        </div>
                    </div>

                    {/* College List Grid */}
                    {/* College List Grid */}
                    {filteredColleges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredColleges.map((college, index) => (
                                <motion.div
                                    key={college.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white dark:bg-zinc-900 rounded-2xl p-5 border-none shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                    {college.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-gray-400 mt-1">
                                                    <MapPin size={14} />
                                                    {college.city || college.location || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-lg">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                                                <User size={16} className="text-blue-500" />
                                                <span>TPO:</span>
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white">{college.contacts?.[0]?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-lg">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                                                <Phone size={16} className="text-blue-500" />
                                                <span>Contact:</span>
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white">{college.contacts?.[0]?.phone || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[college.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {college.status}
                                        </div>
                                        <Link href={`/vendor/colleges/${college.id}`}>
                                            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-bold">
                                                View Details
                                                <ChevronRight size={16} />
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
