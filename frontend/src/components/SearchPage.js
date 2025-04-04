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

    const [matchedAttractionIds, setMatchedAttractionIds] = React.useState([]);

    const fetchMatchedActivities = async (payload) => {
        try {
            const response = await fetch('http://localhost:7777/api/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd podczas pobierania aktywności:', error);
            return null;
        }
    };

    let answers = [];
    try {
        answers = JSON.parse(decodeURIComponent(rawAnswers)); // Parsuj odpowiedzi z JSON
    } catch (error) {
        console.error('Błąd parsowania odpowiedzi:', error);
    }

    React.useEffect(() => {
        const fetchData = async () => {
            console.log('Payload wysyłany do backendu:', answers); // Loguj dane przed wysłaniem
            const matchedActivities = await fetchMatchedActivities(answers);
            console.log('Dopasowane aktywności (IDs):', matchedActivities);
            setMatchedAttractionIds(matchedActivities.map(activity => activity.id_atrakcji));
        };
        fetchData();
    }, [answers]);

    return (
        <div className="search-results">
            <h1>Wyniki wyszukiwania</h1>
            <div className="search-details">
                <p><strong>Miasto:</strong> {city}</p>
                <p><strong>Data rozpoczęcia:</strong> {new Date(startDate).toLocaleDateString()}</p>
                <p><strong>Data zakończenia:</strong> {new Date(endDate).toLocaleDateString()}</p>
                <h2>Dopasowane atrakcje (IDs):</h2>
                <ul>
                    {matchedAttractionIds.map((id, index) => (
                        <li key={index}>ID atrakcji: {id}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SearchPage;