import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; // Jeśli używasz React Router

function HomeTab({ startDate, endDate, setDateRange }) {
    const [city, setCity] = useState(''); // Stan dla pola tekstowego
    const [suggestions, setSuggestions] = useState([]); // Stan dla sugestii
    const [isModalOpen, setIsModalOpen] = useState(false); // Stan widoczności modala
    const [preferences, setPreferences] = useState([]); // Stan dla preferencji użytkownika
    const navigate = useNavigate(); // Hook do nawigacji (React Router)

    // Lista miast (może być pobierana z API)
    const cities = ['Barcelona', 'Paryż', 'Rzym', 'Warszawa', 'Berlin', 'Londyn', 'Nowy Jork'];

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value);

        // Filtruj sugestie na podstawie wpisanego tekstu
        if (value.length > 0) {
            const filteredSuggestions = cities.filter((city) =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]); // Jeśli pole jest puste, usuń sugestie
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(suggestion); // Ustaw wybrane miasto w polu tekstowym
        setSuggestions([]); // Ukryj listę sugestii
    };

    const handleSearch = () => {
        if (!city || !startDate || !endDate) {
            alert('Proszę wypełnić wszystkie pola!');
            return;
        }
        setIsModalOpen(true); // Otwórz modal
    };

    const handleModalSubmit = () => {
        setIsModalOpen(false); // Zamknij modal
        navigate(`/search?city=${city}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&preferences=${preferences.join(',')}`);
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Zamknij modal bez przekierowania
    };

    const togglePreference = (preference) => {
        setPreferences((prev) =>
            prev.includes(preference)
                ? prev.filter((item) => item !== preference) // Usuń, jeśli już istnieje
                : [...prev, preference] // Dodaj, jeśli nie istnieje
        );
    };

    return (
        <div>
            <section className='destination-and-date'>
                <h1 className='main-motto'>Odkrywaj świat tak, jak lubisz</h1>
                <p className='main-description'>TipsForTrips to aplikacja, która tworzy spersonalizowane plany zwiedzania miast, 
                    dostosowane do Twoich preferencji. Odkryj najlepsze atrakcje, restauracje i ukryte perełki, niezależnie od tego, 
                    czy interesuje Cię historia, kulinaria, czy aktywny wypoczynek.</p>
                <div className='search-bar'>
                    <div className='input-wrapper'>
                        <input
                            type="text"
                            className='city-search'
                            placeholder="Wybierz miasto"
                            value={city} // Powiązanie wartości z polem tekstowym
                            onChange={handleCityChange} // Obsługa wpisywania tekstu
                        />
                        {/* Lista sugestii */}
                        {suggestions.length > 0 && (
                            <ul className="search-suggestions-list">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="search-suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)} // Obsługa kliknięcia na sugestię
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => setDateRange(update)} // Aktualizacja zakresu dat
                        isClearable
                        placeholderText="Wybierz termin"
                        className="date-search"
                    />
                    <button className='search-button' onClick={handleSearch}>Szukaj</button>
                </div> 
            </section>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Dodatkowe pytania</h2>
                        <p>Wybierz swoje preferencje:</p>
                        <div className="modal-options">
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => togglePreference('Historia')}
                                />
                                Historia
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => togglePreference('Kulinaria')}
                                />
                                Kulinaria
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => togglePreference('Aktywny wypoczynek')}
                                />
                                Aktywny wypoczynek
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleModalSubmit}>Zatwierdź</button>
                            <button onClick={handleModalClose}>Anuluj</button>
                        </div>
                    </div>
                </div>
            )}
            <section className='sugestions'>   
                <h1 className='sugestions-title'>Popularne kierunki</h1>
                <div className='sugestions-list'>
                    <div className='sugestion-tile'>
                        <img src="/destination1.jpg" alt="Kierunek 1" className="tile-image" />
                        <div className="tile-text">Barcelona</div>
                    </div>
                    <div className='sugestion-tile'>
                        <img src="/destination2.jpg" alt="Kierunek 2" className="tile-image" />
                        <div className="tile-text">Paryż</div>
                    </div>
                    <div className='sugestion-tile'>
                        <img src="/destination3.jpg" alt="Kierunek 3" className="tile-image" />
                        <div className="tile-text">Rzym</div>
                    </div>
                    <div className='sugestion-tile'>
                        <img src="/destination4.jpg" alt="Kierunek 4" className="tile-image" />
                        <div className="tile-text">Warszawa</div>
                    </div>
                </div>    
            </section>
        </div>
    );
}

export default HomeTab;