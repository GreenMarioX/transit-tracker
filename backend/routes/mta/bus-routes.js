const express = require('express');
const mtaBusRoutesController = require('../../controllers/mta/bus-routes');
const router = express.Router();

router.get('/bus-routes/nyct-routes', async (req, res) => {
    try {
        const data = await mtaBusRoutesController.fetchNYCTBusRoutesData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch NYCT bus routes data', error: error.message });
    }
});

router.get('/bus-routes/bc-routes', async (req, res) => {
    try {
        const data = await mtaBusRoutesController.fetchBCBusRoutesData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch BC bus routes data', error: error.message });
    }
});

module.exports = router;
