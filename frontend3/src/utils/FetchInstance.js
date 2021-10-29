import jwtDecode from 'jwt-decode'
import dayjs from 'dayjs'

import { LOCALHOST_AUTH_TOKENS, BASE_URL } from '../utils/config'

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
    return data
}

const fetchInstance = async (url, config={}) => {
    let authTokens = localStorage.getItem(LOCALHOST_AUTH_TOKENS) ? JSON.parse(localStorage.getItem(LOCALHOST_AUTH_TOKENS)) : null
    const user = jwtDecode(authTokens?.access)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
    
    if(isExpired) {
        authTokens = await refreshToken(authTokens)
    }

    // proceed with request
   config['headers'] = {
    Authorization: `Bearer ${authTokens?.access}`
   }

   const { res, data } = await originalRequest(`${BASE_URL}${url}`, config);

   return { res, data  };
}

export default fetchInstance;