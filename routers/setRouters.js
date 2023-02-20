const express = require('express');
const router = express.Router();

const setController = require("../controllers/setController");

router.post('/setKeyValue',setController.setvalue);
router.post('/setHashKeyValue',setController.setHashValue);

module.exports = router;