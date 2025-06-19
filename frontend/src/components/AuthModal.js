import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import '../style/AuthForms.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    const switchToRegister = () => setIsLogin(false);
    const switchToLogin = () => setIsLogin(true);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                {isLogin ? (
                    <LoginForm 
                        onSwitchToRegister={switchToRegister} 
                        onClose={onClose}
                    />
                ) : (
                    <RegisterForm 
                        onSwitchToLogin={switchToLogin} 
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthModal;
