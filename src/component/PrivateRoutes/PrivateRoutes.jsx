import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { Navigate, useLocation } from 'react-router'
import useUserRole from '../Hooks/useUserRole'

const PrivtateRoutes = ({children}) => {
  const location = useLocation()
  const{user,loading}=useContext(AuthContext)
  const { role, loading: roleLoading } = useUserRole()
  
   if (loading || roleLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );

    }
    if (user || role === 'admin')
        return children;

    
   return <Navigate state={location.pathname} to="/auth/login"></Navigate>
}

export default PrivtateRoutes