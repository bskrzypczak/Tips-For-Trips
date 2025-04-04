import React from 'react';
import { useLocation } from 'react-router-dom';

function SearchPage() {
    const location = useLocation();

    // Parsowanie parametrów URL
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get('city');
    const startDate = queryParams.get('startDate');
    const endDate = queryParams.get('endDate');
    const rawAnswers = queryParams.get('answers');


    let answers = [];
    try {
        answers = JSON.parse(decodeURIComponent(rawAnswers)); // Parsuj odpowiedzi z JSON
    } catch (error) {
        console.error('Błąd parsowania odpowiedzi:', error);
    }

    return (
        <div className="search-results">
            <h1>Wyniki wyszukiwania</h1>
            <div className="search-details">
                <p><strong>Miasto:</strong> {city}</p>
                <p><strong>Data rozpoczęcia:</strong> {new Date(startDate).toLocaleDateString()}</p>
                <p><strong>Data zakończenia:</strong> {new Date(endDate).toLocaleDateString()}</p>
                <h2>Odpowiedzi (JSON):</h2>
                <pre>{JSON.stringify(answers, null, 2)}</pre> {/* Wyświetl JSON w formacie czytelnym */}
            </div>
        </div>
    );
}

export default SearchPage;