import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, logout as logoutService, isAuthenticated } from '../services/authService';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signIn = (userData, token) => {
        if (userData) {
            setUser(userData);
        } else {
            console.error('Brak danych użytkownika do zapisu');
        }
    };

    const signOut = async () => {
        logoutService();
        setUser(null);
    };

    useEffect(() => {
        const loadUser = async () => {
            if (isAuthenticated()) {
                try {
                    const response = await getProfile();
                    setUser(response.user);
                } catch (error) {
                    console.error('Błąd ładowania profilu:', error);
                    logoutService();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, signIn, signOut, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
