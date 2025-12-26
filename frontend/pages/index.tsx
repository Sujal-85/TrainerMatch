import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
  Star,
  Globe,
  ShieldCheck,
  Headphones,
  Briefcase,
  BarChart,
  MessageCircle,
  Calendar,
  Search,
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react'; // Assuming lottie-react is installed

import animationData1 from './animations/AI data.json'; // Placeholder for Lottie JSON
import animationData2 from './animations/trainer.json'; // Placeholder
import animationData3 from './animations/Success.json'; // Placeholder

import { useAuth } from '@/context/AuthContext'; // Import Added

export default function Home() {
  const { user, userRole } = useAuth(); // Hook Added
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const getDestination = () => {
    if (!user) return "/auth/signup";
    if (!userRole) return "/dashboard"; // Fallback to a generic loader or common path if role is still loading

    const role = userRole.toUpperCase();
    if (role === 'VENDOR_ADMIN' || role === 'VENDOR_USER') return '/vendor/dashboard';
    if (role === 'TRAINER') return '/trainer/dashboard';
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return '/admin/dashboard';

    return '/dashboard'; // Safe fallback
  };

  const testimonials = [
    {
      name: "John Doe",
      role: "CEO, TechCorp",
      quote: "TrainerMatch revolutionized our training programs. The AI matching is spot on!",
      image: "/images/testimonial1.jpg",
      rating: 5,
    },
    {
      name: "Jane Smith",
      role: "HR Director, Innovate Inc.",
      quote: "We've saved countless hours and found the perfect trainers every time.",
      image: "/images/testimonial2.jpg",
      rating: 5,
    },
    {
      name: "Mike Johnson",
      role: "Learning Manager, Global Edu",
      quote: "The platform's interface is intuitive, and the results are outstanding.",
      image: "/images/testimonial3.jpg",
      rating: 4.5,
    },
    {
      name: "Sarah Lee",
      role: "Training Coordinator, FutureTech",
      quote: "Highly recommend for any organization looking to upskill efficiently.",
      image: "/images/testimonial4.jpg",
      rating: 5,
    },
  ];

  return (
    <>
      <Head>
        <title>TrainerMatch — AI-Powered Freelance Trainer Matching Platform</title>
        <meta name="description" content="Instantly connect with vetted, expert freelance trainers using advanced AI matching. Save time, reduce costs, guarantee fit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        <Header />

        {/* Hero Section - Enhanced Parallax, Animations, and Lottie */}
        <section className="relative min-h-[80vh] flex items-center pt-24 pb-32 px-4 overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/AI_Trainer_Matching_Video_Generation.mp4" type="video/mp4" />
            </video>
            {/* Dark/Glassmorphism Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-900/40" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>

          <div className="container relative z-10 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-left max-w-3xl"
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
                className="text-5xl md:text-6xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover Your Ideal Trainer<br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Instantly & Effortlessly
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Harness advanced AI to connect with pre-vetted expert freelance trainers, perfectly aligned with your skills requirements, teaching style, budget, and schedule.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-start items-center"
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
                  <Button size="lg" variant="outline" className="text-lg px-10 py-8 border-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 backdrop-blur-md transition-all hover:-translate-y-1">
                    Explore Features
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-10 justify-start mt-16 text-sm text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="font-medium">100% Vetted Experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-400" />
                  <span className="font-medium">98% Match Success Rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <span className="font-medium">Matches in Under 5 Minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-400" />
                  <span className="font-medium">4.9/5 Average Rating</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Added More Cards, Enhanced Staggered Animations, Images */}
        <section id="features" className="py-24 px-4 bg-background border-t border-border">
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
                { icon: FileText, title: "Define Requirements", desc: "Quickly outline expertise needed, format, timeline, and budget.", color: "from-blue-500 to-blue-600", image: "/images/define-requirements.jpg" },
                { icon: Brain, title: "Intelligent Matching", desc: "AI evaluates 50+ parameters: expertise, feedback, style compatibility, and real-time availability.", color: "from-cyan-500 to-cyan-600", image: "/images/intelligent-matching.jpg" },
                { icon: Users, title: "Review & Engage", desc: "Access detailed profiles, client testimonials, and schedule interviews instantly.", color: "from-indigo-500 to-indigo-600", image: "/images/review-engage.jpg" },
                { icon: Search, title: "Advanced Search", desc: "Filter trainers by skills, experience, and ratings with powerful search tools.", color: "from-emerald-500 to-emerald-600", image: "/images/advanced-search.jpg" },
                { icon: Calendar, title: "Schedule Management", desc: "Integrated calendar for seamless booking and availability checks.", color: "from-amber-500 to-amber-600", image: "/images/schedule-management.jpg" },
                { icon: MessageCircle, title: "Real-time Communication", desc: "Chat and video call features for instant collaboration.", color: "from-purple-500 to-purple-600", image: "/images/real-time-communication.jpg" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                >
                  <Card className="h-full border border-border shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <CardHeader>
                      <div className="relative w-full h-40 mb-4 overflow-hidden rounded-t-xl">
                        <Image src={step.image} alt={step.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
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

        {/* Benefits Section - Added More Cards, Lottie, Enhanced with Icons & Hover Effects */}
        <section className="py-24 px-4 bg-background/50 border-t border-border">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Proven Impact for Organizations
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Trusted by leading enterprises for faster, higher-quality training partnerships
              </p>
            </motion.div>

            {/* Added Lottie in Benefits */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="max-w-lg mx-auto mb-16"
            >
              <Lottie animationData={animationData2} loop={true} />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: Zap, title: "10x Faster Hiring", desc: "Reduce sourcing time dramatically", stat: "93% faster than traditional methods", color: "blue" },
                { icon: Award, title: "Elite Talent Pool", desc: "Access only top-tier verified trainers", stat: "Top 5% of professionals", color: "amber" },
                { icon: TrendingUp, title: "Superior Outcomes", desc: "Better matches drive higher engagement", stat: "+47% participant satisfaction", color: "emerald" },
                { icon: Building2, title: "Enterprise-Ready", desc: "Scalable, secure, and compliant platform", stat: "Used by 500+ companies", color: "indigo" },
                { icon: Globe, title: "Global Network", desc: "Connect with trainers worldwide", stat: "100+ countries represented", color: "cyan" },
                { icon: ShieldCheck, title: "Secure & Compliant", desc: "Data protection and compliance built-in", stat: "GDPR & ISO 27001 certified", color: "green" },
                { icon: Headphones, title: "24/7 Support", desc: "Dedicated assistance anytime", stat: "99.9% uptime guarantee", color: "purple" },
                { icon: Briefcase, title: "Custom Solutions", desc: "Tailored for your business needs", stat: "Flexible pricing models", color: "orange" },
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
                  <div className={`absolute -inset-2 bg-gradient-to-r from-${benefit.color}-600 to-cyan-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-700`} />
                  <Card className="relative bg-white border border-border shadow-xl hover:shadow-2xl h-full transition-all duration-500">
                    <CardHeader className="text-center pb-4">
                      <benefit.icon className={`w-16 h-16 mx-auto mb-5 text-${benefit.color}-600 group-hover:scale-110 transition-transform`} />
                      <CardTitle className="text-lg text-slate-900 ">{benefit.title}</CardTitle>
                      <p className="text-3xl  text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-4 tracking-tighter">
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

        {/* New Testimonials Section - With Cards, Images, Animations, Lottie */}
        <section className="py-24 px-4 bg-background border-t border-border">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                What Our Clients Say
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Hear from organizations transforming their training with TrainerMatch
              </p>
            </motion.div>

            {/* Added Lottie in Testimonials */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="max-w-md mx-auto mb-16"
            >
              <Lottie animationData={animationData3} loop={true} />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              <AnimatePresence>
                {testimonials.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  >
                    <Card className="h-full border border-border shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                      <CardHeader className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-600 shadow-md">
                          <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900">{testimonial.name}</CardTitle>
                        <CardDescription className="text-base text-slate-600">{testimonial.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 text-center italic mb-4">"{testimonial.quote}"</p>
                        <div className="flex justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-5 h-5 ${starIndex < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* New Why Choose Us Section - With More Cards, Parallax Images */}
        <section className="py-24 px-4 bg-background/50 border-t border-border">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                Why Choose TrainerMatch?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Discover the unique advantages that set us apart in trainer matching.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: BarChart, title: "Data-Driven Insights", desc: "Leverage analytics for better decision-making.", image: "/images/data-insights.jpg" },
                { icon: Briefcase, title: "Industry Expertise", desc: "Specialized in diverse sectors and skills.", image: "/images/industry-expertise.jpg" },
                { icon: Users, title: "Community Building", desc: "Foster long-term relationships and networks.", image: "/images/community-building.jpg" },
              ].map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3, duration: 0.8 }}
                  whileHover={{ y: -12 }}
                  className="relative"
                >
                  <Card className="h-full border border-border shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white overflow-hidden">
                    <motion.div
                      className="relative w-full h-48"
                      style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }} // Parallax effect on image
                    >
                      <Image src={reason.image} alt={reason.title} fill className="object-cover" />
                    </motion.div>
                    <CardHeader>
                      <reason.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <CardTitle className="text-2xl font-bold text-slate-900 text-center">{reason.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-slate-600 text-center leading-relaxed">{reason.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - More Dramatic, Added Parallax Background */}
        <section className="py-32 px-4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-transparent"
            style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 1.1]) }}
          />
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

        <footer className="py-16 border-t border-border bg-background">
          <div className="container mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-slate-600 text-lg mb-6">
                © {new Date().getFullYear()} TrainerMatch. All rights reserved.
              </p>
              <div className="flex justify-center gap-10 mb-8">
                {['Terms of Service', 'Privacy Policy', 'Contact Us', 'About Us', 'Blog'].map((item) => (
                  <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-slate-500 hover:text-blue-600 transition font-medium">
                    {item}
                  </Link>
                ))}
              </div>
              <div className="flex justify-center gap-6">
                <Link href="https://twitter.com/trainermatch" className="text-slate-500 hover:text-blue-600 transition">
                  <Globe className="w-6 h-6" />
                </Link>
                {/* Add more social icons as needed */}
              </div>
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  );
}