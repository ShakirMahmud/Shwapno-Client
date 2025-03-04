import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import DashboardLayout from './layouts/DashboardLayout';
import Inventory from './pages/dashboard/Inventory';
import Categories from './pages/dashboard/Categories';
import Analytics from './pages/dashboard/Analytics';
import AuthProvider from './provider/AuthProvider';
import SignUp from './pages/dashboard/SignUp';
import Login from './pages/dashboard/Login';
import PrivateRoute from './routes/PrivateRoutes';
import ErrorPage from './pages/dashboard/ErrorPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/analytics" replace />, // Redirect "/" to Analytics
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard/inventory",
        element: <PrivateRoute><Inventory /></PrivateRoute>,
      },
      {
        path: "/dashboard/categories",
        element: <PrivateRoute><Categories /></PrivateRoute>,
      },
      {
        path: "/dashboard/analytics",
        element: <Analytics />
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: '/signup',
    element: <SignUp/>
  },
  {
    path: '*',
    element: <ErrorPage/>
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
