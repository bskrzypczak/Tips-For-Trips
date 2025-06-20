const API_BASE_URL = 'http://localhost:7777/api';

// Pobierz szczegóły atrakcji z komentarzami
export const getActivityDetails = async (id_atrakcji) => {
    try {
        const response = await fetch(`${API_BASE_URL}/activity/${id_atrakcji}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Błąd podczas pobierania szczegółów atrakcji');
        }
        
        return data;
    } catch (error) {
        console.error('Błąd pobierania szczegółów atrakcji:', error);
        throw error;
    }
};

// Pobierz komentarze dla atrakcji
export const getCommentsByActivity = async (id_atrakcji) => {
    try {
        const response = await fetch(`${API_BASE_URL}/activity/${id_atrakcji}/comments`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Błąd podczas pobierania komentarzy');
        }
        
        return data;
    } catch (error) {
        console.error('Błąd pobierania komentarzy:', error);
        throw error;
    }
};

// Dodaj komentarz
export const addComment = async (id_atrakcji, commentData) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Brak tokenu autoryzacji');
        }

        const response = await fetch(`${API_BASE_URL}/activity/${id_atrakcji}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Błąd podczas dodawania komentarza');
        }
        
        return data;
    } catch (error) {
        console.error('Błąd dodawania komentarza:', error);
        throw error;
    }
};

// Usuń komentarz
export const deleteComment = async (commentId) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Brak tokenu autoryzacji');
        }

        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Błąd podczas usuwania komentarza');
        }
        
        return data;
    } catch (error) {
        console.error('Błąd usuwania komentarza:', error);
        throw error;
    }
};
