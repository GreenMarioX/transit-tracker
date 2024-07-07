let metroStopData = null;

const fetchMetroStopData = async (metroRoute) => {
    try {
        const url = 'https://api.wmata.com/Rail.svc/json/jStations?api_key=1fccdf9d3e3940b1bbd4a434dece1aa5&LineCode=' + metroRoute;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        metroStopData = await response.json();
        return metroStopData
    } catch (error) {
        console.error('Fetching data failed', error);
        throw error
    }
};

exports.fetchMetroStopData = fetchMetroStopData;