import React, { createContext, useContext, useState } from 'react';

const MyContext = React.createContext();

export function MyProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <MyContext.Provider value={{ user, login, logout }}>
      {children}
    </MyContext.Provider>
  );
}
export const useMy = () => useContext(MyContext);
