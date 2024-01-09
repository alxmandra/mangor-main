import {getOpenHttpClient, getProtectedHttpClient} from './communicationService';

const API_URL = `/usersStore/`;

interface Body {
  [key:string]: string
}
const pClient = getProtectedHttpClient(API_URL);

export const register = (body:Body) => {
  return getOpenHttpClient(API_URL).post(API_URL + "signup", {
    ...body
  });
};

export const myself = (token: string) => {
  
  pClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  return pClient
    .get("myself");
}

export const logout = () => {
  return pClient
    .post("logout")
    .then((response: { data: { accessToken: any; }; }) => {
      delete pClient.defaults.headers.common["Authorization"];
      return response.data;
    });
};

export const refreshToken = () => {
  return pClient
    .post("refreshToken");
};
