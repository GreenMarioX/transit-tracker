// src/components/MTASubwayPage.tsx

import React, { useState, useEffect } from 'react';

interface StopTimeUpdate {
  stopId: string;
  arrival?: {
    time: number;
    delay?: number;
  } | null;
  departure?: {
    time: number;
    delay?: number;
  } | null;
}

interface Trip {
  tripId: string;
  routeId: string;
  stopTimeUpdates: StopTimeUpdate[];
}

const MTASubwayPage: React.FC = () => {
  const [data, setData] = useState<Trip[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g';
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9998/nyct-subway/?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result)
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='overflow-scroll'>
      <h1>MTA Subway Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MTASubwayPage;
