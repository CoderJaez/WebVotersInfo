import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuthStore from "store/auth";

const useAxiosPrivate = () => {
  const { accessToken, refreshToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["x-access-token"]) {
          config.headers["x-access-token"] = accessToken;
          config.headers["x-refresh-token"] = refreshToken;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        if (response.headers["x-access-token"]) {
          setAccessToken(response.headers["x-access-token"]);
        }
        return response;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);
  return axiosPrivate;
};

export default useAxiosPrivate;
