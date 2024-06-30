const express = require('express');
const router = express.Router();
const mtaBusStopController = require('../../controllers/mta/bus-stops');

router.get('/bus-stops/:busRoute', async (req, res, next) => {
    const busRoute = req.params.busRoute;
    try {
        const busStops = await mtaBusStopController.getBusStopData(busRoute);
        res.json(busStops);
    } catch (error) {
        console.error('Error fetching bus stops:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
