import axios from "axios";

//
import { kaaConfig } from "./constants";

//

//
const axiosInstance = axios.create({
  baseURL: kaaConfig.baseURL,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

//
export default axiosInstance;
