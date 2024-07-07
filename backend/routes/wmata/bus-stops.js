const express = require('express');
const router = express.Router();
const wmataBusStopController = require('../../controllers/wmata/bus-stops');

router.get('/wmata-bus-stops/:busRoute', async (req, res, next) => {
    const busRoute = req.params.busRoute;
    try {
        const busStops = await wmataBusStopController.fetchBusStopData(busRoute);
        res.json(busStops);
    } catch (error) {
        console.error('Error fetching bus stops:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;