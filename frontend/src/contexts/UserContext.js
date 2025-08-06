import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [phone, setPhoneState] = useState(localStorage.getItem('phone') || null);

  const setPhone = (value) => {
    setPhoneState(value);
    localStorage.setItem('phone', value);
  };

  return (
    <UserContext.Provider value={{ phone, setPhone }}>
      {children}
    </UserContext.Provider>
  );
}
