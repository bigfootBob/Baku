import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { auth } from '@/data/firebaseConfig';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    hasSeenOnboarding: boolean;
    completeOnboarding: () => Promise<void>;
    signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    hasSeenOnboarding: false,
    completeOnboarding: async () => { },
    signIn: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const value = await AsyncStorage.getItem('hasSeenOnboarding');
                if (value === 'true') {
                    setHasSeenOnboarding(true);
                }
            } catch (e) {
                console.error("Failed to load onboarding status", e);
            }
        };

        checkOnboarding();

        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
                setLoading(false);
                if (!user && auth) {
                    signInAnonymously(auth).catch((error) => {
                        console.error("Auto sign-in failed", error);
                    });
                }
            });
            return unsubscribe;
        } else {
            setLoading(false);
            return () => { };
        }
    }, []);

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            setHasSeenOnboarding(true);
        } catch (e) {
            console.error("Failed to save onboarding status", e);
        }
    };

    const signIn = async () => {
        try {
            if (!user && auth) {
                await signInAnonymously(auth);
            }
        } catch (error) {
            console.error("Manual sign-in failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, hasSeenOnboarding, completeOnboarding, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}
