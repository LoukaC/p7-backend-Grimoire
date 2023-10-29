const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       // Extraction du token de l'en-tête Authorization sans le Bearer
       const token = req.headers.authorization.split(' ')[1];
       // Vérification de la validité du token à l'aide de la clé secrète
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       // Récupération de l'ID utilisateur à partir du token décodé
       const userId = decodedToken.userId;
       // Ajout de l'ID utilisateur à la requête pour une utilisation ultérieure
       req.auth = {
           userId: userId
       };
       next();
   } catch(error) {
       res.status(401).json({ error: 'Invalid or expired token' });
   }
};