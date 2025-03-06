import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Admin from "../pages/admin.jsx";
import Client from "../pages/client.jsx";
import NotFound from "../pages/NotFound.jsx";

// Vérifie l'authentification et le rôle de l'utilisateur
const checkAuth = (requiredRole = null) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token) return { isAuthenticated: false, isAuthorized: false, user: null };

  if (requiredRole && user?.role !== requiredRole) {
    return { isAuthenticated: true, isAuthorized: false, user };
  }

  return { isAuthenticated: true, isAuthorized: true, user };
};

// Loader pour la page de login
const loginLoader = () => {
  const { isAuthenticated, user } = checkAuth();
  if (isAuthenticated) {
    // Si l'utilisateur est authentifié, redirige selon son rôle
    return redirect(user?.role === 'admin' ? "/admin" : "/client");
  }
  return null;
};

// Loader pour les routes protégées
const protectedLoader = (requiredRole) => async () => {
  try {
    const { isAuthenticated, isAuthorized, user } = checkAuth(requiredRole);

    if (!isAuthenticated) {
      return redirect('/login?from=' + encodeURIComponent(window.location.pathname));
    }

    if (requiredRole && !isAuthorized) {
      return redirect('/unauthorized?role=' + requiredRole);
    }

    return {
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
    
  } catch (error) {
    console.error('Loader error:', error);
    return redirect('/error');
  }
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />,
        loader: loginLoader
      },
      {
        path: '/admin',
        element: <Admin />,
        loader: protectedLoader('admin')
      },
      {
        path: '/client',
        element: <Client />,
        loader: protectedLoader('user')
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);
