let busStopData = null;

const fetchBusStopData = async (busRoute) => {
    try {
        const url = 'https://api.wmata.com/Bus.svc/json/jRouteDetails?api_key=1fccdf9d3e3940b1bbd4a434dece1aa5&RouteID=' + busRoute;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        busStopData = await response.json();
        return busStopData
    } catch (error) {
        console.error('Fetching data failed', error);
        throw error
    }
};

exports.fetchBusStopData = fetchBusStopData;