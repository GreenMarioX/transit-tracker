const express = require('express');
const router = express.Router();
const mtaBusController = require('../../controllers/mta/bus');

router.get('/bus', mtaBusController.getBusData);

module.exports = router;
