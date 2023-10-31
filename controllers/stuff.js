const Thing = require('../models/thing');
const fs = require('fs');


exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.book);
   delete thingObject._id;
   delete thingObject._userId;
   const thing = new Thing({
       ...thingObject, // nouvelle instance de "Thing" en utilisant les données de thingObject
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/${req.imagePath}`
   });
  thing.save()
  .then(
    () => {
      res.status(201).json({
        message: 'livre ajoué'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  })
  .then((things) => {res.status(200).json(things);})
  .catch((error) => {res.status(400).json({error: error});})
};

 exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ? {
        ...JSON.parse(req.body.book),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

   delete thingObject._userId;
   Thing.findOne({_id: req.params.id}) //trouver un objet  partir de son ID.
       .then((thing) => {
           if (thing.userId != req.auth.userId) {
               res.status(401).json({ message : 'Non autorisé'});
           } else {// mise à jour de l'objet Thing. 
               const filename = thing.imageUrl.split('/images/')[1]; // recupération du nom de fichier à partir de l'URL
                fs.unlink(`images/${filename}`, () => {// suppression de l'image
                    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                        .catch((error) => res.status(401).json({ error }));
                });
            }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
  };


exports.deleteThing = (req, res, next) => {
   Thing.findOne({ _id: req.params.id})
       .then(thing => {
           if (thing.userId != req.auth.userId) {
               res.status(401).json({message: 'Non autorisé'});
           } else {
               const filename = thing.imageUrl.split('/images/')[1]; //  extrait le nom de fichier de l'URL
               fs.unlink(`images/${filename}`, () => { // suppression de l'image
                   Thing.deleteOne({_id: req.params.id}) // suppression du livre 
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.getAllStuff = (req, res, next) => {
  Thing.find()
  .then((things) => {res.status(200).json(things);})
  .catch((error) => {res.status(400).json({error: error});});
};




exports.rating = (req, res, next) => {

  const userId = req.auth.userId;
  const grade = req.body.rating;

  // Recherche du document à mettre à jour par son ID
  Thing.findById(req.params.id)
    .then(thing => {
      if (!thing) {
        return res.status(404).json({ message: 'Le livre n\'existe pas.' });
      }

      // l'utilisateur ne peut pas voter plusieurs fois
      const ratings = thing.ratings;
      const AlreadyRateByUser = ratings.find((rating) => this.rating.userId == userId);
      if (AlreadyRateByUser != null){
        res.status(400).send("l'utilisateur a deja voté");
        return;
      }


      // Ajout de la nouvelle note à l'array 'ratings'
      thing.ratings.push({ userId: userId, grade: grade });

      // Calcul de la nouvelle moyenne de notation
      const allGrades = thing.ratings.map(item => item.grade);
      const ratingSum = allGrades.reduce((acc, curr) => acc + curr, 0);
      const averageRating = ratingSum / allGrades.length;
      thing.averageRating = averageRating;

      // Sauvegarde des modifications dans la base de données et renvoi du document mis à jour
      return thing.save()
    })
    .then(Thing => {
      res.status(200).json({ 
        message: 'Note ajoutée avec succès.', 
        Thing
        
      });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};


exports.getBestThing = (req, res, next) => {
   Thing.find()
      .sort({averageRating: -1}) // triés par ordre décroissant
      .limit(3)
      .then(bestRatedBook => res.status(200).json(bestRatedBook))
      .catch(error => res.status(400).json({error}))
};