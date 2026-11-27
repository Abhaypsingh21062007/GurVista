import { useState, useCallback } from 'react';
import { getCurrentUser, logoutUser } from '../utils/authStorage';
import { AuthContext } from './authContextObject';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  /** Call after a successful login/register to sync state */
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  /** Sign out and clear state */
  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  /** Re-read the session (e.g. after profile update) */
  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
