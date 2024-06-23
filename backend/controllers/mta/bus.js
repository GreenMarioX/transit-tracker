const cleanMTABusData = require('./helpers/bus-data-cleaner');

let busData = null;

const fetchBusData = async (stopID) => {
  try {
    const response = await fetch('https://bustime.mta.info/api/siri/stop-monitoring.json?key=b1af2818-ea0d-4b2f-b632-5119632b6ae3&OperatorRef=MTA&MonitoringRef=' + stopID);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }   
    busData = await response.json();
    // console.log(cleanMTABusData(busData))
  } catch (error) {
    console.error('Fetching data failed', error);
  }
};

// Fetch data initially and then every 30 seconds
fetchBusData(502184);
setInterval(() => fetchBusData(502184), 30000);

exports.getBusData = (req, res) => {
  if (busData) {
    const cleanedData = cleanMTABusData(busData);
    res.json(cleanedData);
  } else {
    res.status(503).send('Data not available');
  }
};
