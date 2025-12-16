import React from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Star, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminTrainers() {
    const trainers = [
        { id: 1, name: "John Doe", email: "john@example.com", expertise: "React, Node.js", rating: 4.9, status: "Verified" },
        { id: 2, name: "Sarah Smith", email: "sarah@example.com", expertise: "Python, AI", rating: 4.8, status: "Pending" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", expertise: "Agile, Scrum", rating: 4.5, status: "Verified" },
        { id: 4, name: "Emily Brown", email: "emily@example.com", expertise: "UI/UX Design", rating: 0, status: "Pending" }
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">


                    <main className="md:pl-0 pt-0 min-h-screen bg-slate-50 w-full">
                        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white pb-24 pt-10 px-6 shadow-xl">
                            <div className="max-w-7xl mx-auto">
                                <h1 className="text-3xl font-bold mb-2">Trainers</h1>
                                <p className="text-blue-200">Approve and manage freelance trainers</p>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-6 -mt-20 pb-10">

                            <Card>
                                <CardContent className="p-6 bg-white rounded-lg">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative flex-1 max-w-md">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <Input placeholder="Search trainers..." className="pl-9" />
                                        </div>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead>Trainer</TableHead>
                                                    <TableHead>Expertise</TableHead>
                                                    <TableHead>Rating</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {trainers.map(trainer => (
                                                    <TableRow key={trainer.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-9 w-9">
                                                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${trainer.id}`} />
                                                                    <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium text-slate-900">{trainer.name}</div>
                                                                    <div className="text-xs text-slate-500">{trainer.email}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-slate-600">{trainer.expertise}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {trainer.rating > 0 ? (
                                                                <div className="flex items-center gap-1 text-sm text-slate-700">
                                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                    {trainer.rating}
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-slate-400">No ratings</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={
                                                                trainer.status === 'Verified'
                                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                                            }>
                                                                {trainer.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {trainer.status === 'Pending' ? (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50 hover:text-green-700">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                                                        <XCircle className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreVertical className="w-4 h-4 text-slate-400" />
                                                                </Button>
                                                            )}
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
