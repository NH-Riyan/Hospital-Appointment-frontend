
import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/rootlayout";
import { Component } from "react";
import Home from "../pages/home/home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Appointment from "../pages/Appointment/Appointment";
import AppointmentDetails from "../pages/Appointment/AppointmentDetails";
import PrivateRoutes from "../component/PrivateRoutes/PrivateRoutes";
import DashboardLayout from "../layout/DashboardLayout";
import Profile from "../component/Profile/Profile";
import History from "../component/History/History";
import DocDetails from "../pages/DocDetails/DocDetails";
import MakeAppointment from "../pages/MakeAppointment/MakeAppointment";
import UserDetails from "../pages/admin/UserDetails";
import DocList from "../pages/admin/DocList";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
      {
      index : true,
      Component: Home
      },
      {
        path: "/appointments",
        element : <PrivateRoutes><Appointment></Appointment></PrivateRoutes>
      },
      { 
        path: "/docList",
        element: <PrivateRoutes><DocList></DocList></PrivateRoutes>
      },
      {
        path: "/appointment-details/:id",
        element: <PrivateRoutes><AppointmentDetails></AppointmentDetails></PrivateRoutes>
      },
      {
        path: "/doctor/:id",
        element:<PrivateRoutes><DocDetails></DocDetails></PrivateRoutes>
       }
      ,
      {
        path: "/makeappointment/:id",
        element: <PrivateRoutes><MakeAppointment></MakeAppointment></PrivateRoutes>
      }
      ,
      {
        path: "/admin/user/:email",
        element: <PrivateRoutes><UserDetails></UserDetails></PrivateRoutes>
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "/auth/login",
        element: <Login></Login>
      },
      {
        path: "/auth/register",
        element: <Register></Register>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoutes><DashboardLayout></DashboardLayout></PrivateRoutes>,
    children: [
      {
        path: '',
        element: <Profile></Profile>
      },
      {
        path: 'profile',
        element: <Profile></Profile>
      },
      {
        path: 'myhistory',
        element: <History></History>
      }
    ]
    }
]);