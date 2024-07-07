const express = require('express');
const router = express.Router();
const wmataMetroStopController = require('../../controllers/wmata/metro-stops');

router.get('/wmata-metro-stops/:metroRoute', async (req, res, next) => {
    const metroRoute = req.params.metroRoute;
    try {
        const metroStops = await wmataMetroStopController.fetchMetroStopData(metroRoute);
        res.json(metroStops);
    } catch (error) {
        console.error('Error fetching bus stops:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;