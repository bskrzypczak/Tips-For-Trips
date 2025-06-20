import { SignInButton, UserMenu } from './components/UserMenu';
import { useUser } from './hooks/UserContext';
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CitiesTab from './components/CitiesPage';
import HomeTab from './components/homePage';
import ActivitiesTab from './components/ActivitiesPage';
import SearchPage from './components/SearchPage';
import 'react-datepicker/dist/react-datepicker.css';
import './style/App.css';
import './style/CityActivity.css';
import './style/results.css'

function App() {
    const { user, loading } = useUser();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    if (loading) {
        return (
            <div className="app">
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' 
                }}>
                    <div>Ładowanie...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="app-logo" />
                </Link>
                <nav className="app-nav">
                    <Link to="/">Strona główna</Link>
                    <Link to="/cities">Miasta</Link>
                    <Link to="/activities">Atrakcje</Link>
                    <Link to="/contact">Kontakt</Link>
                </nav>
                <div className="user-info">
                    {user ? <UserMenu /> : <SignInButton />}
                </div>
            </header>
            <main className="app-main">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomeTab
                                startDate={startDate}
                                endDate={endDate}
                                setDateRange={setDateRange}
                            />
                        }
                    />
                    <Route path="/cities" element={<CitiesTab />} />
                    <Route path="/activities" element={<ActivitiesTab />} />
                    <Route path="/search" element={<SearchPage />} />
                </Routes>
            </main>
            <footer className="app-footer">
                <p>© 2025 TipsForTrips. Wszelkie prawa zastrzeżone.</p>
            </footer>
        </div>
    );
}

export default App;