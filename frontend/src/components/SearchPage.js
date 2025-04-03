import React from 'react';
import { useLocation } from 'react-router-dom';

function SearchPage() {
    const location = useLocation();

    // Parsowanie parametrów URL
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get('city');
    const startDate = queryParams.get('startDate');
    const endDate = queryParams.get('endDate');
    const preferences = queryParams.get('preferences')?.split(',') || []; // Rozdziel preferencje na tablicę

    return (
        <div className="search-results">
            <h1>Wyniki wyszukiwania</h1>
            <div className="search-details">
                <p><strong>Miasto:</strong> {city}</p>
                <p><strong>Data rozpoczęcia:</strong> {new Date(startDate).toLocaleDateString()}</p>
                <p><strong>Data zakończenia:</strong> {new Date(endDate).toLocaleDateString()}</p>
                <p><strong>Preferencje:</strong> {preferences.length > 0 ? preferences.join(', ') : 'Brak'}</p>
            </div>
            {/* Możesz dodać tutaj wyniki wyszukiwania na podstawie tych danych */}
        </div>
    );
}

export default SearchPage;