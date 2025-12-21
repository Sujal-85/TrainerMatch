import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Rocket, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/sidebar';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

const PLANS = [
    {
        id: 'STARTER',
        name: 'Starter',
        description: 'Perfect for small vendors starting their journey.',
        monthlyPrice: 1999,
        yearlyPrice: 19990,
        features: ['Up to 5 Colleges', 'Manage 10 Requirements', 'Basic AI Matching', 'Email Support'],
        icon: Rocket,
        color: 'blue',
    },
    {
        id: 'MASTER',
        name: 'Master',
        description: 'Advanced features for growing training businesses.',
        monthlyPrice: 4999,
        yearlyPrice: 49990,
        features: ['Unlimited Colleges', 'Unlimited Requirements', 'Priority AI Matching', 'WhatsApp Reminders', 'Expert Support'],
        icon: Zap,
        color: 'indigo',
        popular: true,
    },
    {
        id: 'CUSTOM',
        name: 'Enterprise',
        description: 'Custom solutions for big vendors and organizations.',
        price: 'Custom',
        features: ['Dedicated Account Manager', 'Custom AI Workflows', 'White-label Proposals', 'SLA Support', 'On-premise Deployment'],
        icon: Shield,
        color: 'slate',
    },
];

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleSubscribe = async (plan: any) => {
        if (plan.id === 'CUSTOM') {
            window.location.href = 'mailto:sales@trainermatch.com';
            return;
        }

        setLoading(plan.id);
        const toastId = toast.loading('Initiating subscription...');

        try {
            const response = await api.post('/subscriptions/create', {
                planType: plan.id,
                billingCycle,
            });

            const { razorpaySubId, id: subId } = response.data;

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: razorpaySubId,
                name: 'TrainerMatch',
                description: `${plan.name} Plan - ${billingCycle}`,
                image: '/image.png',
                handler: function (response: any) {
                    toast.success('Subscription started successfully!', { id: toastId });
                    router.push('/vendor/dashboard');
                },
                prefill: {
                    name: '', // Will be filled by Razorpay if info available
                    email: '',
                    contact: '',
                },
                notes: {
                    subId: subId,
                },
                theme: {
                    color: '#2563eb',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to start subscription', { id: toastId });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head>
                <title>Pricing - TrainerMatch</title>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            </Head>

            <Sidebar />

            <main className="md:ml-64 pt-0 transition-all duration-300 min-h-screen">
                <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white pb-32 pt-16 px-6">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    <div className="container mx-auto text-center relative z-10">
                        <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4 px-4 py-1">
                            Flexible Plans
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            Pricing that grows with <span className="text-blue-200">your business</span>
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Start your 14-day free trial today. Cancel anytime. No hidden fees.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className={`text-sm font-medium ${billingCycle === 'MONTHLY' ? 'text-white' : 'text-blue-200'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
                                className="relative w-14 h-7 bg-white/20 rounded-full p-1 transition-colors duration-200 focus:outline-none ring-2 ring-white/10"
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${billingCycle === 'YEARLY' ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-sm font-medium ${billingCycle === 'YEARLY' ? 'text-white' : 'text-blue-200'}`}>
                                Yearly <span className="ml-1 text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full">Save 20%</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 -mt-24 relative z-20 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {PLANS.map((plan) => {
                            const Icon = plan.icon;
                            const isCustom = plan.id === 'CUSTOM';
                            const price = isCustom
                                ? plan.price
                                : (billingCycle === 'MONTHLY'
                                    ? (plan.monthlyPrice ?? 0)
                                    : Math.floor((plan.yearlyPrice ?? 0) / 12));

                            return (
                                <motion.div
                                    key={plan.id}
                                    whileHover={{ y: -10 }}
                                    className={`relative bg-white rounded-3xl p-8 shadow-xl border-t-4 ${plan.popular ? 'border-indigo-500 scale-105 z-10' : 'border-transparent shadow-slate-200/50'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Sparkles size={12} /> Most Popular
                                        </div>
                                    )}

                                    <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-50 flex items-center justify-center mb-6`}>
                                        <Icon className={`w-8 h-8 text-${plan.color}-600`} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{plan.description}</p>

                                    <div className="mb-8">
                                        {isCustom ? (
                                            <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                        ) : (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold text-slate-900">₹{price.toLocaleString()}</span>
                                                <span className="text-slate-400 font-medium">/mo</span>
                                            </div>
                                        )}
                                        {!isCustom && (
                                            <p className="text-xs text-slate-400 mt-2">
                                                {billingCycle === 'YEARLY' ? `Billed ₹${(plan.yearlyPrice ?? 0).toLocaleString()} annually` : 'Billed monthly'}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={loading !== null}
                                        className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg transition-all ${plan.popular
                                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                            : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                                            }`}
                                    >
                                        {loading === plan.id ? 'Loading...' : (isCustom ? 'Contact Sales' : 'Start 14-day Free Trial')}
                                    </Button>

                                    <div className="mt-8 space-y-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">What's included</p>
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 text-slate-600">
                                                <div className={`p-0.5 rounded-full bg-${plan.color}-100`}>
                                                    <Check className={`w-3.5 h-3.5 text-${plan.color}-600`} />
                                                </div>
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* FAQ or Trust Section */}
                    <div className="mt-24 max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12">Frequently Asked Questions</h2>
                        <div className="grid gap-6 text-left">
                            {[
                                { q: "How does the 14-day trial work?", a: "You'll get full access to all features of your selected plan. You won't be charged until the 14th day. You can cancel at any time before the trial ends." },
                                { q: "Can I upgrade or downgrade later?", a: "Yes, you can change your plan at any time from your account settings. Changes will be applied at the start of your next billing cycle." },
                                { q: "Is my payment information secure?", a: "We use Razorpay for all transactions. Your information is encrypted and we never store your credit card details on our servers." }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <HelpCircle size={18} className="text-blue-500" /> {faq.q}
                                    </h4>
                                    <p className="text-slate-600 text-sm">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-16 p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <Shield className="text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-slate-900">Need a custom plan for your organization?</h4>
                                    <p className="text-slate-500 text-sm">Talk to our experts for a tailored solution.</p>
                                </div>
                            </div>
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-100 font-bold px-8">
                                Request a Demo <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
