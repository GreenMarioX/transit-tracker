// routes/subway-routes.js

const express = require('express');
const router = express.Router();
const fetchGtfsRealtimeData = require('../../controllers/mta/subway');

// Define a route to fetch GTFS Realtime data with a URL parameter
router.get('/nyct-subway', async (req, res) => {
    console.log('nyct called')
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const data = await fetchGtfsRealtimeData(url);
        res.json(data);
    } catch (error) {
        console.error('Error fetching GTFS Realtime data:', error);
        res.status(500).json({ error: 'Failed to fetch GTFS Realtime data' });
    }
});

module.exports = router;
