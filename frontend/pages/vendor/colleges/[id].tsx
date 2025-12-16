import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Phone, Mail, MapPin, Calendar, Clock,
    FileText, Upload, MoreVertical, ChevronLeft,
    CheckCircle2, AlertCircle, MessageSquare, Send,
    User, Briefcase, DollarSign, ArrowRight
} from 'lucide-react';
import Sidebar from '../../../components/sidebar';
import Link from 'next/link';
import * as Tabs from '@radix-ui/react-tabs';

import api from '@/lib/api';

const STAGES = [
    'Proposal Prepared',
    'Proposal Sent',
    'AI Auto Follow-Up Initiated',
    'Meeting Scheduled',
    'Negotiation',
    'Deal Closed'
];

const CollegeDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [activeTab, setActiveTab] = useState('overview');
    const [college, setCollege] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCollegeDetails();
        }
    }, [id]);

    const fetchCollegeDetails = async () => {
        try {
            const res = await api.get(`/colleges/${id}`);
            setCollege(res.data);
            if (res.data.status) {
                // Map status string to index if needed, or backend can return stage index. 
                // For now, simple findIndex
            }
        } catch (error) {
            console.error("Failed to fetch college", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get stage index
    const currentStageIndex = college && STAGES.indexOf(college.status) > -1 ? STAGES.indexOf(college.status) : 0;


    return (
        <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
            <Sidebar />

            <main className=" md:pl-64 pt-0 flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex h-screen items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                    </div>
                ) : !college ? (
                    <div className="flex h-screen items-center justify-center text-slate-500">College not found</div>
                ) : (
                    <>
                        {/* Header / Breadcrumb */}
                        <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-6 sticky top-0 z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <Link href="/vendor/colleges">
                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                        <ChevronLeft size={20} />
                                    </button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {college.name}
                                        <span className="text-xs font-normal px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
                                            {college.status}
                                        </span>
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {college.location || college.city || 'N/A'}</span>
                                        <span className="flex items-center gap-1"><Building2 size={14} /> Est. {college.description?.slice(0, 10) || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="ml-auto flex gap-3">
                                    <button className="px-4 py-2 bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        <FileText size={18} />
                                        View Proposal
                                    </button>
                                    <button className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-lg shadow-violet-500/20">
                                        <MessageSquare size={18} />
                                        Send Email
                                    </button>
                                </div>
                            </div>

                            {/* Pipeline Visualizer */}
                            <div className="mt-8 relative">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-zinc-800 -translate-y-1/2 rounded-full" />
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-violet-600 -translate-y-1/2 rounded-full transition-all duration-500"
                                    style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
                                />
                                <div className="relative flex justify-between">
                                    {STAGES.map((stage, index) => {
                                        const isCompleted = index <= currentStageIndex;
                                        const isCurrent = index === currentStageIndex;

                                        return (
                                            <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 
                                            ${isCompleted
                                                            ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/30'
                                                            : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-400'
                                                        } ${isCurrent ? 'scale-110 ring-4 ring-violet-100 dark:ring-violet-900/40' : ''}`}
                                                >
                                                    {isCompleted ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                                                </div>
                                                <span className={`text-xs font-medium max-w-[100px] text-center transition-colors ${isCurrent ? 'text-violet-600 dark:text-violet-400 font-bold' : 'text-gray-500'
                                                    }`}>
                                                    {stage}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 max-w-7xl mx-auto">
                            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                                <Tabs.List className="flex gap-6 border-b border-gray-200 dark:border-zinc-800 mb-8">
                                    {['overview', 'stakeholders', 'requirements', 'documents', 'timeline'].map((tab) => (
                                        <Tabs.Trigger
                                            key={tab}
                                            value={tab}
                                            className={`pb-4 text-sm font-medium capitalize transition-colors relative ${activeTab === tab
                                                ? 'text-violet-600 dark:text-violet-400'
                                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600"
                                                />
                                            )}
                                        </Tabs.Trigger>
                                    ))}
                                </Tabs.List>

                                <Tabs.Content value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Next Action Card */}
                                        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-indigo-900/10 border border-violet-100 dark:border-violet-900/20 p-6 rounded-2xl flex items-start gap-4">
                                            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-600">
                                                <AlertCircle size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Action Required: Follow Up</h3>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                    The system flagged this college for follow-up. The proposal was sent 3 days ago with no response.
                                                </p>
                                                <div className="flex gap-3 mt-4">
                                                    <button className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700">
                                                        Send Reminder
                                                    </button>
                                                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm rounded-lg">
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* About Section */}
                                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">About College</h3>
                                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Official Website</p>
                                                    <a href={college.website?.startsWith('http') ? college.website : `https://${college.website}`} target="_blank" className="text-violet-600 hover:underline">{college.website || 'N/A'}</a>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Established</p>
                                                    <p className="font-medium dark:text-gray-200">{college.description?.slice(0, 10) || 'N/A'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-gray-500">Address</p>
                                                    <p className="font-medium dark:text-gray-200">{college.address || `${college.city}, ${college.state}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Key Contacts Widget */}
                                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-gray-900 dark:text-white">Primary Contact</h3>
                                            </div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                                    <User size={20} className="text-gray-600 dark:text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{college.contacts?.[0]?.name || 'No Contact'}</p>
                                                    <p className="text-xs text-violet-600 font-medium">Primary Contact</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <a href={`tel:${college.contacts?.[0]?.phone}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg">
                                                    <Phone size={16} />
                                                    {college.contacts?.[0]?.phone || 'N/A'}
                                                </a>
                                                <a href={`mailto:${college.contacts?.[0]?.email}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg">
                                                    <Mail size={16} />
                                                    {college.contacts?.[0]?.email || 'N/A'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Tabs.Content>

                                <Tabs.Content value="stakeholders" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {college.contacts?.map((contact: any, idx: number) => (
                                        <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                                    <User size={24} className="text-gray-700 dark:text-gray-300" />
                                                </div>
                                                {/* Role is not in simple contact schema yet, mocking or checking if stored */}
                                                <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs px-2 py-1 rounded-full font-medium">
                                                    Contact
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1 dark:text-white">{contact.name}</h4>
                                            <div className="space-y-2 mt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Mail size={14} />
                                                    {contact.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Phone size={14} />
                                                    {contact.phone}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="h-full min-h-[200px] border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-violet-500 hover:text-violet-600 transition-colors bg-gray-50/50 dark:bg-zinc-900/30">
                                        <div className="p-3 bg-white dark:bg-zinc-800 rounded-full mb-3 shadow-sm">
                                            <Plus size={24} />
                                        </div>
                                        <span className="font-medium">Add Stakeholder</span>
                                    </button>
                                </Tabs.Content>

                                <Tabs.Content value="requirements" className="space-y-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Training Requirements</h3>
                                        <Link href={`/vendor/requirements/new`}>
                                            <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 flex items-center gap-2">
                                                <Plus size={16} />
                                                New Requirement
                                            </button>
                                        </Link>
                                    </div>

                                    {college.requirements?.length === 0 ? (
                                        <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                            <p className="text-gray-500">No requirements found. Create one to generate a proposal.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {college.requirements?.map((req: any) => {
                                                const hasProposal = req.collegeProposals && req.collegeProposals.length > 0;
                                                return (
                                                    <div key={req.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-all group">
                                                        <div className="flex justify-between mb-3">
                                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${req.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                                                {req.status}
                                                            </span>
                                                            <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 transition-colors">{req.title}</h4>
                                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{req.description}</p>

                                                        <div className="flex gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4 mt-auto">
                                                            {hasProposal ? (
                                                                <button
                                                                    className="flex-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
                                                                    onClick={() => alert(`Opening Proposal: ${req.collegeProposals[0].title}`)}
                                                                >
                                                                    <FileText size={16} />
                                                                    View AI Proposal
                                                                </button>
                                                            ) : (
                                                                <div className="flex-1 text-center py-2 text-sm text-gray-400 italic">
                                                                    Generating Proposal...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Tabs.Content>

                                <Tabs.Content value="documents" className="space-y-6">
                                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Uploaded Documents</h3>
                                            <p className="text-gray-500 text-sm">Proposals, contracts, and other files.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 flex items-center gap-2">
                                            <Upload size={16} />
                                            Upload New
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-start gap-3 group hover:border-violet-500/30 transition-colors cursor-pointer">
                                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white truncate">Project_Proposal_v2.pdf</h4>
                                                <p className="text-xs text-gray-500 mt-1">2.4 MB • Uploaded 3 days ago</p>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-start gap-3 group hover:border-violet-500/30 transition-colors cursor-pointer">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white truncate">College_Requirements.docx</h4>
                                                <p className="text-xs text-gray-500 mt-1">1.1 MB • Uploaded 5 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </Tabs.Content>

                                <Tabs.Content value="timeline" className="max-w-3xl">
                                    <div className="relative border-l-2 border-gray-100 dark:border-zinc-800 ml-4 space-y-8">
                                        {college.activities?.map((activity: any) => (
                                            <div key={activity.id} className="relative pl-8">
                                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-950 ${activity.type === 'STATUS_CHANGE' ? 'bg-green-500' :
                                                    activity.type === 'EMAIL' || activity.type === 'AI_FOLLOW_UP' ? 'bg-blue-500' : 'bg-gray-400'
                                                    }`} />
                                                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{activity.type.replace(/_/g, ' ').toLowerCase()}</span>
                                                        <span className="text-xs text-gray-400">{new Date(activity.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{activity.description}</p>
                                                    <p className="text-xs text-gray-400 mt-2">By: {activity.performedBy || 'System'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Tabs.Content>
                            </Tabs.Root>
                        </div>
                        </>
                        )}
                    </main>
        </div>
    );
};

// Import Plus icon locally since it was used in Stakeholders tab
import { Plus } from 'lucide-react';

export default CollegeDetail;
