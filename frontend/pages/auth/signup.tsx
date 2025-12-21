import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
    updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Rocket, AlertCircle, Building2, User, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming Tabs component availability or use standard divs
import { cn } from '@/lib/utils';
import api from '@/lib/api';

import { toast } from 'sonner';

export default function Signup() {
    const [role, setRole] = useState<'vendor' | 'trainer'>('vendor');
    const [name, setName] = useState(''); // Company Name or Full Name
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [skills, setSkills] = useState(''); // Comma separated for MVP
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const toastId = toast.loading('Creating your account...');

        if (password !== confirmPassword) {
            const msg = "Passwords don't match";
            setError(msg);
            toast.error(msg, { id: toastId });
            setLoading(false);
            return;
        }

        try {
            // 1. Create User in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Profile Display Name
            await updateProfile(user, { displayName: name });

            // 3. Send additional data to backend
            const token = await user.getIdToken();

            // Build payload based on role
            const payload: any = {
                role,
                displayName: name,
                email
            };

            if (role === 'vendor') {
                payload.companyName = name;
                payload.contactNumber = contactNumber;
            } else {
                payload.fullName = name;
                payload.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
                payload.experience = experience;
                payload.location = location;
            }

            // Send additional data to backend
            // In a real app, you'd POST to your backend here.
            await api.post('/auth/sync-profile', payload);

            toast.success('Account created successfully!', { id: toastId });
            if (role === 'vendor') {
                router.push('/pricing');
            } else {
                router.push('/trainer/dashboard');
            }
        } catch (err: any) {
            console.error("Signup Error:", err);
            let msg = 'Failed to sign up.';
            if (err.code === 'auth/email-already-in-use') {
                msg = 'Email is already in use.';
            } else if (err.code === 'auth/weak-password') {
                msg = 'Password should be at least 6 characters.';
            } else if (err.response && err.response.data) {
                // Axios error from backend
                msg = `Backend Error: ${err.response.data.message || err.response.data.error || JSON.stringify(err.response.data)}`;
            } else {
                msg = `Error: ${err.message}`;
            }
            setError(msg);
            toast.error(msg, { id: toastId });
            setLoading(false);
        }
    };

    const handleSocialLogin = async (providerName: string) => {
        if (providerName === 'linkedin') {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/linkedin`;
            return;
        }

        setError(''); // Clear previous errors
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

                // Sync profile with role
                const res = await api.post('/auth/sync-profile', {
                    role,
                    displayName: user.displayName,
                    email: user.email,
                    uid: user.uid
                });

                if (role === 'vendor') {
                    router.push('/pricing');
                } else {
                    router.push('/trainer/dashboard');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(`Failed to sign up with ${providerName}.`);
        }
    };



    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0  opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />

                {/* Decor elements */}
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-xl font-bold mb-12">
                        <div className="relative transform hover:scale-105 transition-transform duration-300">
                            <img
                                src="/image-white.png"
                                alt="TrainerMatch Logo"
                                className="h-32 w-auto object-contain drop-shadow-md"
                            />
                        </div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                        Start your journey to <span className="text-purple-200">smarter training</span>
                    </h1>
                    <ul className="space-y-4 mb-8 text-lg text-indigo-100">
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Access 5,000+ verified expert trainers</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>AI-driven matching in under 5 minutes</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Zero commissions, transparent pricing</span>
                        </li>
                    </ul>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="bg-purple-500/20 p-2 rounded-full">
                            <Rocket className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                            <p className="font-semibold">Get Started Free</p>
                            <p className="text-sm text-indigo-200">No credit card required for 14-day trial</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
                        <p className="mt-2 text-slate-500">
                            Join TrainerMatch as a Vendor or Trainer
                        </p>
                    </div>

                    {/* Role Selector Tabs - Custom Implementation for clean look */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setRole('vendor')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                role === 'vendor'
                                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                        >
                            <Building2 className="w-4 h-4" />
                            I'm a Vendor
                        </button>
                        <button
                            onClick={() => setRole('trainer')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                role === 'trainer'
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                        >
                            <User className="w-4 h-4" />
                            I'm a Trainer
                        </button>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Common Fields with Role-Specific Labels */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700">
                                {role === 'vendor' ? 'Company Name' : 'Full Name'}
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={role === 'vendor' ? 'Acme Corp' : 'John Doe'}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">Email address</Label>
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

                        {/* Vendor Specific Fields */}
                        {role === 'vendor' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="contact" className="text-slate-700">Contact Number</Label>
                                <Input
                                    id="contact"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                    className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        {/* Trainer Specific Fields */}
                        {role === 'trainer' && (
                            <>
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="skills" className="text-slate-700">Skills (comma separated)</Label>
                                    <Input
                                        id="skills"
                                        type="text"
                                        placeholder="Python, React, Leadership..."
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        required
                                        className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="experience" className="text-slate-700">Experience</Label>
                                        <Input
                                            id="experience"
                                            type="text"
                                            placeholder="5 years"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            required
                                            className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-slate-700">Location</Label>
                                        <Input
                                            id="location"
                                            type="text"
                                            placeholder="New York, NY"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                            className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
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
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                />
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
                            className={cn(
                                "w-full h-11 text-base shadow-lg transition-all duration-300 transform active:scale-95 text-white",
                                role === 'vendor' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                            )}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (role === 'vendor' ? 'Create Vendor Account' : 'Create Trainer Account')}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-slate-500">
                                Or create with
                            </span>
                        </div>
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

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-indigo-600">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-indigo-600">
                            Privacy Policy
                        </Link>
                        .
                    </p>

                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                            Log in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
