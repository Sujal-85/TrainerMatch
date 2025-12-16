import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth/login');
            } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
                // Redirect to unauthorized or dashboard if role prevents access
                // For now preventing access by redirecting to login or custom 403 page
                // But let's verify if user really doesn't have role
                console.warn(`User role ${userRole} not in allowedRoles ${allowedRoles}, redirecting...`);
                // e.g. router.push('/unauthorized');
                // router.push('/');
            }
        }
    }, [user, userRole, loading, router, allowedRoles]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
                <p>You do not have permission to access this page.</p>
            </div>
        );
    }

    return <>{children}</>;
};
