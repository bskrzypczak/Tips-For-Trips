import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';

function SearchPage() {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get('city');
    const startDate = queryParams.get('startDate');
    const endDate = queryParams.get('endDate');
    const rawAnswers = queryParams.get('answers');

    const [dailyPlans, setDailyPlans] = React.useState([]);
    const [currentDayIndex, setCurrentDayIndex] = React.useState(0);
    const requestSentRef = React.useRef(false);
    const [exportFormat, setExportFormat] = React.useState(null);

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
        answers = JSON.parse(decodeURIComponent(rawAnswers));
    } catch (error) {
        console.error('Błąd parsowania odpowiedzi:', error);
    }

    React.useEffect(() => {
        if (requestSentRef.current) return;

        const fetchData = async () => {
            if (!city) {
                console.error('City is undefined or null');
                return;
            }

            const payload = { startDate, endDate, miasto: city, answers };
            console.log('Sending payload:', payload);

            const dailyPlans = await fetchMatchedActivities(payload);
            if (dailyPlans) {
                setDailyPlans(dailyPlans);
            }

            requestSentRef.current = true;
        };

        fetchData();
    }, [startDate, endDate, city, answers]);

    const handlePrevDay = () => {
        setCurrentDayIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNextDay = () => {
        setCurrentDayIndex((prev) => Math.min(prev + 1, dailyPlans.length - 1));
    };

    const handleExport = (plans) => {
        if (!plans || plans.length === 0) return;

        let text = '';

        plans.forEach((day, index) => {
            text += `Dzień ${index + 1} - ${day.day}\n`;
            day.activities.forEach((activity, i) => {
                text += `  ${i + 1}. [${activity.startTime}] ${activity.nazwa_atrakcji}\n`;
            });
            text += '\n';
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'plan_wycieczki.txt';
        a.click();

        URL.revokeObjectURL(url);
    };


    const exportToTxt = (plans) => {
        if (!plans || plans.length === 0) return;

        let text = '';

        plans.forEach((day, index) => {
            text += `Dzień ${index + 1} - ${day.day}\n`;
            day.activities.forEach((activity, i) => {
                text += `  ${i + 1}. [${activity.startTime}] ${activity.nazwa_atrakcji}\n`;
            });
            text += '\n';
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'plan_wycieczki.txt';
        a.click();

        URL.revokeObjectURL(url);
    };

    const exportToPdf = (plans) => {
        if (!plans || plans.length === 0) return;

        const doc = new jsPDF();
        let y = 10;

        plans.forEach((day, index) => {
            doc.setFontSize(16);
            doc.text(`Dzień ${index + 1} - ${day.day}`, 10, y);
            y += 10;
            doc.setFontSize(12);
            day.activities.forEach((activity, i) => {
                const line = `${i + 1}. [${activity.startTime}] ${activity.nazwa_atrakcji}`;
                doc.text(line, 12, y);
                y += 8;
                if (y > 280) { // nowa strona jeśli brakuje miejsca
                    doc.addPage();
                    y = 10;
                }
            });
            y += 10;
        });

        doc.save('plan_wycieczki.pdf');
    };

    const handleExportClick = (format) => {
        if (format === 'txt') {
            exportToTxt(dailyPlans);
        } else if (format === 'pdf') {
            exportToPdf(dailyPlans);
        }
        setExportFormat(null); // schowaj dropdown po eksporcie
    };


    const currentDay = dailyPlans[currentDayIndex];

    return (
        <div className="search-results">
            <section className="positions-section">
                <div className="day-header">
                    <button onClick={handlePrevDay} disabled={currentDayIndex === 0}>
                        ⬅
                    </button>
                    <h1 className="day-title">
                        {currentDay ? currentDay.day : "Ładowanie..."}
                    </h1>
                    <button onClick={handleNextDay} disabled={currentDayIndex === dailyPlans.length - 1}>
                        ➡
                    </button>

                    <div className="export-container">
                        <button
                            onClick={() => setExportFormat(exportFormat ? null : 'txt')}
                            className="export-button"
                            >
                            📄 Eksportuj plan
                        </button>

                        {exportFormat && (
                        <div className="export-dropdown">
                            <button
                                onClick={() => {
                                    handleExportClick('txt');
                                }}
                                className="export-option"
                                >
                                TXT
                            </button>
                            <button
                                onClick={() => {
                                    handleExportClick('pdf');
                                }}
                                className="export-option"
                                >
                                PDF
                            </button>
                        </div>
                        )}
                    </div>
                </div>
                <div className="positions-list">
                    {currentDay &&
                        currentDay.activities.map((activity, index) => (
                            <div key={index} className="position-tile">
                                <img
                                    src={`/activities/${activity.id_atrakcji}.jpg`}
                                    alt={activity.nazwa_atrakcji}
                                    className="act-tile-image"
                                />
                                <div className="act-tile-text">
                                    <strong>{activity.startTime}</strong> — {activity.nazwa_atrakcji}
                                </div>
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
}

export default SearchPage;
