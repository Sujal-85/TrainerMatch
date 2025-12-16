import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import {
  FileText,
  Users,
  Brain,
  Zap,
  TrendingUp,
  Award,
  Building2,
  Clock,
  Sparkles,
  Target,
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { useAuth } from '@/context/AuthContext'; // Import Added

export default function Home() {
  const { user, userRole } = useAuth(); // Hook Added
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const getDestination = () => {
    if (!user) return "/auth/signup";
    if (userRole === 'VENDOR_ADMIN' || userRole === 'VENDOR_USER') return '/vendor/dashboard';
    if (userRole === 'TRAINER') return '/trainer/dashboard';
    return '/admin/dashboard';
  };


  return (
    <>
      <Head>
        <title>TrainerMatch — AI-Powered Freelance Trainer Matching Platform</title>
        <meta name="description" content="Instantly connect with vetted, expert freelance trainers using advanced AI matching. Save time, reduce costs, guarantee fit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <Header />

        {/* Hero Section - Enhanced Parallax & Animations */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-600/5 to-transparent"
            style={{ y: backgroundY }}
          />

          {/* Enhanced floating elements */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
            animate={{ y: [0, -40, 0], x: [0, 30, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ y: [0, 40, 0], x: [0, -40, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-20 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 18, repeat: Infinity }}
          />

          <div className="container relative z-10 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-3 rounded-full text-sm font-semibold mb-8 shadow-md"
              >
                <Sparkles className="w-5 h-5" />
                AI-Powered Precision Matching Engine
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover Your Ideal Trainer<br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                  Instantly & Effortlessly
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Harness advanced AI to connect with pre-vetted expert freelance trainers, perfectly aligned with your skills requirements, teaching style, budget, and schedule.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Link href={getDestination()}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-12 py-8 rounded-2xl shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-2 hover:scale-105 flex items-center gap-3">
                    {user ? "Go to Dashboard" : "Start Matching Now"} <ArrowRight className="w-6 h-6" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-8 border-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 hover:text-blue-700 border-slate-300 hover:border-blue-300 backdrop-blur-sm transition-all hover:-translate-y-1">
                    Explore Features
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-10 justify-center mt-16 text-sm text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="font-medium">100% Vetted Experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">98% Match Success Rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-cyan-600" />
                  <span className="font-medium">Matches in Under 5 Minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-500" />
                  <span className="font-medium">4.9/5 Average Rating</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Enhanced Staggered Animations */}
        <section id="features" className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                Seamless AI-Driven Process
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From specification to selection — intelligent, efficient, and human-centered.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                { icon: FileText, title: "Define Requirements", desc: "Quickly outline expertise needed, format, timeline, and budget.", color: "from-blue-500 to-blue-600" },
                { icon: Brain, title: "Intelligent Matching", desc: "AI evaluates 50+ parameters: expertise, feedback, style compatibility, and real-time availability.", color: "from-cyan-500 to-cyan-600" },
                { icon: Users, title: "Review & Engage", desc: "Access detailed profiles, client testimonials, and schedule interviews instantly.", color: "from-indigo-500 to-indigo-600" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3, duration: 0.8, ease: "easeOut" }}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                >
                  <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <CardHeader>
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="text-4xl text-blue-600/20">{i + 1}.</span> {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg text-slate-600 leading-relaxed">
                        {step.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section - Enhanced with Icons & Hover Effects */}
        <section className="py-24 px-4 bg-gradient-to-b from-blue-50/50 to-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                Proven Impact for Organizations
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Trusted by leading enterprises for faster, higher-quality training partnerships
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: Zap, title: "10x Faster Hiring", desc: "Reduce sourcing time dramatically", stat: "93% faster than traditional methods", color: "blue" },
                { icon: Award, title: "Elite Talent Pool", desc: "Access only top-tier verified trainers", stat: "Top 5% of professionals", color: "amber" },
                { icon: TrendingUp, title: "Superior Outcomes", desc: "Better matches drive higher engagement", stat: "+47% participant satisfaction", color: "emerald" },
                { icon: Building2, title: "Enterprise-Ready", desc: "Scalable, secure, and compliant platform", stat: "Used by 500+ companies", color: "indigo" },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -16, scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
                  className="relative group"
                >
                  <div className={`absolute -inset-2 bg-gradient-to-r from-${benefit.color || 'blue'}-600 to-cyan-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-700`} />
                  <Card className="relative bg-white border-0 shadow-xl hover:shadow-2xl h-full transition-all duration-500">
                    <CardHeader className="text-center pb-4">
                      <benefit.icon className={`w-16 h-16 mx-auto mb-5 text-${benefit.color || 'blue'}-600 group-hover:scale-110 transition-transform`} />
                      <CardTitle className="text-2xl font-bold text-slate-900">{benefit.title}</CardTitle>
                      <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-4">
                        {benefit.stat}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-center text-base leading-relaxed">{benefit.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - More Dramatic */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-transparent" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-blue-700 via-cyan-600 to-indigo-700 p-16 md:p-24 text-center text-white shadow-3xl relative"
            >
              <motion.div
                className="absolute inset-0 bg-black/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light" />

              <div className="relative z-20">
                <motion.h2
                  className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Elevate Your Training Programs Today
                </motion.h2>
                <motion.p
                  className="text-2xl md:text-3xl mb-12 opacity-95 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Join over 5,000 forward-thinking organizations transforming how they source expert trainers.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 text-2xl px-16 py-10 rounded-3xl font-bold shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300">
                      Start Your Free 14-Day Trial
                    </Button>
                  </Link>
                </motion.div>
                <motion.p
                  className="mt-8 text-xl opacity-90"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  No credit card required • Immediate access • Cancel anytime
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="py-16 border-t bg-white">
          <div className="container mx-auto max-w-7xl text-center">
            <p className="text-slate-600 text-lg">
              © {new Date().getFullYear()} TrainerMatch. All rights reserved.
            </p>
            <div className="flex justify-center gap-10 mt-8">
              {['Terms of Service', 'Privacy Policy', 'Contact Us'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-slate-500 hover:text-blue-600 transition font-medium">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}