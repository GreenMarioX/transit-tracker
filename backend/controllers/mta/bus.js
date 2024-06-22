

let busData = null;

const fetchBusData = async () => {
  try {
    const response = await fetch('https://bustime.mta.info/api/siri/stop-monitoring.json?key=b1af2818-ea0d-4b2f-b632-5119632b6ae3&OperatorRef=MTA&MonitoringRef=503551');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    busData = await response.json();
    console.log(busData)
  } catch (error) {
    console.error('Fetching data failed', error);
  }
};

// Fetch data initially and then every 30 seconds
fetchBusData();
setInterval(fetchBusData, 30000);

exports.getBusData = (req, res) => {
  if (busData) {
    console.log(busData.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit[0])
    res.json(busData);
  } else {
    res.status(503).send('Data not available');
  }
};
