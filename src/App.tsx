import { lazy } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Navigate } from "react-router-dom"
const Login = lazy(() => import('./main/auth/login/login'))

function App() {

  let routes = createBrowserRouter([
    {
      path: '/login',
      Component: () => <Login />, 
    },
    {
      path: '/',
      Component: () => <Navigate to="/login" replace/>,
    }
  ])

  return <RouterProvider router={routes} />
}

export default App
