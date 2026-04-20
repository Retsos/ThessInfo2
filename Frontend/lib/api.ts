import axios from "axios"
import { getApiBaseUrl } from "@/lib/api-base"

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
