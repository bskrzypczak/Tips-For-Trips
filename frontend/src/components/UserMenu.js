import React, { useState } from 'react';
import { signInWithGoogle } from '../services/firebase';
import { useUser } from '../hooks/UserContext';
import { auth, provider } from '../firebaseConfig';

export function SignInButton() {
  const { signIn } = useUser();

  const handleClick = async () => {
    const userData = await signInWithGoogle(auth, provider);
    signIn(userData);
    console.log("Zalogowano użytkownika:", userData.displayName);
  };

  return (
    <button onClick={handleClick} className="sign-in-btn">
      Sign In
    </button>
  );
}

export function UserMenu() {
  const { user, signOut } = useUser();
  const [showSignOut, setShowSignOut] = useState(false);

  if (!user) return null;

  const handleToggle = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = (e) => {
    e.stopPropagation(); // zapobiegamy wywołaniu handleToggle
    signOut();
  };

  return (
    <div style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
      <div onClick={handleToggle} style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt="Profile"
          style={{
            width: '20%',
            height: '20%',
            borderRadius: '50%',
            marginRight: '8px',
            objectFit: 'cover'
          }}
        />
        <span>{user.displayName}</span>
      </div>
      {showSignOut && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 20px)', // 20px od dołu elementu UserMenu
            right: 0
          }}
        >
          <button onClick={handleSignOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}


