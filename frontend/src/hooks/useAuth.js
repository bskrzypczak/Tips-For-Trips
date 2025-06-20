import { useUser } from './UserContext';

export const useAuth = () => {
    const { user, signIn, signOut, loading } = useUser();
    
    return {
        user,
        signIn,
        signOut,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };
};
