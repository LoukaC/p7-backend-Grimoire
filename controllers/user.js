const bcrypt = require("bcrypt")
const User = require('../models/user')
const jwt = require('jsonwebtoken');


// Fonction d'inscription des utilisateurs
exports.signup = (req, res, next) => {
    // Utilisation de bcrypt.hash pour hacher le mot de passe provenant de la requête
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        // Vérification des erreurs potentielles
        if (err) {
            // En cas d'erreur, renvoyer une réponse d'erreur interne du serveur
            return res.status(500).json({ error: err });
        } else {
            // Si aucune erreur n'est survenue, créer un nouvel utilisateur avec le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash 
            });
            // Enregistrement de l'utilisateur dans la base de données
            user.save()
                .then(() => {
                    // En cas de succès, renvoyer une réponse indiquant que l'utilisateur a été créé avec succès
                    res.status(201).json({ message: 'user created' });
                })
                .catch(error => res.status(400).json({ error })); // En cas d'erreur lors de l'enregistrement, renvoyer une réponse avec l'erreur
        }
    });
};




exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then((user) => {
        if (user=== null) {
            return res.status(401).json({message:'identifiant/ mdp incorrect'})
    } else {
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
                   if (!valid) {
                       return res.status(401).json({ message: 'identifiant/ mdp incorrect' });
                   }
                   else {
                   const token = jwt.sign(
                                { userId: user._id },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            );
                            res.status(200).json({
                                    userId: user._id,
                                    token: token
                                });
                   }
                })
                .catch(error => res.status(500).json({ error }));
        }
    
    })
    .catch((error) => {res.status(500).json({error})});
    
};