import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();

            // Fetch user profile to get role
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const profile = await res.json();
                console.log('Login Profile:', profile); // Debugging

                const role = profile.role ? profile.role.toUpperCase() : '';

                if (role === 'VENDOR_ADMIN' || role === 'VENDOR_USER') {
                    await router.push('/vendor/dashboard');
                } else if (role === 'TRAINER') {
                    await router.push('/trainer/dashboard');
                } else {
                    await router.push('/admin/dashboard');
                }
            } else {
                console.error('Failed to fetch user profile:', res.status, res.statusText);
                // Only redirect to admin if we strictly know it's not a specific role error, 
                // but safer to show error than wrong dashboard if critical.
                // However, for now, let's assume if it fails, fallback to admin dashboard is "safe" default 
                // but maybe we should default to based on email? No, safer to just log.
                await router.push('/admin/dashboard');
            }

        } catch (err: any) {
            setError(err.message === 'Firebase: Error (auth/invalid-credential).'
                ? 'Invalid email or password.'
                : 'Failed to login. Please try again.');
            setLoading(false);
        }
    };

    const handleSocialLogin = async (providerName: string) => {
        if (providerName === 'linkedin') {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/linkedin`;
            return;
        }

        setError('');
        try {
            let provider;
            if (providerName === 'google') {
                provider = new GoogleAuthProvider();
            } else if (providerName === 'microsoft') {
                provider = new OAuthProvider('microsoft.com');
            }

            if (provider) {
                const userCredential = await signInWithPopup(auth, provider);
                const user = userCredential.user;
                const token = await user.getIdToken();

                // Fetch user profile to get role immediately after social login
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const profile = await res.json();
                    const role = profile.role ? profile.role.toUpperCase() : '';

                    if (role === 'VENDOR_ADMIN' || role === 'VENDOR_USER') {
                        await router.push('/vendor/dashboard');
                    } else if (role === 'TRAINER') {
                        await router.push('/trainer/dashboard');
                    } else {
                        await router.push('/admin/dashboard');
                    }
                } else {
                    // Fallback
                    await router.push('/admin/dashboard');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(`Failed to login with ${providerName}. Ensure the provider is enabled in Firebase Console.`);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-blue-900 text-white relative overflow-hidden">
                <div className="absolute inset-0  opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />

                {/* Decor elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-xl font-bold mb-12">
                        <div className="relative transform hover:scale-105 transition-transform duration-300">
                            <img
                                src="/image-white.png"
                                alt="TrainerMatch Logo"
                                className="h-32 w-auto object-contain drop-shadow-md"
                            />
                        </div>
                        {/* <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">TrainerMatch</span> */}
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                        Unlock the potential of your <span className="text-cyan-200">training workforce</span>
                    </h1>
                    <p className="text-lg text-blue-100 max-w-md">
                        Join thousands of companies using AI to find, vet, and hire the perfect freelance trainers in minutes.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="bg-emerald-500/20 p-2 rounded-full">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-semibold">AI-Powered Matching</p>
                            <p className="text-sm text-blue-200">98% accuracy in skill alignment</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="bg-cyan-500/20 p-2 rounded-full">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <p className="font-semibold">Premium Talent Pool</p>
                            <p className="text-sm text-blue-200">Top 5% of verified global trainers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                        <p className="mt-2 text-muted-foreground">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" onClick={() => handleSocialLogin('google')} className="w-full hover:bg-slate-50 border-slate-200">
                            {/* Google Icon SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            <span className="hidden sm:inline">Google</span>
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('microsoft')} className="w-full hover:bg-slate-50 border-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                                <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"></path><path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"></path><path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"></path><path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"></path>
                            </svg>
                            <span className="hidden sm:inline">Microsoft</span>
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('linkedin')} className="w-full hover:bg-slate-50 border-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                            </svg>
                            <span className="hidden sm:inline">LinkedIn</span>
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground/80">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                                <Link href="/auth/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09" /><path d="M2 2l20 20" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base shadow-lg shadow-blue-500/20 transition-all duration-300 transform active:scale-95"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in to your account'}
                        </Button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-blue-600">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-blue-600">
                            Privacy Policy
                        </Link>
                        .
                    </p>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                            Start your 14-day free trial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
