const express = require("express");
const router = express.Router();

const stuffCrtl = require("../controllers/stuff");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp');

router.get('/bestrating', stuffCrtl.getBestThing);
router.get('/:id', stuffCrtl.getOneThing);
router.put('/:id', auth, multer, sharp, stuffCrtl.modifyThing);
router.delete('/:id', auth, multer, stuffCrtl.deleteThing);
router.get('/', stuffCrtl.getAllStuff);
router.post('/', auth, multer, sharp, stuffCrtl.createThing);
router.post('/:id/rating', auth, stuffCrtl.rating);

module.exports = router;