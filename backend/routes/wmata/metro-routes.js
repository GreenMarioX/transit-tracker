const express = require('express');
const router = express.Router();
const wmataMetroController = require('../../controllers/wmata/metro-routes.js');


router.get('/wmata-metro-routes', async (req, res) => {
    try {
        const data = await wmataMetroController.fetchWMATAMetroRoutesData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bus routes data', error: error.message });
    }
});


module.exports = router;