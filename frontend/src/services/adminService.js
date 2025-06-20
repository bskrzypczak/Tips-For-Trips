const API_BASE_URL = 'http://localhost:7777/api';

// Pomocnicza funkcja do pobierania tokena z localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Pomocnicza funkcja do tworzenia nagłówków z autoryzacją
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Statystyki administratora
export const getAdminStats = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Błąd pobierania statystyk');
    }
    
    return response.json();
};

// Zarządzanie użytkownikami
export const getAllUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Błąd pobierania użytkowników');
    }
    
    return response.json();
};

export const getUserById = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Błąd pobierania użytkownika');
    }
    
    return response.json();
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Błąd usuwania użytkownika');
    }
    
    return response.json();
};

export const updateUserRole = async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role })
    });
    
    if (!response.ok) {
        throw new Error('Błąd aktualizacji roli użytkownika');
    }
    
    return response.json();
};

// Zarządzanie atrakcjami
export const getAllAdminActivities = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/activities`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Błąd pobierania atrakcji');
    }
    
    return response.json();
};

export const createActivity = async (activityData) => {
    const response = await fetch(`${API_BASE_URL}/admin/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(activityData)
    });
    
    if (!response.ok) {
        throw new Error('Błąd tworzenia atrakcji');
    }
    
    return response.json();
};

export const updateActivity = async (activityId, activityData) => {
    const response = await fetch(`${API_BASE_URL}/admin/activities/${activityId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(activityData)
    });
    
    if (!response.ok) {
        throw new Error('Błąd aktualizacji atrakcji');
    }
    
    return response.json();
};

export const deleteActivity = async (activityId) => {
    const response = await fetch(`${API_BASE_URL}/admin/activities/${activityId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Błąd usuwania atrakcji');
    }
    
    return response.json();
};
