import { getOpenHttpClient, getProtectedHttpClient } from './communicationService';

//const API_URL = `/photogallery/`;
const API_URL = `http://${process.env.REACT_APP_HOST}${process.env.REACT_APP_PHOTOSERVICE}`

interface Body {
    [key: string]: string
}
const pClient = getProtectedHttpClient(API_URL);

export const uploadImage = (data: FormData) => {
    const url = "photos/upload";

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return getOpenHttpClient(API_URL).post(url, data, config)

};

export const getSomeImages = (params: any) => {
    const url = "photos/some";

    return getOpenHttpClient(API_URL).get(url, {
        params
}
    )
};

