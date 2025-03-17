import { useState } from 'react';
import axios from '../../../axiosConfig';
import dgm from "/src/assets/images/dgm.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = response.data.user.role === 'admin' ? '/admin' : '/client';
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      setError('Erreur de connexion');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/forgot-password', { email: resetEmail });
      console.log("Demande de réinitialisation envoyée:", response.data);
      toast.success("Votre demande a été envoyée avec succès !");
      setResetEmail(''); // Réinitialise le champ
    } catch (err) {
      console.error('Erreur lors de la demande de réinitialisation:', err);
      setError('Erreur lors de la demande de réinitialisation');
      toast.error("Erreur lors de la demande de réinitialisation");
    }
  };

  // Variantes d'animation pour simuler une "page tournante"
  const containerVariants = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-white w-full max-w-6xl transform transition-all duration-500 hover:shadow-2xl">
        {/* Image de gauche */}
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

        {/* Contenu des formulaires */}
        <div className="p-12 space-y-8">
          <AnimatePresence exitBeforeEnter>
            {!showForgot ? (
              <motion.div
                key="loginForm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-800 text-center transform transition-all hover:scale-105">
                  Connexion
                  <span className="block w-16 h-1 bg-blue-600 mt-2 mx-auto rounded-full"></span>
                </h2>

                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg animate-shake">
                    ⚠ {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email :
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe :
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Se connecter <span className="ml-2 animate-bounce">🚀</span>
                  </button>
                </form>
          
                <div className="text-center text-gray-600">
                  <span 
                    onClick={() => setShowForgot(true)} 
                    className="underline cursor-pointer hover:text-blue-600"
                  >
                    Mot de passe oublié ?
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="forgotForm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-800 text-center transform transition-all hover:scale-105">
                  Réinitialisation du mot de passe
                  <span className="block w-16 h-1 bg-blue-600 mt-2 mx-auto rounded-full"></span>
                </h2>

                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg animate-shake">
                    ⚠ {error}
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entrez votre email :
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Envoyer la demande
                  </button>
                </form>

                <div className="text-center text-gray-600">
                  <span 
                    onClick={() => setShowForgot(false)} 
                    className="underline cursor-pointer hover:text-blue-600"
                  >
                    Retour à la connexion
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
