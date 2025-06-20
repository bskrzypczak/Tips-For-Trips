import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ActivitiesTab() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Stan dla aktualnej strony
    const [selectedServices, setSelectedServices] = useState([]); // Stan dla wybranych usług
    const [isFilterVisible, setIsFilterVisible] = useState(false); // Stan widoczności listy usług
    const itemsPerPage = 6; // Liczba kafelków na stronę

	// Funkcja do pobierania miast
	const fetchActivities = async () => {
		setLoading(true);
		try {
			const response = await fetch('http://localhost:7777/api/activities');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			if (Array.isArray(data)) {
				setActivities(data);
			} else {
				throw new Error('Nieprawidłowy format danych z backendu - oczekiwano tablicy');
			}
			setError(null);
		} catch (error) {
			setError(`Błąd podczas pobierania miast: ${error.message}. Upewnij się, że backend jest uruchomiony.`);
		} finally {
			setLoading(false);
		}
	};

	// Pobieranie danych przy montowaniu komponentu
	useEffect(() => {
		fetchActivities();
	}, []); // Pusta tablica zależności oznacza, że efekt wykona się tylko raz, przy montowaniu komponentu

    // Obliczanie indeksów dla aktualnej strony
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtrowanie aktywności na podstawie wybranych usług
    const filteredActivities = selectedServices.length > 0
        ? activities.filter((activity) =>
              selectedServices.every((service) => activity.uslugi.includes(service))
          )
        : activities;

    const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem); // Wyświetlane kafelki

    // Funkcja do zmiany strony
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generowanie dynamicznej paginacji
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

    // Pobranie unikalnych usług z aktywności
    const uniqueServices = [...new Set(activities.flatMap((activity) => activity.uslugi))];

    const handleServiceChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedServices((prev) => [...prev, value]);
        } else {
            setSelectedServices((prev) => prev.filter((service) => service !== value));
        }
        setCurrentPage(1); // Resetuj stronę do pierwszej po zmianie filtra
    };

    const getPagination = () => {
        const pagination = [];
        const maxVisiblePages = 1; // Liczba stron widocznych obok aktualnej
    
        // Zawsze dodaj pierwszą stronę
        pagination.push(1);
    
        // Dodaj wielokropek, jeśli aktualna strona jest większa niż maxVisiblePages + 2
        if (currentPage > maxVisiblePages + 2) {
            pagination.push('...');
        }
    
        // Dodaj strony w zakresie [currentPage - maxVisiblePages, currentPage + maxVisiblePages]
        for (let i = Math.max(2, currentPage - maxVisiblePages); i <= Math.min(totalPages - 1, currentPage + maxVisiblePages); i++) {
            pagination.push(i);
        }
    
        // Dodaj wielokropek, jeśli aktualna strona jest mniejsza niż totalPages - maxVisiblePages - 1
        if (currentPage < totalPages - maxVisiblePages - 1) {
            pagination.push('...');
        }
    
        // Zawsze dodaj ostatnią stronę, jeśli jest więcej niż jedna strona
        if (totalPages > 1) {
            pagination.push(totalPages);
        }
    
        return pagination;
    };

    const pagination = getPagination();


	return (
		<div className="positions-container">
			{loading && <p className="loading">Ładowanie...</p>}
			{error && <p className="error">{error}</p>}
			<div className="filter-section">
                <button onClick={() => setIsFilterVisible(!isFilterVisible)}>
                    Filtruj
                </button>
                <button onClick={() => setSelectedServices([])}>
                    Wyczyść filtry
                </button>
                {isFilterVisible && (
                    <div className="filter-dropdown">
                        {uniqueServices.map((service, index) => (
                            <label key={index} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    value={service}
                                    checked={selectedServices.includes(service)}
                                    onChange={handleServiceChange}
                                />
                                {service}
                            </label>
                        ))}
                    </div>
                )}
            </div>

			{currentItems.length > 0 && (
                <section className="positions-section">
                    <h1 className="positions-title">Popularne atrakcje</h1>                    <div className="positions-list">
                        {currentItems.map((activity, index) => (
                            <Link key={index} to={`/activity/${activity.id_atrakcji}`} className="position-tile">
                                <img
                                    src={`/activities/${activity.id_atrakcji}.jpg`}
                                    alt={`${activity.nazwa_atrakcji}`}
                                    className="act-tile-image"
                                />
                                <div className="act-tile-text">
                                    {activity.nazwa_atrakcji}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
			{/* Nawigacja paginacji */}
			{totalPages > 1 && (
                <div className="pagination">
                    {pagination.map((item, index) => (
                        <button
                            key={index}
                            className={`page-button ${item === currentPage ? 'active' : ''}`}
                            onClick={() => typeof item === 'number' && handlePageChange(item)}
                            disabled={item === '...'}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
		</div>
	);
}

export default ActivitiesTab;


