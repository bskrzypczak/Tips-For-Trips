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

    const [matchedActivities, setMatchedActivities] = React.useState([]);
    const requestSentRef = React.useRef(false); // Ref do śledzenia, czy żądanie zostało wysłane

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
        if (requestSentRef.current) {
            return;
        }
        
        const fetchData = async () => {
            if (!city) {
                console.error('City is undefined or null');
                return;
            }
            
            const payload = { miasto: city, answers };
            console.log('Sending payload:', payload);
            
            const matchedActivities = await fetchMatchedActivities(payload);


            if (matchedActivities) {
                setMatchedActivities(matchedActivities); // Ustaw dane w stanie
            }

            
            requestSentRef.current = true;
        };
        
        fetchData();
    }, [city, answers]); // Zależności pozostają takie same

    return (
        <div className="search-results">
                <section className="positions-section">
                    <h1 className="positions-title">Proponowane dla Ciebie</h1>
                    <div className="positions-list">
                        {matchedActivities.map((activity, index) => (
                            <div key={index} className="position-tile">
                                <img
                                    src={`/activities/${activity.id_atrakcji}.jpg`}
                                    alt={`${activity.nazwa_atrakcji}`}
                                    className="act-tile-image"
                                />
                                <div className="act-tile-text">
                                    {activity.nazwa_atrakcji}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
        </div>
    );
}

export default SearchPage;