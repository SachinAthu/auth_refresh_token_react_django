import axios from 'axios'
import jwtDecode from 'jwt-decode'
import dayjs from 'dayjs'

import { BASE_URL, LOCALHOST_AUTH_TOKENS } from '../utils/config'

let authTokens = localStorage.getItem(LOCALHOST_AUTH_TOKENS) ? JSON.parse(localStorage.getItem(LOCALHOST_AUTH_TOKENS)) : null

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization:  `Bearer ${authTokens?.access}`
    }
})

axiosInstance.interceptors.request.use(async req => {
    if(!authTokens) {
        authTokens = localStorage.getItem(LOCALHOST_AUTH_TOKENS) ? JSON.parse(localStorage.getItem(LOCALHOST_AUTH_TOKENS)) : null
        req.headers.Authorization = `Bearer ${authTokens?.access}`
    }
    const user = jwtDecode(authTokens.access)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if(!isExpired) {
        return req
    }

    try {
        const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
            refresh: authTokens.refresh
        })
        localStorage.setItem(LOCALHOST_AUTH_TOKENS, JSON.stringify(res.data))
        req.headers.Authorization = `Bearer ${res.data.access}`
        return req
    } catch(err) {
        console.log(err)
        return null;
    }

})

export default axiosInstance