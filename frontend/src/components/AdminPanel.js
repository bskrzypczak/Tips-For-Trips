import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/UserContext';
import { getAdminStats } from '../services/adminService';
import UserManagement from './admin/UserManagement';
import ActivityManagement from './admin/ActivityManagement';
import '../style/AdminPanel.css';

function AdminPanel() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getAdminStats();
            setStats(response.stats);
            setError(null);
        } catch (err) {
            setError('Błąd podczas pobierania statystyk: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Sprawdź czy użytkownik ma uprawnienia administratora
    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-panel">
                <div className="access-denied">
                    <h2>Brak dostępu</h2>
                    <p>Ta strona jest dostępna tylko dla administratorów.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="admin-panel">
                <div className="loading">Ładowanie panelu administratora...</div>
            </div>
        );
    }    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Panel Administratora</h1>
                <p>Witaj, {user.firstName} {user.lastName}</p>
            </div>

            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Użytkownicy
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'activities' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activities')}
                >
                    Atrakcje
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'dashboard' && (
                    <div className="admin-dashboard">
                        <h2>Statystyki systemu</h2>
                        {error && <div className="error-message-global">{error}</div>}
                        {stats && (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-number">{stats.users.total}</div>
                                    <div className="stat-label">Użytkownicy</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{stats.users.admins}</div>
                                    <div className="stat-label">Administratorzy</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{stats.activities}</div>
                                    <div className="stat-label">Atrakcje</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{stats.cities}</div>
                                    <div className="stat-label">Miasta</div>
                                </div>
                            </div>
                        )}
                        
                        {stats && stats.recentUsers && (
                            <div className="recent-users">
                                <h3>Ostatnio zarejestrowani użytkownicy</h3>
                                <div className="users-list">
                                    {stats.recentUsers.map(user => (
                                        <div key={user._id} className="user-item">
                                            <span className="user-name">
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span className="user-email">{user.email}</span>
                                            <span className="user-date">
                                                {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'activities' && <ActivityManagement />}
            </div>
        </div>
    );
}

export default AdminPanel;
