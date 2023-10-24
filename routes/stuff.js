const express = require("express");
const router = express.Router();

const stuffCrtl = require("../controllers/stuff");
const auth = require('../middleware/auth');

router.post('/', auth, stuffCrtl.createThing);
router.delete('/:id', auth, stuffCrtl.deleteThing);
router.get('/', stuffCrtl.getAllStuff);
router.get('/:id', stuffCrtl.getOneThing);
router.put('/:id', auth, stuffCrtl.modifyThing);


module.exports = router;