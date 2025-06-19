import React, { useState } from 'react';
import { login } from '../services/authService';
import { useUser } from '../hooks/UserContext';
import '../style/AuthForms.css';

const LoginForm = ({ onSwitchToRegister, onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await login(formData);
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
            <h2>Logowanie</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="password">Hasło:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
            </form>
            <p>
                Nie masz konta?{' '}
                <button onClick={onSwitchToRegister} className="link-btn">
                    Zarejestruj się
                </button>
            </p>
        </div>
    );
};

export default LoginForm;
