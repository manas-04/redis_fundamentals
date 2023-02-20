const express = require('express');
const router = express.Router();

const getController = require("../controllers/getController");

router.get("/getValue",getController.getValue);
router.get("/getHashValue",getController.getHashValue);

module.exports = router;