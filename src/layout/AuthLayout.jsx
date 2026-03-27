import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='bg-blue-200'>
         <Outlet ></Outlet>
    </div>
  )
}

export default AuthLayout