import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const signIn = (userData) => {
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            console.error('Brak danych użytkownika do zapisu');
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        // Dodajemy dodatkową kontrolę, aby nie parsować "undefined"
        if (storedUser && storedUser !== 'undefined') {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
