import axios from 'axios'
import { getApiUrl } from './utils'

const instance = axios.create({
    baseURL: getApiUrl,
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance