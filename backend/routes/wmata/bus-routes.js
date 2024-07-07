const express = require('express');
const router = express.Router();
const wmataBusController = require('../../controllers/wmata/bus-routes.js');


router.get('/wmata-bus-routes', async (req, res) => {
    try {
        const data = await wmataBusController.fetchWMATABusRoutesData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bus routes data', error: error.message });
    }
});


module.exports = router;