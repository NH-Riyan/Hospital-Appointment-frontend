import React from "react";  
import { Outlet } from "react-router";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";

const RootLayout = () => {
    return (
        <div className='w-11/12 mx-auto min-h-screen flex flex-col'>
            <Navbar />

            <main className='flex-1'>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default RootLayout;