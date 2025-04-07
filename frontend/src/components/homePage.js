import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; // Jeśli używasz React Router
import { debounce } from 'lodash';

function HomeTab({ startDate, endDate, setDateRange }) {
    const [city, setCity] = useState(''); // Stan dla pola tekstowego
    const [suggestions, setSuggestions] = useState([]); // Stan dla sugestii
    const [isModalOpen, setIsModalOpen] = useState(false); // Stan widoczności modala
    const [answers, setAnswers] = useState(Array(12).fill(null)); // Stan dla odpowiedzi użytkownika
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const navigate = useNavigate(); // Hook do nawigacji (React Router)
    const searchFieldEmptyRef = React.useRef(false);

    const questions = [
        {
            text: 'Czy chcesz, aby atrakcje były dostosowane do dzieci?',
            type: 'single-choice',
            options: [
                { text: 'Tak, planuję podróż z dziećmi', code: 'Yes'},
                { text: 'Interesują mnie atrakcje, które mogą zaciekawić zarówno dla dorosłych, jak i dzieci', code: 'Maybe'},
                { text: 'Nie zależy mi na atrakcjach dla dzieci', code: 'No'}
            ]
        },
        {
            text: 'Jak bardzo interesuje Cię sztuka?',
            type: 'single-choice',
            options: [
                { text: 'Uwielbiam odwiedzać galerie i wystawy sztuki', code: 'Yes'},
                { text: 'Lubię od czasu do czasu odwiedzić galerię lub wystawę', code: 'Maybe'},
                { text: 'Sztuka mnie nie interesuje', code: 'No'} 
            ]
        },
        {
            text: 'Jak ważne są dla Ciebie zabytki i historyczne miejsca?',
            type: 'single-choice',
            options: [
                { text: 'Tak, zabytki są najważniejsze', code: 'Yes'},
                { text: 'Lubię zabytki, ale nie muszą być głównym celem mojej podróży', code: 'Maybe'},
                { text: 'Nie interesują mnie zabytki', code: 'No'}   
            ]
        },
        {
            text: 'Jaki tryb zwiedzania wolisz?',
            type: 'single-choice',
            options: [
                { text: 'Chcę zobaczyć jak najwięcej, w jak najkrótszym czasie', code: 'Short'},
                { text: 'Mogę poświęcić więcej czasu na niektóre atrakcje', code: 'Medium'},
                { text: 'Chcę dokładnie poznać każde odwiedzane miejsce', code: 'Long'}    
            ]
        },
        {
            text: 'Jak wolisz spędzać czas podczas podróży?',
            type: 'slider',
            options: ['Relaks, spokojne zwiedzanie i odpoczynek', 'Obojętnie', 'Aktywne zwiedzanie i przygody na świeżym powietrzu'],
            min: 0,
            max: 10
        },
        {
            text: 'Gdzie wolisz spędzać czas podczas podróży?',
            type: 'slider',
            options: ['Centrum miasta', 'Obojętnie', 'wśród przyrody'],
            min: 0,
            max: 10
        },
        {
            text: 'Kiedy preferujesz zwiedzać atrakcje?',
            type: 'slider',
            options: ['Za dnia, przy pełnym świetle', 'Obojętnie', 'W nocy, z podświetlonymi atrakcjami'],
            min: 0,
            max: 10
        },
        {
            text: 'W jakich miejscach lepiej się czujesz?',
            type: 'slider',
            options: ['Zatłoczone, popularne miejsca pełne turystów', 'Obojętnie', 'Spokojne, mniej turystyczne miejsca'],
            min: 0,
            max: 10
        },
        {
            text: 'Jakie masz podejście do płatnych atrakcji?',
            type: 'single-choice',
            options: [
                { text: 'Chętnie zapłacę za atrakcyjne miejsca', code: 'Yes'},
                { text: 'Tylko, jeśli jest ona warta swojej ceny', code: 'Maybe'},
                { text: 'Interesują mnie tylko darmowe atrakcje', code: 'No'}      
            ]
        },
        {
            text: 'Czy lubisz poczuć adrenalinę?',
            type: 'slider',
            options: ['Uwielbiam ekstremalne atrakcje', 'Obojętnie', 'Preferuję spokojniejsze atrakcje'],
            min: 0,
            max: 10
        },
        {
            text: 'O ktorej chcesz zaczynac zwiedzanie?',
            type: 'slider',
            options: ['7:00 ', '9:30', '12:00'],
            min: 0,
            max: 10
        },
        {
            text: 'Które miejsca uważasz za ciekawe?',
            type: 'multiple-choice',
            options: [
                { text: 'Obiekty sportowe (stadiony, hale sportowe)', code: 'Sport' },
                { text: 'Kościoły, synagogi, meczety, świątynie', code: 'Religia' },
                { text: 'Galerie handlowe i pasaże', code: 'Zakupy' },
                { text: 'Ogrody zoologiczne, akwaria', code: 'Zwierzeta' },
                { text: 'Miejsca historyczne (zamki, twierdze)', code: 'Historia' },
                { text: 'Targi i lokalne rynki', code: 'Targi' },
                { text: 'Punkty widokowe', code: 'Widoki' },
                { text: 'Baseny i plaże', code: 'Woda' }]
        },
        

    ]; // Lista pytań

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Przejdź do poprzedniego pytania
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1)); // Przejdź do następnego pytania
    };

    const handleAnswer = (answerCode) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[currentQuestionIndex] = answerCode; // Zapisz odpowiedź dla aktualnego pytania
            return updatedAnswers;
        });
    };

    const handleMultipleAnswer = (optionCode) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            const currentAnswers = updatedAnswers[currentQuestionIndex] || [];
            if (currentAnswers.includes(optionCode)) {
                updatedAnswers[currentQuestionIndex] = currentAnswers.filter((code) => code !== optionCode);
            } else {
                updatedAnswers[currentQuestionIndex] = [...currentAnswers, optionCode];
            }
            return updatedAnswers;
        });
    };

    

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value);
        
        // Ustaw flagę, czy pole jest puste
        searchFieldEmptyRef.current = !value.length;
        
        // Czyść sugestie, jeśli pole jest puste
        if (searchFieldEmptyRef.current) {
            setSuggestions([]);
            return;
        }
        
        // Zapytaj bazę danych tylko o miasta zaczynające się od wpisanego tekstu
        debouncedFetchCities(value);
    };

    const debouncedFetchCities = React.useCallback(
        debounce((prefix) => {
            fetchCitiesByPrefix(prefix);
        }, 300),
        []
    );

    const fetchCitiesByPrefix = async (prefix) => {
        try {
            if (searchFieldEmptyRef.current) {
                return;
            }

            if (!prefix || typeof prefix !== 'string') {
                console.error('Nieprawidłowy prefix:', prefix);
                return;
            }
            
            // Kodowanie URL z obsługą znaków specjalnych
            const encodedPrefix = encodeURIComponent(prefix.trim());
            
            const url = `http://localhost:7777/api/cities/search?prefix=${encodedPrefix}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error('Error response:', response.status, await response.text());
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            console.log("Otrzymane sugestie miast:", data);
            
            const cityNames = Array.isArray(data) ? data.map(city => 
                typeof city === 'string' ? city : city.nazwa) : [];

            if (!searchFieldEmptyRef.current) {
                setSuggestions(cityNames);
            }

            setSuggestions(cityNames);
        } catch (error) {
            console.error("Błąd podczas pobierania sugestii miast:", error);
            setSuggestions([]);
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
    
        // Serializuj odpowiedzi jako JSON
        const serializedAnswers = answers.map((answer) => {
            if (Array.isArray(answer)) {
                return answer; // Zwróć tablicę dla pytań typu multiple-choice
            }
            return answer; // Zwróć odpowiedź dla innych typów pytań
        });
    
        console.log('Serialized answers:', serializedAnswers); // Loguj dane przed wysłaniem
    
        // Przekierowanie do strony wyszukiwania z odpowiedziami w formacie JSON
        navigate(
            `/search?city=${city}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&answers=${encodeURIComponent(JSON.stringify(serializedAnswers))}`
        );
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Zamknij modal bez przekierowania
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
                        <h2>Pytanie {currentQuestionIndex + 1} z {questions.length}</h2>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                        <p className='modal-question'>{questions[currentQuestionIndex].text}</p>
                        <div className="modal-options">
                            {questions[currentQuestionIndex].type === 'single-choice' && (
                                questions[currentQuestionIndex].options.map((option, index) => (
                                    <label key={index} className="option-label">
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestionIndex}`} // Grupa radiobuttonów dla jednego pytania
                                            value={option.code}
                                            checked={answers[currentQuestionIndex] === option.code} // Sprawdź, czy opcja jest zaznaczona
                                            onChange={() => handleAnswer(option.code)} // Obsługa zmiany
                                        />
                                        {option.text}
                                    </label>
                                ))
                            )}
                            {questions[currentQuestionIndex].type === 'slider' && (
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min={questions[currentQuestionIndex].min}
                                        max={questions[currentQuestionIndex].max}
                                        value={answers[currentQuestionIndex] || questions[currentQuestionIndex].min}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                    />
                                    <div className="slider-labels">
                                        <span>{questions[currentQuestionIndex].options[0]}</span>
                                        <span>{questions[currentQuestionIndex].options[1]}</span>
                                        <span>{questions[currentQuestionIndex].options[2]}</span>
                                    </div>
                                </div>
                            )}
                            {questions[currentQuestionIndex].type === 'multiple-choice' && (
                                questions[currentQuestionIndex].options.map((option, index) => (
                                    <label key={index} className="option-label">
                                        <input
                                            type="checkbox"
                                            value={option.code}
                                            checked={answers[currentQuestionIndex]?.includes(option.code)} // Sprawdź, czy opcja jest zaznaczona
                                            onChange={() => handleMultipleAnswer(option.code)} // Obsługa zmiany
                                        />
                                        {option.text}
                                    </label>
                                ))
                            )}
                        </div>
                        <div className="modal-actions">
                            {currentQuestionIndex > 0 && (
                                <button className = "poprzednie" onClick={handlePreviousQuestion}>
                                    Poprzednie
                                </button>
                            )}
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button className = "nastepne" onClick={handleNextQuestion}>
                                    Następne
                                </button>
                            ) : (
                                <button onClick={handleModalSubmit}>
                                    Zatwierdź
                                </button>
                            )}
                        </div>
                        <button className = "modal-back" onClick={handleModalClose}>Zamknij</button>
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