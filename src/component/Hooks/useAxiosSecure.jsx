import { useEffect, useMemo } from "react";
import axios from "axios";
import { auth } from "../../Firebase/firebase.init";

const useAxiosSecure = () => {
  const axiosSecure = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    []
  );

  // Add response interceptor to handle 304 caching issues
  useEffect(() => {
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 304) {
          // Force cache bypass for 304 responses
          error.config.headers["Cache-Control"] = "no-cache";
          return axiosSecure.request(error.config);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosSecure]);

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, [axiosSecure]);

  return axiosSecure;
};

export default useAxiosSecure;