import axios from "axios";
import { storageMMKV } from "../storage/storageMMKV";

const apiURL = "https://server-pet-world.onrender.com/api";

// axiosAPi.defaults.withCredentials = true;
let axiosAPi = axios.create();

axiosAPi.defaults.baseURL = apiURL;
axiosAPi.defaults.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": (storageMMKV.getString('login.token') != "") ? `Bearer ${storageMMKV.getString('login.token')}` : undefined
};

export const Get = ({ endPoint, data, params, header }) => {
    return fetch({
        method: 'GET',
        endPoint: endPoint,
        data: data,
        params: params,
        header: header,
    });
};

const getAxiosInstance = () => {
    const axiosInstance = axios.create({
        baseURL: apiURL,
    });
    axiosInstance.interceptors.response.use(
        response => {
            if (response.status === 200) {
            }
            return response.data;
        },
        async error => {
            console.error(error);
            return error.response.data;

            if (error.response) {
                // console.log("Error response", error.response);
                if (error.response.status === 400) {
                }
                if (error.response.status === 401) {
                }
            }

            return Promise.reject(error);
        },
    );

    //  request interceptor
    axiosInstance.interceptors.request.use(
        config => {
            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );
    return axiosInstance;
};

const fetch = async ({ method, endPoint, data, params, header }) => {
    let headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    const token = await storageMMKV.getString('login.token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return getAxiosInstance()({
        method: method,
        url: endPoint,
        data: data,
        params: params,
        headers: { ...headers, ...header },
    });
};

export const Post = ({ endPoint, data, params, header }) => {
    return fetch({
        method: 'POST',
        endPoint: endPoint,
        data: data,
        params: params,
        header: header,
    });
};

export default axiosAPi;
