const multer = require('multer');

// Définition des types de fichiers acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer avec memoryStorage
const storage = multer.memoryStorage({
  // Définir le dossier de destination des fichiers téléchargés
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Générer un nom de fichier unique en fonction de l'original, de l'horodatage et de l'extension
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Remplacer les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]; // Récupérer l'extension en fonction du type MIME du fichier
    callback(null, name + '_' + Date.now() + '.' + extension);
  }
});

// Configuration complète du middleware Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    // Vérifier si le type de fichier est pris en charge
    if (MIME_TYPES[file.mimetype]) {
      callback(null, true); // Accepter le fichier
    } else {
      callback(new Error('Type de fichier invalide'), false); // Rejeter le fichier s'il n'est pas pris en charge
    }
  }
}).single('image'); // Définit le champ du formulaire à surveiller pour le téléchargement du fichier

module.exports = upload;