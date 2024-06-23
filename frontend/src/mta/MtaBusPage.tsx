
import { useEffect, useState } from 'react';
import axios from 'axios';

const MtaBusPage = () => {

  const [backendData, setBackendData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/bus`);
      setBackendData(response.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    console.log("HERE", backendData);
  }, [backendData]);
  
  return(
  <div>
      {backendData ? (
        <div>
          <p>Data Received Time: {backendData.DataReceivedTime}</p>
          {backendData.MonitoredStopVisit.map((bus, index) => (
            <div key={index}>
              --------------------------------------------------------------------------------------------------
              <h2>{bus.PublishedLineName}, Vehicle {bus.VehicleNumber}</h2>
              <p>Destination: {bus.DestinationName}, Direction: {bus.DirectionRef}</p>
              <p>Expected Arrival Time: {bus.ExpectedArrivalTime}</p>
              <p>Aimed Arrival Time: {bus.AimedArrivalTime}</p>
              <p>Expected Departure Time: {bus.ExpectedDepartureTime}</p>
              <p>Aimed Departure Time: {bus.AimedDepartureTime}</p>
              <p>Capacity: {bus.EstimatedPassengerCount}/{bus.EstimatedPassengerCapacity}</p>
              <p>Current Position: ({bus.Longitude}, {bus.Latitude}), Bearing: {bus.Bearing}</p>
              <p>Monitored?: {bus.isMonitored === true? "No" : "Yes"}, Progress Rate: {bus.ProgressRate}</p>
              <p>{bus.PresentableDistance}, Stops Away: {bus.StopsFromCall}, CallDistanceAlongRoute: {bus.CallDistanceAlongRoute}</p>
              <p>Stroller Allowed: {bus.StrollerBehicle === true ? "No" : "Yes"}</p>
            
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
};
  
  export default MtaBusPage;