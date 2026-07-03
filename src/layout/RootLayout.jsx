import React from "react";  
import { Outlet } from "react-router";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";
import useUserRole from "../component/Hooks/useUserRole";


const RootLayout = () => {
    const { role } = useUserRole();

    // ✅ Single source of truth for the page-wide gradient, based on role
    const pageBg =
        role === 'doctor'
            ? 'bg-gradient-to-b from-cyan-700 via-white to-cyan-700'
            : 'bg-gradient-to-br from-teal-600 via-white to-teal-600';

    return (
        <div className={`w-12/12 mx-auto min-h-screen flex flex-col ${pageBg}`}>
            <Navbar />

            <main className='flex-1' >
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default RootLayout;