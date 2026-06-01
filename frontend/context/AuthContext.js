import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setStoredToken, getStoredToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        const token = getStoredToken();
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const profile = await api.getProfile();
            setUser(profile);
        } catch {
            try {
                const { accessToken } = await api.refresh();
                setStoredToken(accessToken);
                const profile = await api.getProfile();
                setUser(profile);
            } catch {
                setStoredToken(null);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (email, password) => {
        const data = await api.login({ email, password });
        setStoredToken(data.accessToken);
        setUser(data.user);
        return data.user;
    };

    const register = async (name, email, password) => {
        await api.register({ name, email, password });
        return login(email, password);
    };

    const logout = async () => {
        try {
            await api.logout();
        } finally {
            setStoredToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, reload: loadUser, isAdmin: !!user?.isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
