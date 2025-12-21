import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Clock,
    Calendar,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    ExternalLink,
    Shield,
    Zap,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function BillingSettings() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await api.get('/subscriptions/current'); // Need to implement this backend route
            setSubscription(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of the billing cycle.')) return;

        const toastId = toast.loading('Cancelling subscription...');
        try {
            await api.delete(`/subscriptions/${subscription.id}`);
            toast.success('Subscription cancelled. It will remain active until the end of the period.', { id: toastId });
            fetchSubscription();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel subscription', { id: toastId });
        }
    };

    if (loading) return <div className="p-8 text-center"><RefreshCw className="animate-spin inline-block mr-2" /> Loading billing info...</div>;

    if (!subscription) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Subscription</h3>
                <p className="text-slate-500 mb-6">You are currently on the Free/Trial plan. Upgrade to unlock premium features.</p>
                <Button onClick={() => window.location.href = '/pricing'} className="bg-blue-600 hover:bg-blue-700">
                    View Pricing Plans <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        );
    }

    const isTrial = subscription.status === 'PENDING' || (subscription.trialEnd && new Date(subscription.trialEnd) > new Date());
    const trialDaysLeft = subscription.trialEnd ? Math.max(0, Math.ceil((new Date(subscription.trialEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;

    return (
        <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className={subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                {subscription.status}
                            </Badge>
                            {isTrial && <Badge className="bg-blue-100 text-blue-700">14-Day Free Trial</Badge>}
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                            {subscription.planType} Plan
                            {subscription.planType === 'MASTER' ? <Zap className="text-indigo-600" size={24} /> : <Shield className="text-blue-600" size={24} />}
                        </h2>
                        <p className="text-slate-500 mb-6 max-w-md">
                            Your subscription is managed via Razorpay. Next billing date:
                            <span className="font-bold text-slate-900"> {new Date(subscription.currentEnd).toLocaleDateString()}</span>
                        </p>

                        {isTrial && trialDaysLeft > 0 && (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3 mb-6">
                                <Clock className="text-blue-600" size={20} />
                                <span className="text-sm text-blue-800 font-medium">
                                    Trial ends in <span className="font-bold underline">{trialDaysLeft} days</span>. You won't be charged until then.
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Button onClick={() => window.location.href = '/pricing'} variant="outline" className="border-slate-200">
                            Change Plan
                        </Button>
                        {!subscription.cancelAtPeriodEnd ? (
                            <Button onClick={handleCancel} variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Cancel Subscription
                            </Button>
                        ) : (
                            <div className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-lg flex items-start gap-2 max-w-[200px]">
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                <span>Closing at end of period ({new Date(subscription.currentEnd).toLocaleDateString()})</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <CreditCard size={14} />
                            <span>ID: {subscription.razorpaySubId}</span>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                        View Billing History <ExternalLink size={14} />
                    </button>
                </div>
            </div>

            {/* Plan Features / Usage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" /> Plan Benefits
                    </h4>
                    <ul className="space-y-3">
                        {[
                            'AI-powered Requirement Matching',
                            'Auto Proposal Generation',
                            'Premium College Directory Access',
                            'Advanced Analytics Dashboard'
                        ].map((f, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                <div className="w-1 h-1 bg-slate-300 rounded-full" /> {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Zap size={18} /> Support Status
                    </h4>
                    <p className="text-indigo-100 text-sm mb-6">
                        You have {subscription.planType === 'MASTER' ? 'Priority 24/7' : 'Standard'} support active with your current plan.
                    </p>
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-bold">
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
}
