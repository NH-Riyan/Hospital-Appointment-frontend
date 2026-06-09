import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If an app-level role is persisted (fixed admin), use it immediately
    const storedRole = localStorage.getItem("app_role");
    if (storedRole) {
      setRole(storedRole);
      setLoading(false);
      return;
    }

    if (authLoading) {
      setLoading(true);
      return;
    }

    // No authenticated user -> clear role
    if (!user?.email) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await axiosSecure.get(`/user-role?email=${user.email}`);
        setRole(res?.data?.role || null);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.email, authLoading]);

  return { role, loading };
};

export default useUserRole;

