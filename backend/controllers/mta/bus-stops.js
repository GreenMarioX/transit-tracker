const cleanMTAStopsData = require('./helpers/bus-stop-data-cleaner');

let busStopData = null;

const fetchBusStopData = async (busRoute) => {
    try {
        const url = `https://bustime.mta.info/api/where/stops-for-route/${encodeURIComponent(busRoute)}.json?key=b1af2818-ea0d-4b2f-b632-5119632b6ae3&includePolylines=false&version=2`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }   
        busStopData = await response.json();
        cleaned = await cleanMTAStopsData(busStopData)
        return cleaned
    } catch (error) {
        console.error('Fetching data failed', error);
        throw error
    }
};

exports.fetchBusStopData = fetchBusStopData;

exports.getBusStopData = async (busRoute) => {
    try {
        const busStops = await fetchBusStopData(busRoute);
        return busStops;
    } catch (error) {
        throw error; // Rethrow any errors caught during data fetching
    }
};
