import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('smartwash-user')) || null; } catch { return null; }
  });

  function login(role, name) {
    const nextUser = { role, name: name || (role === 'admin' ? 'Avery Morgan' : role === 'provider' ? 'Service partner' : 'Alex Morgan') };
    localStorage.setItem('smartwash-user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    localStorage.removeItem('smartwash-user');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
