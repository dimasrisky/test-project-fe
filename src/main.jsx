import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import UserList from './pages/UserList.jsx'
import Profile from './pages/Profile.jsx'
import CreateUser from './pages/CreateUser.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TfaMiddleware } from './middleware/TfaMiddleware.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-otp", element: <VerifyOTP /> },
  { path: "/users", element: <UserList /> },
  { path: "/profile", element: <Profile /> },
  { path: "/create-user", element: <CreateUser /> },
  { 
    path: '/verify-tfa', 
    element: <TfaMiddleware />, 
    children: [
      { index: true, element: <VerifyOTP /> }
    ] 
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
