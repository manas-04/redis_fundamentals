const express = require('express');
const router = express.Router();

const findController = require("../controllers/findController");

router.get("/partialSearch",findController.partialSearch);
router.get("/paginatedSearch",findController.paginatedSearch);
// router.get('/paginatedSearchInHash',findController.searchingInHash);

module.exports = router;