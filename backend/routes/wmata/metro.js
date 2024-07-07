const express = require('express');
const router = express.Router();
const wmataMetroController = require('../../controllers/wmata/metro');

router.get('/wmata-metro', async (req, res) => {
    const stopId = req.query.stopCode;
    if (stopId) {
        console.log('stopId:', stopId);
        const data = await wmataMetroController.fetchMetroData(stopId); // Set the stopId in the controller
        res.json(data);
    }

});

module.exports = router;