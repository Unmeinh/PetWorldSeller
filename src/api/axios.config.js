import axios from "axios";
import { storageMMKV } from "../storage/storageMMKV";

const apiURL = "https://7698-2405-4800-1f19-a700-18c7-8b70-21d3-da72.ngrok-free.app/api";

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
    