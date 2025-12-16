import React from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminBilling() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">


                    <main className="md:pl-0 pt-0 min-h-screen bg-slate-50 w-full">
                        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white pb-24 pt-10 px-6 shadow-xl">
                            <div className="max-w-7xl mx-auto">
                                <h1 className="text-3xl font-bold mb-2">Billing & Subscriptions</h1>
                                <p className="text-blue-200">Platform revenue and subscription management</p>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-6 -mt-20 pb-10">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-white/10 rounded-lg">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                            <Badge variant="secondary" className="bg-emerald-400 text-emerald-900 border-none font-bold">+12%</Badge>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">$45,231</div>
                                        <div className="text-blue-100 text-sm">Total Revenue (MTD)</div>
                                    </CardContent>
                                </Card>

                                <Card className='bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none shadow-lg'>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-white/10 rounded-lg">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">$128</div>
                                        <div className="text-blue-100 text-sm">Active Subscriptions</div>
                                    </CardContent>
                                </Card>

                                <Card className='bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none shadow-lg'>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-white/10 rounded-lg">
                                                <TrendingUp className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">$890</div>
                                        <div className="text-blue-100 text-sm">Avg. Revenue Per User</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-none shadow-lg bg-white overflow-hidden">
                                <CardHeader className="border-b border-slate-100">
                                    <CardTitle>Recent Transactions</CardTitle>
                                    <CardDescription>Latest subscription payments</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-green-600">
                                                        <DollarSign className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">Enterprise Plan - Acme Corp</div>
                                                        <div className="text-xs text-slate-500">Dec {12 - i}, 2024 • ID: #INV-{2024000 + i}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="font-bold text-slate-900 text-right">$499.00</div>
                                                    <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                                                        <Download className="w-4 h-4" />
                                                        Invoice
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
