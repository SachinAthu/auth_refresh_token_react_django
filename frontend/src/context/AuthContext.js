import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null)
  const [user, setUser] = useState(() => authTokens ? jwt_decode(authTokens.access) : null)
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  // refresh the token every 4 minutes
  useEffect(() => {
    if (loading) {
      updateToken()
    }
    const intervel = setInterval(() => {
      if(authTokens) {
        updateToken()
      }
    }, 4 * 60 * 1000)
    return () => clearInterval(intervel)
  }, [authTokens, loading])

  const loginUser = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
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
        localStorage.setItem("authTokens", JSON.stringify(data))
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
    localStorage.removeItem("authTokens")
    // history.push("/login")
  }

  const updateToken = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          refresh: authTokens?.refresh,
         })
      })
      const data = await res.json()
      // console.log('res', res)
      // console.log('data', data)

      if (res.status === 200) {
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem("authTokens", JSON.stringify(data))
      } else {
        console.log("Refreshing token not successed!")
        logoutUser()
      }
    } catch(err) {
      console.log(err)
    }

    if(loading) {
      setLoading(false)
    }
  }

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser:loginUser,
    logoutUser: logoutUser
  }

  return (
    <AuthContext.Provider value={contextData}>
        {loading ? null : children}
    </AuthContext.Provider>
  );
};
