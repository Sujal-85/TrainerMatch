import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { Spinner } from '@/components/ui/spinner';

export default function LinkedInCallback() {
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        const { token } = router.query;

        if (!router.isReady) return;

        if (token && typeof token === 'string') {
            const toastId = toast.loading('Verifying LinkedIn login...');
            signInWithCustomToken(auth, token)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    const idToken = await user.getIdToken();

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${idToken}`
                        }
                    });

                    toast.success('LinkedIn login successful!', { id: toastId });

                    if (res.ok) {
                        const profile = await res.json();
                        const role = profile.role ? profile.role.toUpperCase() : '';

                        if (role === 'VENDOR_ADMIN' || role === 'VENDOR_USER') {
                            return router.push('/vendor/dashboard');
                        } else if (role === 'TRAINER') {
                            return router.push('/trainer/dashboard');
                        }
                    }

                    // Default Fallback
                    router.push('/admin/dashboard');
                })
                .catch((err) => {
                    console.error('Login Failed', err);
                    setError('Failed to log in with LinkedIn. Please try again.');
                    toast.error('LinkedIn login failed.', { id: toastId });
                    setTimeout(() => router.push('/auth/login'), 3000);
                });
        } else {
            // If no token, maybe check if there's an error param
            const { error } = router.query;
            if (error) {
                setError('LinkedIn authentication failed.');
                toast.error('LinkedIn authentication failed.');
                setTimeout(() => router.push('/auth/login'), 3000);
            }
        }
    }, [router.isReady, router.query, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            {error ? (
                <div className="text-red-500 font-medium text-lg">{error}</div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-slate-600 font-medium">Authenticating with LinkedIn...</p>
                </div>
            )}
        </div>
    );
}
