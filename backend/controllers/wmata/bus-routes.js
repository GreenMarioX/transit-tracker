
const fetchWMATABusRoutesData = async () => {
  try {
    const url = 'https://api.wmata.com/Bus.svc/json/jRoutes?api_key=1fccdf9d3e3940b1bbd4a434dece1aa5';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    WMATARoutesData = await response.json();
    return WMATARoutesData
  } catch (error) {
    console.error('Fetching data failed', error);
    throw error;
  }
};

module.exports = {
  fetchWMATABusRoutesData
};

