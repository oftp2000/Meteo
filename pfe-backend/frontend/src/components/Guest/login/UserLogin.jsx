import { useState } from 'react';
import axios from '../../../axiosConfig';

import dgm from "/src/assets/images/dgm.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    try {
      // Comme la baseURL est définie dans axiosConfig, on utilise simplement '/login'
      const response = await axios.post('/login', {
        email,
        password
    });
  
      console.log(response.data); // Vérifie la réponse du serveur
  
      // Vérification de la présence d'un token dans la réponse
if (response.data.token) {
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  // Redirection basée sur le rôle
  if (response.data.user.role === 'admin') {
    window.location.href = '/admin';
  } else {
    window.location.href = '/client';
  }
}
  
    } catch (err) {
      console.error('Erreur complète:', err);  // Affiche l'erreur complète dans la console
      setError('Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-white w-full max-w-6xl transform transition-all duration-500 hover:shadow-2xl">
        <div className="hidden md:block relative overflow-hidden group">
          <img 
            src={dgm}
            alt="Connexion"
            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white opacity-0 animate-pulse group-hover:opacity-100 transition-opacity duration-500">
            <h3 className="text-3xl font-bold mb-2 animate-pulse">Bienvenue</h3>
            <p className="text-lg">Votre portail vers l'excellence</p>
          </div>
        </div>

        <div className="p-12 space-y-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-800 text-center transform transition-all hover:scale-105">
            Connexion
            <span className="block w-16 h-1 bg-blue-600 mt-2 mx-auto rounded-full"></span>
          </h2>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg animate-shake">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">
                  Email :
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-300"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">
                  Mot de passe :
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-300"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transform transition-all duration-300 
                       hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
            >
              Se connecter
              <span className="ml-2 animate-bounce">🚀</span>
            </button>
          </form>
    
          <div className="text-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
            <a href="#" className="underline hover:no-underline">
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
