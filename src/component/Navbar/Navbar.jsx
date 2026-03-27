import React, { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
  const{ user,loading,logOut } = useContext(AuthContext);
  const navigate = useNavigate();

   const handleLogout = () => {
    logOut()
      .then(() => {
        alert('you logged out')
      }).catch((error) => {
        console.log(error.message)
      });
  }

    const link = (
    <>
      <NavLink to="/" className="hover:text-green-600">
        Home
      </NavLink>
      <NavLink to="/" className="hover:text-green-600">
        About
      </NavLink>
      <NavLink to="/" className="hover:text-green-600">
        Contacts
      </NavLink>
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    

  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1 gap-5 text-lg">
      {link}
    </ul>
  </div>

      <div className='flex gap-4 navbar-end'>
        {
          loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : user ? (
            <div className='flex gap-4'>
              <img className='rounded-full w-10 h-10 border-2' title={user.displayName} src={user.photoURL} alt="" />
              <Link onClick={handleLogout} className='btn bg-red-500 hover:bg-red-600 text-white px-7'>LogOut</Link>
            </div>
          ) : (
            <div className='flex gap-4'>
              <Link to='/auth/login' className='btn bg-green-500 hover:bg-green-600 text-white px-7'>Login</Link>
              <Link to='/auth/register' className='btn bg-green-500 hover:bg-green-600 text-white px-7'>SignUp</Link>
            </div>
          )
        }

      </div>
</div>
  )
}

export default Navbar