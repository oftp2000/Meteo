export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page non trouvée</h1>
      <p className="text-lg text-gray-600 mt-2">
        Oups ! La page que vous recherchez n'existe pas.
      </p>
      <a
        href="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Retour à l'accueil
      </a>
    </div>
  );
}
