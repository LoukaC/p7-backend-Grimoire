const express = require("express");
const router = express.Router();

const stuffCrtl = require("../controllers/stuff");
const auth = require('../middleware/auth');

router.post('/', stuffCrtl.createThing);
router.delete('/:id', stuffCrtl.deleteThing);
router.get('/', stuffCrtl.getAllStuff);
router.get('/:id', stuffCrtl.getOneThing);
router.put('/:id', stuffCrtl.modifyThing);


module.exports = router;