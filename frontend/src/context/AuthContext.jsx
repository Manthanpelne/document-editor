import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"


 const AuthContext = createContext()

//getting userdata from local storage
const getUser = (token)=>{
    try {
        const decoded = jwtDecode(token)
        if(decoded.exp * 1000 < Date.now()){
            localStorage.removeItem("token")
            return null
        }
        return decoded.user
    } catch (error) {
        console.log(error)
        return null
    }
}


export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    //loading user data from token
    useEffect(()=>{
        if(token){
            const userData = getUser(token)
            if(userData){
                setUser(userData)
            }else{
                setToken(null)
            }
        }
        setLoading(false) 
    },[token])


    //login function
    const login = (newToken, userId, username) =>{
      localStorage.setItem("token",newToken)
      setToken(newToken)
      setUser({id:userId, username:username})
    }


    //logout function
    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
    }


 // api handler (corrected)
const api = (method, url, data = {}) => {
  // 1. Create the base configuration object
  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      // Attach JWT token to Authorization header
      'Authorization': `Bearer ${token}`,
    },
  };
  const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE']; // DELETE is sometimes included
  if (methodsWithBody.includes(method.toUpperCase())) {
    config.body = JSON.stringify(data);
  } else if (method.toUpperCase() === 'GET' && Object.keys(data).length > 0) {
  }
  return fetch(url, config);
};


   return (
    <AuthContext.Provider value={{ token, user, login, logout, api, isAuthenticated:!!token, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);