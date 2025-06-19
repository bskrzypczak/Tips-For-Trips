import React, { useState } from 'react';
import { register } from '../services/authService';
import { useUser } from '../hooks/UserContext';
import '../style/AuthForms.css';

const RegisterForm = ({ onSwitchToLogin, onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useUser();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await register(formData);
            signIn(response.user, response.token);
            onClose();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Rejestracja</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">Imię:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Nazwisko:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Hasło (min. 6 znaków):</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                </button>
            </form>
            <p>
                Masz już konto?{' '}
                <button onClick={onSwitchToLogin} className="link-btn">
                    Zaloguj się
                </button>
            </p>
        </div>
    );
};

export default RegisterForm;
