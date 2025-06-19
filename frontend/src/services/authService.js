const API_BASE_URL = 'http://localhost:7777/api/auth';

// Funkcja pomocnicza do wykonywania requestów
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Coś poszło nie tak');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Rejestracja użytkownika
export const register = async (userData) => {
    const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    if (response.token) {
        localStorage.setItem('authToken', response.token);
    }

    return response;
};

// Logowanie użytkownika
export const login = async (credentials) => {
    const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

    if (response.token) {
        localStorage.setItem('authToken', response.token);
    }

    return response;
};

// Wylogowanie użytkownika
export const logout = () => {
    localStorage.removeItem('authToken');
};

// Pobieranie profilu użytkownika
export const getProfile = async () => {
    return await apiRequest('/profile');
};

// Aktualizacja profilu użytkownika
export const updateProfile = async (profileData) => {
    return await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
};

// Sprawdzanie czy użytkownik jest zalogowany
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
};

// Pobieranie tokenu
export const getToken = () => {
    return localStorage.getItem('authToken');
};
