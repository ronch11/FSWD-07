import React from 'react';
import axios from 'axios';

const ApiContext = React.createContext();

export const ApiProvider = ({children}) => {
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;