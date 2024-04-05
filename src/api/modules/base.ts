import axios, { type AxiosInstance } from 'axios'
import { EnvironmentVars } from '@/utils/envUtils'

const http: AxiosInstance = axios.create({
  baseURL: EnvironmentVars.backendUrl,
  withCredentials: true
})

export default http
