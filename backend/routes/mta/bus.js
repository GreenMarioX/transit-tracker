const express = require('express');
const router = express.Router();
const mtaBusController = require('../../controllers/mta/bus');

router.get('/bus', async (req, res) => {
  const stopId = req.query.stopId;

  if (stopId) {
    await mtaBusController.setStopId(stopId); // Set the stopId in the controller
  }

  // Fetch cleaned bus data and send it back to the frontend
  mtaBusController.getBusData(req, res);
});

module.exports = router;
