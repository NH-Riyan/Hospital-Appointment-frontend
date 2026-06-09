import React, { useContext, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import useUserRole from '../Hooks/useUserRole';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const{ user,loading,logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [photo, setPhoto] = useState(user?.photoURL || '/default-avatar.png');
  const { role } = useUserRole();
  const adminSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='%231d4ed8'/><text x='50%' y='50%' font-size='64' fill='white' text-anchor='middle' dominant-baseline='central' font-family='Arial'>A</text></svg>`;
  const adminAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(adminSvg)}`;


  if(role === null || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


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
      {role === 'admin' ? (
        <>
          <NavLink to="/docList" className="hover:text-green-600">Doclist</NavLink>
          <NavLink to="/reports" className="hover:text-green-600">Reports</NavLink>
        </>
      ) : (
        <NavLink to="/appointments" className="hover:text-green-600">Appointments</NavLink>
      )}
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
          ) : ( user || role === 'admin') ? (
            <div className="relative flex items-center gap-4">
            <img
              src={role === 'admin' ? adminAvatar : (user.photoURL || "/default-avatar.png")}
              alt={role === 'admin' ? "A" : "profile"}
              title={role === 'admin' ? "admin" : (user.displayName || user.name || "User")}
              className="w-10 h-10 rounded-full border-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              
              <ul className="absolute  right-0 top-12 w-56 bg-base-100 border rounded-lg shadow-lg z-50 p-2 menu">
                <li className="px-4 py-2 font-semibold">
                  {role === 'admin' ? 'admin' : (user.displayName || user.email)}
                </li>
                {role !== 'admin' && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className="px-4 py-2 hover:bg-green-100 rounded block"
                  >
                    Dashboard
                  </NavLink>
                </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-red-100 text-red-600 rounded w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
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