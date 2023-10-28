const express = require("express");
const router = express.Router();

const stuffCrtl = require("../controllers/stuff");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.get('/:id', stuffCrtl.getOneThing);
router.put('/:id', auth, multer, stuffCrtl.modifyThing);
router.delete('/:id', auth, multer, stuffCrtl.deleteThing);
router.get('/', stuffCrtl.getAllStuff);
router.post('/', auth, multer, stuffCrtl.createThing);
router.get('/bestrating', stuffCrtl.getBestThing);


module.exports = router;