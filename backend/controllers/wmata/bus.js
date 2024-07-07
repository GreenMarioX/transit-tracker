const cleanWMATABusData = require('./helpers/bus-data-cleaner');

let busData = null;

const fetchBusData = async (stopId) => {
    try {
        const url = 'https://api.wmata.com/NextBusService.svc/json/jPredictions?api_key=1fccdf9d3e3940b1bbd4a434dece1aa5&StopID=' + stopId;
        console.log(url)
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        busData = await response.json();
        return cleanWMATABusData(busData)
    } catch (error) {
        console.error('Fetching data failed', error);
        throw error
    }
};

exports.fetchBusData = fetchBusData;