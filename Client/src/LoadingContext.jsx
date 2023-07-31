import React, {createContext, useState, useContext } from 'react'

const LoadingContext = createContext()
const LoadingUpdateContext = createContext()

export function useLoading(){
    return useContext(LoadingContext)
}

export function useLoadingUpdate(){
    return useContext(LoadingUpdateContext)
}

export function LoadingProvider({children}){
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={loading}>
      <LoadingUpdateContext.Provider value={setLoading}>
        {children}
      </LoadingUpdateContext.Provider>
    </LoadingContext.Provider>
  )
}

export default LoadingProvider