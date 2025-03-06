import { Link, Outlet } from "react-router-dom";
import logo from "/src/assets/images/logo.jpg";
import { Home, LogIn } from "lucide-react";

export default function Layout() {
  return (
    <>
      {/* En-tête */}
      <header>
        <div className="flex items-center justify-between bg-[#003366] px-10 py-4 mb-0.5 shadow-2xl">
          {/* Logo avec lien vers l'accueil */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-16 w-auto mr-3" />
            <span className="text-lg sm:text-xl text-white font-semibold leading-tight sm:leading-normal">
              Direction Générale de la Météorologie
              <br />
              <span className="opacity-0 hover:opacity-100 hover:text-[#FFD700] transition-all duration-300">
  Votre partenaire pour un développement durable
</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex text-white space-x-6">
              <li>
                <Link
                  to="/"
                  className="flex items-center hover:text-[#FFA500] transition-colors duration-300"
                >
                  <Home className="mr-2" /> Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex items-center hover:text-[#FFA500] transition-colors duration-300"
                >
                  <LogIn className="mr-2" /> Connexion
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="w-full px-0 mb-0.5 bg-white">
        <Outlet />
      </main>

      {/* Pied de page */}
      <footer className="footer bg-[#4A90E2] py-[70px]">
        <div className="container mx-auto px-[15px]">
          <div className="flex flex-wrap justify-between">
            {/* Extranet de la Météorologie */}
            <div className="w-full md:w-1/2 lg:w-1/4 px-[15px] mb-8 lg:mb-0">
              <h4 className="text-white text-lg font-medium mb-[35px] relative before:content-[''] before:absolute before:left-0 before:bottom-[-10px] before:bg-[#FFA500] before:h-[2px] before:w-[50px]">
                Extranet de la Météorologie
              </h4>
              <p className="text-white">
                Accès sécurisé aux données météorologiques et aux rapports techniques.
                <br />
                Connectez-vous via votre espace réservé pour obtenir les dernières mises à jour.
              </p>
            </div>

            {/* Institution */}
            <div className="w-full md:w-1/2 lg:w-1/4 px-[15px] mb-8 lg:mb-0">
              <h4 className="text-white text-lg font-medium mb-[35px] relative before:content-[''] before:absolute before:left-0 before:bottom-[-10px] before:bg-[#FFA500] before:h-[2px] before:w-[50px]">
                Institution
              </h4>
              <ul>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-[#FFA500] transition-colors duration-300"
                  >
                    À propos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-[#FFA500] transition-colors duration-300"
                  >
                    Nos Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-[#FFA500] transition-colors duration-300"
                  >
                    Politique de Confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-[#FFA500] transition-colors duration-300"
                  >
                    Mentions Légales
                  </a>
                </li>
              </ul>
            </div>

            {/* Service Commercial */}
            <div className="w-full md:w-1/2 lg:w-1/4 px-[15px] mb-8 lg:mb-0">
              <h4 className="text-white text-lg font-medium mb-[35px] relative before:content-[''] before:absolute before:left-0 before:bottom-[-10px] before:bg-[#FFA500] before:h-[2px] before:w-[50px]">
                Service Commercial
              </h4>
              <p className="text-white">
                Pour plus d'informations sur nos produits, contactez notre service commercial aux numéros suivants :
                <br />
                <strong>Tél :</strong> (212) 5 22.65.49.00 / 65.48.00
                <br />
                <strong>Fax :</strong> (212) 5 22.91.37.97
                <br />
                <strong>Email :</strong> contact@marocmeteo.ma
                <br />
                Visitez nos sites web :
                <br />
                www.marocmeteo.ma
                <br />
                vigilance.marocmeteo.ma
              </p>
            </div>
          </div>
          {/* Copyright */}
          <div className="mt-8 text-center text-white">
            © 2024 Copyright - Maroc-Météo | DGM
          </div>
        </div>
      </footer>
    </>
  );
}