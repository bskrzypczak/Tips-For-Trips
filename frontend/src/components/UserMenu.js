import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/UserContext';
import AuthModal from './AuthModal';

export function SignInButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="sign-in-btn">
        Zaloguj się
      </button>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export function UserMenu() {
  const { user, signOut } = useUser();
  const [showSignOut, setShowSignOut] = useState(false);

  if (!user) return null;

  const handleToggle = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = async (e) => {
    e.stopPropagation();
    try {
      await signOut();
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
      <div onClick={handleToggle} style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span>{fullName}</span>
      </div>
      {showSignOut && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 20px)',
            right: 0,
            background: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            padding: '8px'
          }}
        >
          {user.role === 'admin' && (
            <Link to="/admin" className="admin-panel-btn" onClick={() => setShowSignOut(false)}>
              Panel Administratora
            </Link>
          )}
          <button onClick={handleSignOut} className="sign-out-btn">
            Wyloguj się
          </button>
        </div>
      )}
    </div>
  );
}
