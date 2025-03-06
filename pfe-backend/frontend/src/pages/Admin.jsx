import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

// Mapping des permissions (vérifiez que les IDs correspondent à votre base de données)
const permissionMapping = {
  CLIMAT: {
    "Carte Neige": 1,
    "Carte Ecart-RR-ABH": 2,
    "Climatologie‑Réanalyses": 3,
    "Suivi-Sécheresse": 4,
    "Indicateurs-DBClimat": 5,
    "Records": 6,
    "Qualité de l'air": 7,
  },
  OBSERVATION: {
    "Obsmet-Maroc": 8,
    "Planche-Quotidienne": 9,
    "Planche-Provinciale": 10,
    "Planche-Horaire": 11,
    "Planche-Décadaire": 12,
    "Planche-Précipitation": 13,
    "Planche-Neige": 14,
    "Postes - Auxiliaires": 15,
    "Pluvio-Urbain": 16,
    "Obsmap-Maroc": 17,
    "Map-Observation": 18,
    "Map-Précipitation": 19,
  },
  TELEDETECTION: {
    "Satellite-Standard": 20,
    "Satellite-Developpe": 21,
    "Radar-Standard": 22,
    "Radar-Developpe": 23,
    "Foudre-Standard": 24,
  },
  MODELISATION: {
    "Météographes": 25,
    "Modele-NUMERIQUE": 26,
    "Modele-MARINE": 27,
  },
  PREVISION: {
    "Prévision-Maroc": 28,
    "Prévision-Monde": 29,
    "Prévision-Ma-Plage": 30,
    "Légende icones": 31,
  },
  CARTOGRAPHIE: {
    "Map-Vigilances": 32,
    "Map-Modeles": 33,
    "Map-Observation": 34,
    "Ma-Plage": 35,
  },
};

// Options de permissions avec icônes (pour l'affichage)
const permissionOptions = {
  CLIMAT: [
    { label: "Carte Neige", icon: "❄️" },
    { label: "Carte Ecart-RR-ABH", icon: "📊" },
    { label: "Climatologie‑Réanalyses", icon: "📈" },
    { label: "Suivi-Sécheresse", icon: "💧" },
    { label: "Indicateurs-DBClimat", icon: "⚙️" },
    { label: "Records", icon: "🏆" },
    { label: "Qualité de l'air", icon: "🌬️" },
  ],
  OBSERVATION: [
    { label: "Obsmet-Maroc", icon: "🔭" },
    { label: "Planche-Quotidienne", icon: "🗓️" },
    { label: "Planche-Provinciale", icon: "📅" },
    { label: "Planche-Horaire", icon: "⏰" },
    { label: "Planche-Décadaire", icon: "📆" },
    { label: "Planche-Précipitation", icon: "🌧️" },
    { label: "Planche-Neige", icon: "❄️" },
    { label: "Postes - Auxiliaires", icon: "⚡" },
    { label: "Pluvio-Urbain", icon: "🌂" },
    { label: "Obsmap-Maroc", icon: "🗺️" },
    { label: "Map-Observation", icon: "🗺️" },
    { label: "Map-Précipitation", icon: "🗺️" },
  ],
  TELEDETECTION: [
    { label: "Satellite-Standard", icon: "🛰️" },
    { label: "Satellite-Developpe", icon: "🚀" },
    { label: "Radar-Standard", icon: "📡" },
    { label: "Radar-Developpe", icon: "📡" },
    { label: "Foudre-Standard", icon: "⚡" },
  ],
  MODELISATION: [
    { label: "Météographes", icon: "🌤️" },
    { label: "Modele-NUMERIQUE", icon: "💻" },
    { label: "Modele-MARINE", icon: "🚢" },
  ],
  PREVISION: [
    { label: "Prévision-Maroc", icon: "🌦️" },
    { label: "Prévision-Monde", icon: "🌍" },
    { label: "Prévision-Ma-Plage", icon: "🏖️" },
    { label: "Légende icones", icon: "📜" },
  ],
  CARTOGRAPHIE: [
    { label: "Map-Vigilances", icon: "🗺️" },
    { label: "Map-Modeles", icon: "🗺️" },
    { label: "Map-Observation", icon: "🗺️" },
    { label: "Ma-Plage", icon: "🏝️" },
  ],
};

// Valeurs initiales des permissions (toutes à false)
const initialPermissions = {
  CLIMAT: {
    "Carte Neige": false,
    "Carte Ecart-RR-ABH": false,
    "Climatologie‑Réanalyses": false,
    "Suivi-Sécheresse": false,
    "Indicateurs-DBClimat": false,
    "Records": false,
    "Qualité de l'air": false,
  },
  OBSERVATION: {
    "Obsmet-Maroc": false,
    "Planche-Quotidienne": false,
    "Planche-Provinciale": false,
    "Planche-Horaire": false,
    "Planche-Décadaire": false,
    "Planche-Précipitation": false,
    "Planche-Neige": false,
    "Postes - Auxiliaires": false,
    "Pluvio-Urbain": false,
    "Obsmap-Maroc": false,
    "Map-Observation": false,
    "Map-Précipitation": false,
  },
  TELEDETECTION: {
    "Satellite-Standard": false,
    "Satellite-Developpe": false,
    "Radar-Standard": false,
    "Radar-Developpe": false,
    "Foudre-Standard": false,
  },
  MODELISATION: {
    "Météographes": false,
    "Modele-NUMERIQUE": false,
    "Modele-MARINE": false,
  },
  PREVISION: {
    "Prévision-Maroc": false,
    "Prévision-Monde": false,
    "Prévision-Ma-Plage": false,
    "Légende icones": false,
  },
  CARTOGRAPHIE: {
    "Map-Vigilances": false,
    "Map-Modeles": false,
    "Map-Observation": false,
    "Ma-Plage": false,
  },
};

// Fonction utilitaire pour transformer l'objet de permissions en tableau d'IDs
const transformPermissions = (permissions, mapping) => {
  let permissionIds = [];
  Object.keys(permissions).forEach(category => {
    Object.keys(permissions[category]).forEach(label => {
      if (permissions[category][label] && mapping[category] && mapping[category][label]) {
        permissionIds.push(mapping[category][label]);
      }
    });
  });
  return permissionIds;
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    permissions: initialPermissions,
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lastConnectedUsers: [],
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  // Récupération du profil de l'utilisateur connecté
  const fetchProfile = async () => {
    try {
      const response = await axios.get('/profile');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  };

  // Récupération des utilisateurs et statistiques
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data.users || []);
      setStats({
        totalUsers: response.data.totalUsers,
        activeUsers: response.data.activeUsers,
        lastConnectedUsers: response.data.lastConnectedUsers || [],
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUsers();
  }, []);

  // Mise à jour du profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/profile', currentUser);
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  // Création d'un nouvel utilisateur avec permissions
  const handleCreateUser = async (e) => {
    e.preventDefault();
    // Transformation de l'objet permissions en tableau d'IDs
    const permissionIds = transformPermissions(newUser.permissions, permissionMapping);
    const userPayload = {
      ...newUser,
      permissions: permissionIds,
    };

    try {
      await axios.post('/users', userPayload);
      await fetchUsers();
      alert("Utilisateur ajouté avec succès !");
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
        permissions: initialPermissions,
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Suppression d'un utilisateur
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await axios.delete(`/users/${userId}`);
        alert("Utilisateur supprimé avec succès !");
        fetchUsers();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
      }
    }
  };

  // Lancement de l'édition d'un utilisateur
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  // Annulation de l'édition
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Sauvegarde des modifications d'un utilisateur
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const permissionIds = transformPermissions(editingUser.permissions, permissionMapping);
    const userPayload = {
      ...editingUser,
      permissions: permissionIds,
    };

    try {
      await axios.put(`/users/${editingUser.id}`, userPayload);
      alert("Utilisateur modifié avec succès !");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Menu */}
      <div className="w-64 bg-white shadow-lg p-6 transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-800 mb-8">Tableau de bord</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left p-2 rounded-lg ${activeSection === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full text-left p-2 rounded-lg ${activeSection === 'profile' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
            >
              Profil
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('createUser')}
              className={`w-full text-left p-2 rounded-lg ${activeSection === 'createUser' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
            >
              Créer un utilisateur
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full text-left p-2 rounded-lg ${activeSection === 'users' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
            >
              Gestion des utilisateurs
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200"
            >
              Déconnexion
            </button>
          </li>
        </ul>
      </div>

      {/* Contenu Principal */}
      <div className="flex-1 p-8">
        {/* Section Dashboard */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800">Utilisateurs Totaux</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800">Utilisateurs Actifs</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800">Dernières Connexions</h3>
                <ul className="mt-2 space-y-2">
                  {stats.lastConnectedUsers.map((user, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {user.name} - <span className="text-gray-400">{user.lastConnected}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Section Profil */}
        {activeSection === 'profile' && (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil</h1>
            <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={currentUser.name || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Adresse email"
                  value={currentUser.email || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Mettre à jour
              </button>
            </form>
          </div>
        )}

        {/* Section Créer un utilisateur */}
        {activeSection === 'createUser' && (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Créer un utilisateur</h1>
            <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Adresse email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              {/* Permissions */}
              <fieldset className="mt-4 border p-4">
                <legend className="text-lg font-semibold text-gray-800">Permissions</legend>
                {Object.keys(permissionOptions).map((category) => (
                  <div key={category} className="mt-2">
                    <h4 className="font-semibold text-gray-700">{category}</h4>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {permissionOptions[category].map((perm) => (
                        <label key={perm.label} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newUser.permissions[category][perm.label]}
                            onChange={(e) => {
                              const newPermissions = { ...newUser.permissions };
                              newPermissions[category] = {
                                ...newPermissions[category],
                                [perm.label]: e.target.checked,
                              };
                              setNewUser({ ...newUser, permissions: newPermissions });
                            }}
                            className="mr-2"
                          />
                          <span>{perm.icon} {perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </fieldset>

              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Créer l'utilisateur
              </button>
            </form>
          </div>
        )}

        {/* Section Gestion des utilisateurs */}
        {activeSection === 'users' && (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des utilisateurs</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    {editingUser && editingUser.id === user.id ? (
                      <form onSubmit={handleSaveEdit} className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, name: e.target.value })
                          }
                          className="p-2 border rounded-md"
                        />
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, email: e.target.value })
                          }
                          className="p-2 border rounded-md"
                        />
                        <select
                          value={editingUser.role}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, role: e.target.value })
                          }
                          className="p-2 border rounded-md"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                        
                        {/* Edition des permissions */}
                        <fieldset className="mt-4 border p-4">
                          <legend className="text-lg font-semibold text-gray-800">Permissions</legend>
                          {Object.keys(permissionOptions).map((category) => (
                            <div key={category} className="mt-2">
                              <h4 className="font-semibold text-gray-700">{category}</h4>
                              <div className="grid grid-cols-2 gap-2 ml-4">
                                {permissionOptions[category].map((perm) => (
                                  <label key={perm.label} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={editingUser.permissions && editingUser.permissions[category] && editingUser.permissions[category][perm.label]}
                                      onChange={(e) => {
                                        const newPermissions = editingUser.permissions ? { ...editingUser.permissions } : {};
                                        newPermissions[category] = {
                                          ...(newPermissions[category] || {}),
                                          [perm.label]: e.target.checked,
                                        };
                                        setEditingUser({ ...editingUser, permissions: newPermissions });
                                      }}
                                      className="mr-2"
                                    />
                                    <span>{perm.icon} {perm.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </fieldset>
                        
                        <div className="flex gap-2">
                          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            Sauvegarder
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
