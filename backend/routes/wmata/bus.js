const express = require('express');
const router = express.Router();
const wmataBusController = require('../../controllers/wmata/bus');

router.get('/wmata-bus', async (req, res) => {
    const stopId = req.query.stopId;
    console.log('stopIdDASD:', stopId);
    if (stopId) {
        console.log('stopId:', stopId);
        const data = await wmataBusController.fetchBusData(stopId); // Set the stopId in the controller
        res.json(data);
    }

});

module.exports = router;