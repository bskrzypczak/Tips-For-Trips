import React, { useState, useEffect } from 'react';
import { getAllAdminActivities, createActivity, updateActivity, deleteActivity } from '../../services/adminService';
import ActivityForm from './ActivityForm';

function ActivityManagement() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [filterCity, setFilterCity] = useState('all');

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await getAllAdminActivities();
            setActivities(response.activities);
            setError(null);
        } catch (err) {
            setError('Błąd podczas pobierania atrakcji: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateActivity = () => {
        setEditingActivity(null);
        setShowForm(true);
    };

    const handleEditActivity = (activity) => {
        setEditingActivity(activity);
        setShowForm(true);
    };

    const handleDeleteActivity = async (activityId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tę atrakcję?')) {
            return;
        }

        try {
            await deleteActivity(activityId);
            setActivities(activities.filter(activity => activity.id_atrakcji !== activityId));
            alert('Atrakcja została usunięta');
        } catch (err) {
            alert('Błąd podczas usuwania atrakcji: ' + err.message);
        }
    };

    const handleFormSubmit = async (activityData) => {
        try {
            if (editingActivity) {
                // Aktualizacja
                const response = await updateActivity(editingActivity.id_atrakcji, activityData);
                setActivities(activities.map(activity => 
                    activity.id_atrakcji === editingActivity.id_atrakcji 
                        ? response.activity 
                        : activity
                ));
                alert('Atrakcja została zaktualizowana');
            } else {
                // Tworzenie nowej
                const response = await createActivity(activityData);
                setActivities([...activities, response.activity]);
                alert('Atrakcja została utworzona');
            }
            setShowForm(false);
            setEditingActivity(null);
        } catch (err) {
            alert('Błąd podczas zapisywania atrakcji: ' + err.message);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingActivity(null);
    };

    // Pobierz unikalne miasta do filtrowania
    const uniqueCities = [...new Set(activities.map(activity => activity.id_miasta))].sort();

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.nazwa_atrakcji.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = filterCity === 'all' || activity.id_miasta.toString() === filterCity;
        return matchesSearch && matchesCity;
    });

    if (loading) {
        return <div className="loading">Ładowanie atrakcji...</div>;
    }

    return (
        <div className="activity-management">
            {showForm ? (
                <ActivityForm
                    activity={editingActivity}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            ) : (
                <>
                    <div className="management-header">
                        <h2>Zarządzanie Atrakcjami</h2>
                        <button 
                            onClick={handleCreateActivity}
                            className="create-btn"
                        >
                            + Dodaj nową atrakcję
                        </button>
                    </div>

                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Szukaj atrakcji..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select 
                            value={filterCity} 
                            onChange={(e) => setFilterCity(e.target.value)}
                            className="city-filter"
                        >
                            <option value="all">Wszystkie miasta</option>
                            {uniqueCities.map(cityId => (
                                <option key={cityId} value={cityId}>
                                    Miasto ID: {cityId}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <div className="error">{error}</div>}

                    <div className="activities-grid">
                        {filteredActivities.map(activity => (
                            <div key={activity.id_atrakcji} className="activity-card">
                                <div className="activity-header">
                                    <h3>{activity.nazwa_atrakcji}</h3>
                                    <div className="activity-actions">
                                        <button 
                                            onClick={() => handleEditActivity(activity)}
                                            className="edit-btn"
                                            title="Edytuj atrakcję"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteActivity(activity.id_atrakcji)}
                                            className="delete-btn"
                                            title="Usuń atrakcję"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="activity-details">
                                    <div className="detail-row">
                                        <strong>ID:</strong> {activity.id_atrakcji}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Miasto ID:</strong> {activity.id_miasta}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Czas trwania:</strong> {activity.czas_trwania}h
                                    </div>
                                    <div className="detail-row">
                                        <strong>Ocena:</strong> {activity.ocena}/10
                                    </div>
                                    <div className="detail-row">
                                        <strong>Cena:</strong> {activity.cena} zł
                                    </div>
                                    <div className="detail-row">
                                        <strong>Aktywność:</strong> {activity.aktywnosc}/10
                                    </div>
                                    <div className="detail-row">
                                        <strong>Centrum:</strong> {activity.centrum}/10
                                    </div>
                                    <div className="detail-row">
                                        <strong>Zatłoczenie:</strong> {activity.zatloczenie}/10
                                    </div>
                                    <div className="detail-row">
                                        <strong>Adrenalina:</strong> {activity.adrenalina}/10
                                    </div>
                                    <div className="detail-row">
                                        <strong>Tagi:</strong> {activity.tagi?.join(', ') || 'Brak'}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Usługi:</strong> {activity.uslugi?.join(', ') || 'Brak'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredActivities.length === 0 && (
                        <div className="no-results">
                            Nie znaleziono atrakcji spełniających kryteria.
                        </div>
                    )}

                    <div className="activities-summary">
                        Wyświetlane: {filteredActivities.length} z {activities.length} atrakcji
                    </div>
                </>
            )}
        </div>
    );
}

export default ActivityManagement;
