import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [phone, setPhone] = useState(null);
  return (
    <UserContext.Provider value={{ phone, setPhone }}>
      {children}
    </UserContext.Provider>
  );
}
