import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { Navigate, useLocation } from 'react-router'

const PrivtateRoutes = ({children}) => {
  const location = useLocation()
  const{user,loading}=useContext(AuthContext)
  
   if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );

    }
    if (user)
        return children;

    
   return <Navigate state={location.pathname} to="/auth/login"></Navigate>
}

export default PrivtateRoutes