
const fetchWMATAMetroRoutesData = async () => {
    try {
      const url = 'https://api.wmata.com/Rail.svc/json/jLines?api_key=1fccdf9d3e3940b1bbd4a434dece1aa5';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      WMATARoutesData = await response.json();
      console.log(WMATARoutesData)
      return WMATARoutesData
    } catch (error) {
      console.error('Fetching data failed', error);
      throw error;
    }
  };
  
  module.exports = {
    fetchWMATAMetroRoutesData
  };
  
  