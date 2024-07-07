

let metoData = null;

const fetchMetroData = async (stopId) => {
    try {
        const url = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stopId + '?api_key=1fccdf9d3e3940b1bbd4a434dece1aa5';
        console.log(url)
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        metroData = await response.json();
        return metroData
    } catch (error) {
        console.error('Fetching data failed', error);
        throw error
    }
};

exports.fetchMetroData = fetchMetroData;