const bcrypt = require("bcrypt")
const User = require('../models/user')
const jwt = require('jsonwebtoken');



exports.signup = (req, res, next) => {
    // Utilisation de bcrypt.hash pour hacher le mot de passe provenant de la requête
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        // Vérification des erreurs potentielles
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            //créer un nouvel utilisateur avec le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash 
            });
            // Enregistrement de l'utilisateur dans la base de données
            user.save()
                .then(() => {
                    res.status(201).json({ message: 'utilisateur créée' });
                })
                .catch(error => res.status(400).json({ error }));
        }
    });
};




exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) // chercher l'utilisateur dans la base de données avec l'email de la requete
    .then((user) => {
        if (user=== null) { 
            return res.status(401).json({message:'identifiant/ mdp incorrect'})
    } else {
        bcrypt.compare(req.body.password, user.password) // compare le mdp de la requete avec le mdp associé à l'email
        .then(valid => {
                   if (!valid) {
                       return res.status(401).json({ message: 'identifiant/ mdp incorrect' });
                   }
                   else {
                    // jeton d'authentification avec une clé secrète est créé
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