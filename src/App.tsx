import { lazy } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Navigate } from "react-router-dom"
const Dashboard = lazy(() => import("./main/dashboard/dashboard")) 
const ProtectedRoutes = lazy(() => import("./main/shared/components/ProtectedRoutes/ProtectedRoutes")); 
const Products = lazy(() => import("./main/dashboard/products/products")) 
const Register = lazy(() => import("./main/auth/register/register"))
const Login = lazy(() => import('./main/auth/login/login'))

function App() {

  let routes = createBrowserRouter([
    {
      path: '/login',
      Component: () => <Login />, 
    },
    {
      path: '/register',
      Component: () => <Register /> 
    },
    {
      path: '/',
      Component: () => <Navigate to="/login" replace/>,
    },
    {
      path: '/dashboard',
      Component: () => (
        <ProtectedRoutes>
          <Dashboard />
        </ProtectedRoutes>
      ),
      children: [
        { 
          path: '',
          Component: () => <Products />
        }
      ]
    }
])

  return <RouterProvider router={routes} />
}

export default App
