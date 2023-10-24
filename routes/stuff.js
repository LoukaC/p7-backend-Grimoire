const express = require("express");
const router = express.Router();

const stuffCrtl = require("../controllers/stuff");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, stuffCrtl.createThing);
router.delete('/:id', auth, stuffCrtl.deleteThing);
router.get('/', stuffCrtl.getAllStuff);
router.get('/:id', stuffCrtl.getOneThing);
router.put('/:id', auth, multer, stuffCrtl.modifyThing);


module.exports = router;