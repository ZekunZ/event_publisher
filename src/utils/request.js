import axios from "axios";
import { useTokenStore } from "@/stores/token.js";
import { ElMessage } from "element-plus";
import router from "@/router";

const baseURL = "/api";

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

// add request interceptors
instance.interceptors.request.use(
  (config) => {
    //add token
    const tokenStore = useTokenStore();
    //check if there is token
    if (tokenStore.token) {
      config.headers.Authorization = tokenStore.token;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  }
);

instance.interceptors.response.use(
  // for status code 20x
  function (result) {
    if (result.data.code === 0) {
      return result.data;
    }
    ElMessage.error(result.data.message);
    return Promise.reject(result.data);
  },
  function (error) {
    // check response status code, if it is 401 it is not logged in
    if (error.response.status === 401) {
      router.push("/login");
      ElMessage.error("Please log in!");
    } else {
      ElMessage.error("Server error!");
    }
    return Promise.reject(error);
  }
);

export default instance;
