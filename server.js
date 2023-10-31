// Importation du module http pour créer un serveur HTTP
const http = require('http');

// Importation du module d'application Express depuis un fichier local nommé app.js
const app = require('./app');

// Fonction pour normaliser le port en entrée
const normalizePort = val => {
  const port = parseInt(val, 10); // Conversion en entier

  if (isNaN(port)) { // Vérification si le port n'est pas un nombre
    return val; // Retourne la valeur originale
  }
  if (port >= 0) { // Vérification si le port est un entier positif
    return port; // Retourne le port
  }
  return false; // Retourne false si le port n'est pas valide
};

// Récupération du port à partir de la variable d'environnement PORT ou utilisation du port par défaut 4000
const port = normalizePort(process.env.PORT || '4000');

// Définition de la propriété 'port' de l'application Express avec le port défini précédemment
app.set('port', port);

// Fonction de gestion des erreurs pour le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en passant l'application Express comme argument
const server = http.createServer(app);

// Ajout d'un gestionnaire d'événements pour l'événement 'error' du serveur
server.on('error', errorHandler);

// Ajout d'un gestionnaire d'événements pour l'événement 'listening' du serveur
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Affichage d'un message indiquant que le serveur écoute les connexions
});

// Le serveur commence à écouter les connexions sur le port spécifié
server.listen(port);