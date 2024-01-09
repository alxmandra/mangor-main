import {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import { getProtectedHttpClient } from "./communicationService";

const onRequest = (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig => {
    console.info(`[intercepted request] [${JSON.stringify(config)}]`);
    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[intercepted request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    console.info(`[intercepted response] [${JSON.stringify(response)}]`);
    return response;
}

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
    
    const originalRequest: any = error.config;
  if (error?.response?.status === 401 && !originalRequest?._retry && originalRequest?.url !== 'refreshToken') {
    originalRequest._retry = true;
    const pClient = getProtectedHttpClient(`/usersStore/`);
    const dataToken = await pClient.post("refreshToken");
    pClient.defaults.headers.common['Authorization'] = 'Bearer ' + dataToken.data.token;
    localStorage.setItem('token', dataToken.data.token)
    const newToken = localStorage.getItem("token")
    originalRequest.headers.Authorization = 'Bearer ' + newToken
    return pClient(originalRequest);
  }
  console.error(`[intercepted response error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}