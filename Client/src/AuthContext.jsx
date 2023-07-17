import React, {createContext, useState, useContext } from 'react'

const AuthContext = createContext()
const AuthUpdateContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function useAuthUpdate(){
    return useContext(AuthUpdateContext)
}

export function AuthProvider({children}){
  // const defUser = {
  //   "id": 1,
  //   "name": "Leanne Graham",
  //   "username": "Bret",
  //   "email": "Sincere@april.biz",
  //   "address": {
  //     "street": "Kulas Light",
  //     "suite": "Apt. 556",
  //     "city": "Gwenborough",
  //     "zipcode": "92998-3874",
  //     "geo": {
  //       "lat": "-37.3159",
  //       "lng": "81.1496"
  //     }
  //   }
  // };
  const [accessToken, setAccessToken] = useState(null);
  return (
    <AuthContext.Provider value={accessToken}>
      <AuthUpdateContext.Provider value={setAccessToken}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}

export default AuthProvider