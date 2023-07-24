import React from 'react';
import axios from 'axios';

const ApiContext = React.createContext();

export const ApiProvider = ({children}) => {
  const api = axios.create({
    baseURL: 'https://localhost:8000/api', rejectUnauthorized: false
  });

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;