import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, FileText, ArrowLeft, Save, Sparkles } from 'lucide-react';
import Sidebar from '../../../components/sidebar';
import Link from 'next/link';
import { useRouter } from 'next/router';

import api from '@/lib/api';

const AddCollegeObj = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            city: formData.get('city'), // We used location field as city
            address: formData.get('address'),
            website: formData.get('website'),
            description: `Established: ${formData.get('established')}`, // Storing established year in description for now
            contacts: [
                {
                    name: formData.get('tpoName'),
                    email: formData.get('tpoEmail'),
                    phone: formData.get('tpoPhone'),
                    // role: 'TPO' 
                },
                {
                    name: formData.get('directorName'),
                    email: formData.get('directorEmail'),
                    // role: 'Director'
                }
            ].filter(c => c.name) // Filter out empty contacts
        };

        try {
            await api.post('/colleges', data);
            router.push('/vendor/colleges');
        } catch (error) {
            console.error("Failed to create college", error);
            alert("Failed to create college. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
            <Sidebar />

            <main className="md:pl-64 pt-0 flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="mb-8">
                        <Link href="/vendor/colleges" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4">
                            <ArrowLeft size={18} />
                            Back to Directory
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Building2 className="text-violet-600" size={32} />
                            Add New College
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Enter the college details to start tracking in the CRM pipeline.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: College Info */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600">
                                    <Building2 size={24} />
                                </div>
                                <h2 className="text-xl font-bold dark:text-white">College Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">College Name</label>
                                    <input name="name" required type="text" placeholder="e.g. Tech Institute of Engineering" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location (City, State)</label>
                                    <input name="city" required type="text" placeholder="e.g. Pune, Maharashtra" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Address</label>
                                    <textarea name="address" rows={3} placeholder="Enter complete address..." className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                                    <input name="website" type="url" placeholder="https://" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Established Year</label>
                                    <input name="established" type="number" placeholder="YYYY" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Stakeholders */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                    <User size={24} />
                                </div>
                                <h2 className="text-xl font-bold dark:text-white">Key Stakeholders</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* TPO */}
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Training & Placement Officer (TPO)</h3>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input name="tpoName" required type="text" placeholder="Dr. Name Surname" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input name="tpoEmail" required type="email" placeholder="tpo@college.edu" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                    <input name="tpoPhone" required type="tel" placeholder="+91..." className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>

                                {/* Director */}
                                <div className="md:col-span-2 mt-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Director / Principal</h3>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Director Name</label>
                                    <input name="directorName" type="text" placeholder="Prof. Director Name" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Director Email (Optional)</label>
                                    <input name="directorEmail" type="email" placeholder="director@college.edu" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Initial Status */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                                    <Sparkles size={24} />
                                </div>
                                <h2 className="text-xl font-bold dark:text-white">Initial Automation</h2>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20 rounded-xl">
                                <div className="mt-1">
                                    <input type="checkbox" id="auto-proposal" defaultChecked className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500" />
                                </div>
                                <div>
                                    <label htmlFor="auto-proposal" className="font-bold text-gray-900 dark:text-white cursor-pointer">Generate & Draft Proposal Automatically</label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        AI will create a draft proposal based on standard templates and add it to the college files.
                                        Status will be set to <strong>Proposal Prepared</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/vendor/colleges">
                                <button type="button" className="px-6 py-3 bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-500/25 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save College
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddCollegeObj;
