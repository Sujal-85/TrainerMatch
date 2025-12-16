import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import Sidebar from '@/components/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Award,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import api from '@/lib/api';

const COLORS = ['#2563eb', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    matchSuccessData: [],
    trainerPerformanceData: [],
    categoryDistribution: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/dashboard/analytics');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const { matchSuccessData, trainerPerformanceData, categoryDistribution, matchSuccess } = data;

  // Loading check removed to allow immediate rendering


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Head>
          <title>TrainerMatch - Analytics</title>
          <meta name="description" content="Analytics dashboard for TrainerMatch" />
        </Head>

        <Sidebar />

        <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
            <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
                <p className="text-blue-100">Track key performance metrics and training insights.</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 Days
                </Button>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 -mt-16 relative z-20 pb-10">
            {/* KPI Cards */}
            {/* KPI Cards */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-0">
                      <div className="p-6 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
                            <Award className="h-6 w-6" />
                          </div>
                          <span className="flex items-center text-sm font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +5%
                          </span>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-800 mb-1">{matchSuccess}%</h3>
                          <p className="text-slate-500 text-sm font-medium">Match Success Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-0">
                      <div className="p-6 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 text-white shadow-lg shadow-cyan-500/20">
                            <Activity className="h-6 w-6" />
                          </div>
                          <span className="flex items-center text-sm font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12%
                          </span>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-800 mb-1">{trainerPerformanceData?.length || 0}</h3>
                          <p className="text-slate-500 text-sm font-medium">Active Trainers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-0">
                      <div className="p-6 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/20">
                            <Target className="h-6 w-6" />
                          </div>
                          <span className="flex items-center text-sm font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                            Top
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-1 truncate">{categoryDistribution?.[0]?.name || 'N/A'}</h3>
                          <p className="text-slate-500 text-sm font-medium">Top Category</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-0">
                      <div className="p-6 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20">
                            <FileIcon className="h-6 w-6" />
                          </div>
                          <span className="flex items-center text-sm font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                            This Month
                          </span>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-800 mb-1">12</h3>
                          <p className="text-slate-500 text-sm font-medium">Reports Generated</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="border-none shadow-lg shadow-blue-900/5">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-slate-800">Trainer Performance</CardTitle>
                      <CardDescription>Average rating scores by top trainers</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trainerPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="trainer" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 5]} fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: 'transparent' }}
                          />
                          <Bar dataKey="rating" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg shadow-blue-900/5">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-slate-800">Category Distribution</CardTitle>
                      <CardDescription>Training sessions by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryDistribution?.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap justify-center gap-4 mt-2">
                        {categoryDistribution?.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm text-slate-600 font-medium">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}