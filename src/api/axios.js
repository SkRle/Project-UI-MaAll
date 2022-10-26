import axios from "axios";

const BASE_URL = "http://localhost:3001/";

export default axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
  headers: {
    // "Content-type": "application/json",
    Accept: "application/json",
  },
});
