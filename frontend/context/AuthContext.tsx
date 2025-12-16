import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface AuthContextType {
    user: User | null;
    userRole: string | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userRole: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get token for API calls
                try {
                    // Force token refresh to ensure we have valid token
                    // const token = await firebaseUser.getIdToken(true); 
                    // No need to manually set localStorage as api.ts does it or we use firebaseUser.getIdToken()

                    // Temporarily set user without role while fetching
                    setUser(firebaseUser);

                    // Fetch full profile from backend to get role
                    // Note: accessing api here might be tricky if it depends on AuthContext state being ready
                    // But api.ts uses auth.currentUser which is independent of React state
                    // We need to import api directly
                    const token = await firebaseUser.getIdToken();

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const profile = await response.json();
                        setUserRole(profile.role);
                    } else {
                        console.error('Failed to fetch user profile');
                        setUserRole(null);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserRole(null);
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await firebaseSignOut(auth);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, userRole, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
