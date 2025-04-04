import React, { useState, useEffect } from 'react';

function CitiesTab() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Stan dla aktualnej strony
    const [selectedCountries, setSelectedCountries] = useState(''); // Stan dla wybranego kraju
    const [isFilterVisible, setIsFilterVisible] = useState(false); // Stan widoczności listy krajów
    const itemsPerPage = 6; // Liczba kafelków na stronę

    // Funkcja do pobierania miast
    const fetchCities = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:7777/api/cities');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setCities(data);
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
        fetchCities();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtrowanie miast na podstawie wybranych krajów
    const filteredCities = selectedCountries.length > 0
        ? cities.filter((city) => selectedCountries.includes(city.kraj))
        : cities;

    const currentItems = filteredCities.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredCities.length / itemsPerPage);

    const uniqueCountries = [...new Set(cities.map((city) => city.kraj))];

    const handleCountryChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedCountries((prev) => [...prev, value]);
        } else {
            setSelectedCountries((prev) => prev.filter((country) => country !== value));
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

            {/* Sekcja filtrowania */}
            <div className="filter-section">
                <button onClick={() => setIsFilterVisible(!isFilterVisible)}>
                    Filtruj
                </button>
                <button onClick={() => setSelectedCountries([])}>
                    Wyczyść filtry
                </button>
                {isFilterVisible && (
                    <div className="filter-dropdown">
                        {uniqueCountries.map((country, index) => (
                            <label key={index} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    value={country}
                                    checked={selectedCountries.includes(country)}
                                    onChange={handleCountryChange}
                                />
                                {country}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {currentItems.length > 0 && (
                <section className="positions-section">
                    <h1 className="positions-title">Popularne kierunki</h1>
                    <div className="positions-list">
                        {currentItems.map((city, index) => (
                            <div key={index} className="position-tile">
                                <img
                                    src={`/cities/${city.nazwa.toLowerCase()}.jpg`}
                                    alt={`${city.nazwa}`}
                                    className="act-tile-image"
                                />
                                <div className="act-tile-text">
                                    {city.nazwa} - {city.kraj}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

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

export default CitiesTab;