import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

// Composant : SearchBubble (inchangé)
const SearchBubble = ({ onSearchChange }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    onSearchChange && onSearchChange(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
    onSearchChange && onSearchChange("");
  };

  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out
          ${open ? "w-64 p-2" : "w-12 h-12"}
          bg-gradient-to-r from-[#4A90E2] to-[#003366]`}
      >
        {open ? (
          <input
            type="text"
            className="bg-transparent outline-none text-sm w-full px-4 placeholder-gray-200 text-white"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={handleChange}
          />
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="w-full h-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <button
          onClick={handleClose}
          className="absolute right-[-1.5rem] text-white text-lg transition-opacity duration-300 ease-in-out hover:opacity-80"
        >
          ✖
        </button>
      )}
    </div>
  );
};

// FORMULAIRE POUR "Carte Neige" (inchangé)
const CarteNeigeForm = ({ onSubmit }) => {
  const [date, setDate] = useState("2025-02-16");
  const [mosaic, setMosaic] = useState(false);
  const [description, setDescription] = useState(false);

  return (
    <div className="font-roboto">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[#003366] font-semibold text-sm">
            Date :
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={() => setMosaic(!mosaic)}
            className="bg-[#FFA500] text-white px-3 py-1 rounded-md text-sm transition-colors duration-300"
          >
            Mosaic {mosaic ? "Activé" : "Désactivé"}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setDescription(!description)}
            className="bg-[#FFA500] text-white px-3 py-1 rounded-md text-sm transition-colors duration-300"
          >
            Description {description ? "Activé" : "Désactivé"}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => onSubmit({ date, mosaic, description })}
            className="bg-[#FFA500] text-white px-3 py-1 rounded-md text-sm transition-colors duration-300"
          >
            Afficher
          </button>
        </div>
      </div>
    </div>
  );
};

// FORMULAIRE POUR "Carte Ecart-RR-ABH" (inchangé)
const CarteEcartForm = ({ onSubmit }) => {
  const [ecart, setEcart] = useState("L'année précédente");
  const [date, setDate] = useState("2025-02-16");

  return (
    <div className="font-roboto">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[#003366] font-semibold text-sm">
            Ecart :
          </label>
          <select
            value={ecart}
            onChange={(e) => setEcart(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option>L'année précédente</option>
            <option>La normale</option>
          </select>
        </div>
        <div>
          <label className="block text-[#003366] font-semibold text-sm">
            Date :
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={() => onSubmit({ ecart, date })}
            className="bg-[#FFA500] text-white px-3 py-1 rounded-md text-sm transition-colors duration-300"
          >
            Afficher
          </button>
        </div>
      </div>
    </div>
  );
};

// FORMULAIRE POUR "Climatologie‑Réanalyses" (inchangé)
const ClimatologieReanalysesForm = ({ onSubmit }) => {
  const [annee, setAnnee] = useState("2025");
  const [etendue, setEtendue] = useState("Mensuelle");
  const [parametre, setParametre] = useState("P-mer");
  const [carte, setCarte] = useState("Indicetype");
  const [description, setDescription] = useState(false);

  return (
    <div className="font-roboto">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[#003366] font-semibold text-sm">
            Année :
          </label>
          <select
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div>
          <label className="block text-[#003366] font-semibold text-sm">
            Etendue :
          </label>
          <select
            value={etendue}
            onChange={(e) => setEtendue(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option>Mensuelle</option>
            <option>Annuelle</option>
          </select>
        </div>
        <div>
          <label className="block text-[#003366] font-semibold text-sm">
            Paramètre :
          </label>
          <select
            value={parametre}
            onChange={(e) => setParametre(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option>P-mer</option>
          </select>
        </div>
        <div>
          <label className="block text-[#003366] font-semibold text-sm">
            Carte :
          </label>
          <select
            value={carte}
            onChange={(e) => setCarte(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option>Indicetype</option>
          </select>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setDescription(!description)}
            className="bg-[#FFA500] text-white px-3 py-1 rounded-md text-sm mt-4 transition-colors duration-300"
          >
            Description {description ? "Activé" : "Désactivé"}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() =>
              onSubmit({ annee, etendue, parametre, carte, description })
            }
            className="bg-[#FFA500] text-white px-3 py-1 rounded-md text-sm mt-4 transition-colors duration-300"
          >
            Afficher
          </button>
        </div>
      </div>
    </div>
  );
};

// DONNÉES DES SECTEURS (inchangées)
const sectorData = {
  CLIMAT: {
    links: [
      { label: "Carte Neige", href: "/fr/climat/carte-neige", icon: "❄️" },
      { label: "Carte Ecart-RR-ABH", href: "/fr/climat/carte-ecart-rr-abh", icon: "📊" },
      { label: "Climatologie‑Réanalyses", href: "/fr/climat/climatologie-reanalyses", icon: "📈" },
      { label: "Suivi-Sécheresse", href: "/fr/climat/suivi-secheresse", icon: "💧" },
      { label: "Indicateurs-DBClimat", href: "/fr/climat/indicateurs-dbclimat", icon: "⚙️" },
      { label: "Records", href: "/fr/climat/records", icon: "🏆" },
      { label: "Qualité de l'air", href: "/fr/climat/qualite-de-lair", icon: "🌬️" },
    ],
  },
  OBSERVATION: {
    links: [
      { label: "Obsmet-Maroc", href: "/fr/observation/obsmet-maroc", icon: "🔭" },
      { label: "Planche-Quotidienne", href: "/fr/observation/planche-quotidienne", icon: "🗓️" },
      { label: "Planche-Provinciale", href: "/fr/observation/planche-provinciale", icon: "📅" },
      { label: "Planche-Horaire", href: "/fr/observation/planche-horaire", icon: "⏰" },
      { label: "Planche-Décadaire", href: "/fr/observation/planche-decaire", icon: "📆" },
      { label: "Planche-Précipitation", href: "/fr/observation/planche-precipitation", icon: "🌧️" },
      { label: "Planche-Neige", href: "/fr/observation/planche-neige", icon: "❄️" },
      { label: "Postes - Auxiliaires", href: "/fr/observation/postes-auxiliaires", icon: "⚡" },
      { label: "Pluvio-Urbain", href: "/fr/observation/pluvio-urbain", icon: "🌂" },
      { label: "Obsmap-Maroc", href: "/fr/observation/obsmap-maroc", icon: "🗺️" },
      { label: "Map-Observation", href: "/fr/observation/map-observation", icon: "🗺️" },
      { label: "Map-Précipitation", href: "/fr/observation/map-precipitation", icon: "🗺️" },
      { label: "Map-Neige", href: "/fr/observation/map-neige", icon: "🗺️" },
    ],
  },
  TELEDETECTION: {
    links: [
      { label: "Satellite-Standard", href: "/fr/teledetection/satellite-standard", icon: "🛰️" },
      { label: "Satellite-Developpe", href: "/fr/teledetection/satellite-developpe", icon: "🚀" },
      { label: "Radar-Standard", href: "/fr/teledetection/radar-standard", icon: "📡" },
      { label: "Radar-Developpe", href: "/fr/teledetection/radar-developpe", icon: "📡" },
      { label: "Foudre-Standard", href: "/fr/teledetection/foudre-standard", icon: "⚡" },
    ],
  },
  MODELISATION: {
    links: [
      { label: "Météographes", href: "/fr/modelisation/meteographes", icon: "🌤️" },
      { label: "Modele-NUMERIQUE", href: "/fr/modelisation/modele-numerique", icon: "💻" },
      { label: "Modele-MARINE", href: "/fr/modelisation/modele-marine", icon: "🚢" },
    ],
  },
  PREVISION: {
    links: [
      { label: "Prévision-Maroc", href: "/fr/prevision/prevision-maroc", icon: "🌦️" },
      { label: "Prévision-Monde", href: "/fr/prevision/prevision-monde", icon: "🌍" },
      { label: "Prévision-Ma-Plage", href: "/fr/prevision/prevision-ma-plage", icon: "🏖️" },
      { label: "Légende icones", href: "/fr/prevision/legende-icones", icon: "📜" },
    ],
  },
  CARTOGRAPHIE: {
    links: [
      { label: "Map-Vigilances", href: "/fr/cartographie/map-vigilances", icon: "🗺️" },
      { label: "Map-Modeles", href: "/fr/cartographie/map-modeles", icon: "🗺️" },
      { label: "Map-Observation", href: "/fr/cartographie/map-observation", icon: "🗺️" },
      { label: "Ma-Plage", href: "/fr/cartographie/ma-plage", icon: "🏝️" },
    ],
  },
};

// Composant principal : SectorNavigation
const SectorNavigation = () => {
  const [activeSector, setActiveSector] = useState("CLIMAT");
  const [selectedLink, setSelectedLink] = useState(null);
  const [formResult, setFormResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Mise à jour de la recherche
  const handleSearchChange = (query) => setSearchQuery(query);

  // Sélection d'un secteur ou lien via la recherche
  const handleSearchSelect = (sector, link) => {
    setActiveSector(sector);
    setSelectedLink(link);
    setSearchQuery("");
    setFormResult(null);
  };

  const filteredResults = Object.entries(sectorData).reduce(
    (results, [sector, data]) => {
      const lowerQuery = searchQuery.toLowerCase();
      const sectorMatches = sector.toLowerCase().includes(lowerQuery);
      const links = sectorMatches
        ? data.links
        : data.links.filter((link) =>
            link.label.toLowerCase().includes(lowerQuery)
          );
      if (sectorMatches || links.length > 0) {
        results.push({ sector, links });
      }
      return results;
    },
    []
  );

  const handleFormSubmit = (values) => setFormResult(values);

  const renderForm = () => {
    if (!selectedLink) return null;
    if (selectedLink.label === "Carte Neige") {
      return <CarteNeigeForm onSubmit={handleFormSubmit} />;
    }
    if (selectedLink.label === "Carte Ecart-RR-ABH") {
      return <CarteEcartForm onSubmit={handleFormSubmit} />;
    }
    if (
      selectedLink.label === "Climatologie‑Réanalyses" ||
      selectedLink.label === "Climatologie-Reanalyses"
    ) {
      return <ClimatologieReanalysesForm onSubmit={handleFormSubmit} />;
    }
    return (
      <div className="p-4 bg-white rounded-md shadow text-[#003366]">
        Aucun formulaire disponible pour cette carte.
      </div>
    );
  };

  // Fonction de déconnexion identique à celle de l'admin
  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>

      <header className="bg-[#003366] text-white py-4 font-roboto relative">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <SearchBubble onSearchChange={handleSearchChange} />
            <div className="flex space-x-4 ml-8">
              {Object.keys(sectorData).map((sector) => (
                <button
                  key={sector}
                  onClick={() => {
                    setActiveSector(sector);
                    setSelectedLink(null);
                    setFormResult(null);
                  }}
                  className={`py-2 px-4 rounded-md transition-colors duration-300 ${
                    activeSector === sector
                      ? "bg-[#FFA500]"
                      : "bg-transparent hover:bg-[#FFA500]"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Déconnexion
            </button>
            <div
              onClick={() => (window.location.href = "/")}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#003366]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1118.364 6.364 9 9 0 015.121 17.804z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>


        {searchQuery && (
          <div className="absolute z-10 top-full left-4 mt-2 w-64 bg-white text-[#003366] rounded-md shadow-lg p-4 transition-opacity duration-300">
            {filteredResults.length > 0 ? (
              filteredResults.map(({ sector, links }) => (
                <div key={sector} className="mb-3">
                  <div
                    className="font-bold cursor-pointer hover:text-[#FFA500]"
                    onClick={() => handleSearchSelect(sector, null)}
                  >
                    {sector}
                  </div>
                  <div className="ml-4 grid grid-cols-2 gap-2 mt-1">
                    {links.map((link) => (
                      <div
                        key={link.href}
                        className="cursor-pointer text-sm hover:text-[#FFA500]"
                        onClick={() => handleSearchSelect(sector, link)}
                      >
                        {link.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>Aucun résultat trouvé.</div>
            )}
          </div>
        )}
      </header>

      {/* Zone principale : affichage des cartes, formulaires et résultats */}
      <section className="py-16 bg-[#F5F5F5] transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Grille des cartes */}
            <div className="w-full md:w-1/3">
              <div className="grid grid-cols-2 gap-2">
                {sectorData[activeSector].links.map((link) => (
                  <div
                    key={link.href}
                    onClick={() => {
                      setSelectedLink(link);
                      setFormResult(null);
                    }}
                    className={`cursor-pointer bg-white p-2 rounded-md shadow hover:shadow-lg transition-shadow border ${
                      selectedLink && selectedLink.href === link.href
                        ? "border-[#FFA500]"
                        : "border-transparent"
                    }`}
                  >
                    <div className="mb-1 text-xl text-[#4A90E2] text-center">
                      {link.icon}
                    </div>
                    <h4 className="text-xs font-semibold text-[#003366] text-center">
                      {link.label}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Affichage du formulaire et du résultat */}
            <div className="w-full md:w-2/3 space-y-4">
              {selectedLink ? (
                <div className="bg-white p-4 rounded-md shadow transition-transform duration-300 transform hover:scale-105">
                  {renderForm()}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-md shadow text-[#003366]">
                  Veuillez sélectionner une carte.
                </div>
              )}

              <div className="bg-white p-4 rounded-md shadow">
                <h4 className="text-[#003366] font-semibold mb-2 text-sm">
                  Résultat :
                </h4>
                {formResult ? (
                  <pre className="text-xs text-[#003366]">
                    {JSON.stringify(formResult, null, 2)}
                  </pre>
                ) : (
                  <p className="text-xs text-[#003366]">
                    Aucun résultat pour le moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SectorNavigation;
