const express = require('express');
const router = express.Router();

const findController = require("../controllers/findController");

router.get("/partialSearch",findController.partialSearch);

module.exports = router;