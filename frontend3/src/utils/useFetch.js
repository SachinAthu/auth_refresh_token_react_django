import { useContext } from 'react'
import jwtDecode from 'jwt-decode'
import dayjs from 'dayjs'

import { BASE_URL , LOCALHOST_AUTH_TOKENS} from './config'
import AuthContext from '../context/AuthContext'

const useFetch = () => {
    let { authTokens, user, setUser, setAuthTokens } = useContext(AuthContext)
    let config = {}

    const originalRequest = async (url, config) => {
        const res = await fetch(url, config)
        const data = await res.json()
        return { res, data }
    }
    
    const refreshToken = async (authTokens) => {
        const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh: authTokens?.refresh })
        })
        const data = await res.json()
        localStorage.setItem(LOCALHOST_AUTH_TOKENS, JSON.stringify(data))
        setAuthTokens(data)
        setUser(jwtDecode(data?.access))
        return data
    }

    
    const callFetch = async (url) => {
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
        
        if(isExpired) {
            authTokens = await refreshToken(authTokens)
        }
    
        config['headers'] = {
            Authorization: `Bearer ${authTokens?.access}`
        }

       const { res, data } = await originalRequest(`${BASE_URL}${url}`, config);

       return { res, data  };

    }

    return callFetch;

}

export default useFetch;