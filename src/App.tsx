import { lazy } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
const PaymentStatus = lazy(() => import("./main/shared/components/PaymentStatus/PaymentStatus")) ;
const ProductDetails = lazy(() => import("./main/products/Details/Details"));
const Dashboard = lazy(() => import("./main/dashboard/dashboard")) 
const ProtectedRoutes = lazy(() => import("./main/shared/components/ProtectedRoutes/ProtectedRoutes")); 
const Products = lazy(() => import("./main/dashboard/products/products")) 
const Register = lazy(() => import("./main/auth/register/register"))
const Login = lazy(() => import('./main/auth/login/login'))
const ProductsUser = lazy(() => import('./main/products/products'))

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
      Component: () => <ProductsUser />,
    },
    {
      path: '/product/details/:id',
      Component: () => <ProductDetails />
    },
    {
      path: '/payment/:id/status',
      Component: () => <PaymentStatus />
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
