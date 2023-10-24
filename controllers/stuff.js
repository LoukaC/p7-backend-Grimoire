const Thing = require('../models/thing');


exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.book);
   delete thingObject._id;
   delete thingObject._userId;
   const thing = new Thing({
       ...thingObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
   console.log("image:", thing)
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
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
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  const thing = new Thing({
    
  });
  Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
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

exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
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

exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};