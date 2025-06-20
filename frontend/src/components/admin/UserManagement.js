import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUserRole } from '../../services/adminService';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.users);
            setError(null);
        } catch (err) {
            setError('Błąd podczas pobierania użytkowników: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
            return;
        }

        try {
            await deleteUser(userId);
            setUsers(users.filter(user => user._id !== userId));
            alert('Użytkownik został usunięty');
        } catch (err) {
            alert('Błąd podczas usuwania użytkownika: ' + err.message);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(user => 
                user._id === userId ? { ...user, role: newRole } : user
            ));
            alert('Rola użytkownika została zaktualizowana');
        } catch (err) {
            alert('Błąd podczas aktualizacji roli: ' + err.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return <div className="loading">Ładowanie użytkowników...</div>;
    }

    return (
        <div className="user-management">
            <div className="management-header">
                <h2>Zarządzanie Użytkownikami</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Szukaj użytkownika..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select 
                        value={filterRole} 
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="role-filter"
                    >
                        <option value="all">Wszystkie role</option>
                        <option value="user">Użytkownicy</option>
                        <option value="admin">Administratorzy</option>
                    </select>
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="users-table">
                <div className="table-header">
                    <span>Użytkownik</span>
                    <span>Email</span>
                    <span>Rola</span>
                    <span>Data rejestracji</span>
                    <span>Ostatnie logowanie</span>
                    <span>Akcje</span>
                </div>
                
                {filteredUsers.map(user => (
                    <div key={user._id} className="table-row">
                        <span className="user-info">
                            <div className="user-name">
                                {user.firstName} {user.lastName}
                            </div>
                            {user.isVerified && <span className="verified-badge">✓</span>}
                        </span>
                        <span className="user-email">{user.email}</span>
                        <span className="user-role">
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className={`role-select ${user.role}`}
                            >
                                <option value="user">Użytkownik</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </span>
                        <span className="user-date">
                            {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                        </span>
                        <span className="user-date">
                            {user.lastLogin 
                                ? new Date(user.lastLogin).toLocaleDateString('pl-PL')
                                : 'Nigdy'
                            }
                        </span>
                        <span className="user-actions">
                            <button 
                                onClick={() => handleDeleteUser(user._id)}
                                className="delete-btn"
                                title="Usuń użytkownika"
                            >
                                🗑️
                            </button>
                        </span>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="no-results">
                    Nie znaleziono użytkowników spełniających kryteria.
                </div>
            )}

            <div className="users-summary">
                Wyświetlane: {filteredUsers.length} z {users.length} użytkowników
            </div>
        </div>
    );
}

export default UserManagement;
