import React from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Building2, User, Mail, Ban, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminVendors() {
    const vendors = [
        { id: 1, name: "Acme Corp", email: "contact@acme.com", plan: "Enterprise", status: "Active", users: 12 },
        { id: 2, name: "Global Training Ltd", email: "admin@global.com", plan: "Pro", status: "Active", users: 5 },
        { id: 3, name: "StartUp Inc", email: "hello@startup.io", plan: "Basic", status: "Suspended", users: 1 },
        { id: 4, name: "Tech Solutions", email: "support@techsol.com", plan: "Pro", status: "Active", users: 8 }
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">


                    <main className="md:pl-0 pt-0 min-h-screen bg-slate-50 w-full">
                        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white pb-24 pt-10 px-6 shadow-xl">
                            <div className="max-w-7xl mx-auto flex items-end justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Vendors</h1>
                                    <p className="text-blue-200">Manage all registered organizations</p>
                                </div>
                                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                    Export CSV
                                </Button>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-6 -mt-20 pb-10">

                            <Card>
                                <CardContent className="p-6 bg-white rounded-lg">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative flex-1 max-w-md">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <Input placeholder="Search vendors..." className="pl-9" />
                                        </div>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden ">
                                        <Table className='bg-white'>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead>Organization</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Plan</TableHead>
                                                    <TableHead>Users</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {vendors.map(vendor => (
                                                    <TableRow key={vendor.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-9 w-9 border border-slate-200">
                                                                    <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">
                                                                        {vendor.name.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium text-slate-900">{vendor.name}</div>
                                                                    <div className="text-xs text-slate-500">{vendor.email}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={
                                                                vendor.status === 'Active'
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                            }>
                                                                {vendor.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">{vendor.plan}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                                <User className="w-3 h-3" />
                                                                {vendor.users}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
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
