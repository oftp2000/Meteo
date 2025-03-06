import { Outlet, useLocation } from "react-router-dom";
import Login from "./login";




export default function Home() {
  const location = useLocation();

  return (
    <div>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center my-4">
          Prévisions Météo
        </h1>



        
      </div>

      {/* Affiche le login OU le contenu enfant selon la route */}
      {location.pathname === '/login' ? (
        <Login /> 
      ) : (
        <Outlet />
      )}
    </div>
  );
}