import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom'

import { BASE_URL, LOCALHOST_AUTH_TOKENS } from '../utils/config'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem(LOCALHOST_AUTH_TOKENS) ? JSON.parse(localStorage.getItem(LOCALHOST_AUTH_TOKENS)) : null)
  const [user, setUser] = useState(() => authTokens ? jwt_decode(authTokens.access) : null)
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  useEffect(() => {
    if(authTokens) {
      setUser(jwt_decode(authTokens.access))
    }
    setLoading(false)
   
  }, [authTokens, loading])

  const loginUser = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          username: e.target.username.value,
          password: e.target.password.value
         })
      })
      const data = await res.json()
      // console.log('res', res)
      // console.log('data', data)

      if (res.status === 200) {
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem(LOCALHOST_AUTH_TOKENS, JSON.stringify(data))
        history.push("/")
      } else {
        alert("Request not successed!")
      }
    } catch(err) {
      console.log(err)
      alert("Something went wrong!")
    }

  }

  const logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem(LOCALHOST_AUTH_TOKENS)
    // history.push("/login")
  }

  const contextData = {
    user: user,
    authTokens: authTokens,
    setUser: setUser,
    setAuthTokens: setAuthTokens,
    loginUser:loginUser,
    logoutUser: logoutUser
  }

  return (
    <AuthContext.Provider value={contextData}>
        {loading ? null : children}
    </AuthContext.Provider>
  );
};
