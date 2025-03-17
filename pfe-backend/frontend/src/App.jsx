import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from './router/index.jsx'
import { AuthProvider } from "./context/AuthContext"; // Assurez-vous que le chemin est correct

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
