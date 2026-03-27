import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router";
import { router } from './routers/router.jsx';
import AuthProvider from './Context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='urbanist-font'>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
    
  </StrictMode>,
)
