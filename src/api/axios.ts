import axios from "axios";
// const localhost = "10.0.2.2";
// const network_ip = "127.0.0.1";
// const url = `http://127.0.0.1:3001/api/v1/`;
const url = "https://voter-info.onrender.com/api/v1/";

export default axios.create({
  baseURL: url,
  timeout: 5000,
});

export const axiosPrivate = axios.create({
  baseURL: url,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true,
});
