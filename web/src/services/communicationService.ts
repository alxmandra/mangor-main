import axios from "axios";
import { setupInterceptorsTo } from "./interceptors";

export const getOpenHttpClient = (API_URL: string) => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cache: "no-cache",
        }
    });
}

export const getProtectedHttpClient = (API_URL: string) => {
    return setupInterceptorsTo(axios.create({
        withCredentials: true,
        baseURL: API_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cache: "no-cache",
        },
    }))
}