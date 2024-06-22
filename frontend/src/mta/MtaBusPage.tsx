
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MtaBusPage = () => {

  const [backendData, setBackendData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/bus`);
      setBackendData(response.data);
      console.log(backendData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Fetch data every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return <div>
  {backendData ? (
      <div>
        {backendData.Siri.ServiceDelivery.StopMonitoringDelivery.map((stop) => (
          <div key={stop.MonitoredStopVisit[0].MonitoredVehicleJourney.VehicleRef}>
            <h2>{stop.MonitoredStopVisit[0].MonitoredVehicleJourney.LineRef}</h2>
            <p>Next bus: {stop.MonitoredStopVisit[0].MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div> 
  };
  
  export default MtaBusPage;