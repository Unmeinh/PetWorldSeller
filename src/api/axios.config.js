import axios from "axios";
import { storageMMKV } from "../storage/storageMMKV";

const apiURL = "https://fad6-2402-800-61c4-5f0c-50e3-ed11-44a8-dad9.ngrok-free.app/api";

// axiosAPi.defaults.withCredentials = true;
let axiosAPi = axios.create();

axiosAPi.defaults.baseURL = apiURL;
axiosAPi.defaults.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": (storageMMKV.getString('login.token') != "") ? `Bearer ${storageMMKV.getString('login.token')}` : undefined
};
export default axiosAPi;
    