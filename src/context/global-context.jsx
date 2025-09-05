import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
  const [tab, setTab] = useState('all'); // ✅ 기본값

  return (
    <GlobalContext.Provider value={{ tab, setTab }}>
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}
