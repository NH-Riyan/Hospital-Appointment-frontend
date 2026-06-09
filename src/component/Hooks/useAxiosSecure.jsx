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