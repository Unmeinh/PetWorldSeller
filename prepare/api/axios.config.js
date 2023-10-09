import axios from "axios";
import { storageMMKV } from "../storage/storageMMKV";

const apiURL = "https://bb8d-2402-800-61c4-5f0c-cd22-fe05-47c8-f556.ngrok-free.app/api";

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
    