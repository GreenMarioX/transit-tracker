const axios = require('axios');
const xml2js = require('xml2js');

const fetchStopData = async (stopId) => {
  const key = 'b1af2818-ea0d-4b2f-b632-5119632b6ae3';
  const url = `https://bustime.mta.info/api/where/stop/${stopId}.xml?key=${key}`;

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    // Parse the XML data
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    // Return the parsed stop data
    return result.response.data[0];
  } catch (error) {
    console.error('Error fetching or parsing XML data:', error);
    throw error;
  }
};

const getStopsData = async (idList) => {
  const stopData = [];

  try {
    // Iterate over idList with a for loop to ensure sequential processing
    for (let i = 0; i < idList.length; i++) {
      const stopId = idList[i];
      try {
        const stopInfo = await fetchStopData(stopId);
        if (stopInfo) {
          stopData.push({
            id: stopInfo.id[0],
            name: stopInfo.name[0],
            longitude: stopInfo.lon ? parseFloat(stopInfo.lon[0]) : 0,
            latitude: stopInfo.lat ? parseFloat(stopInfo.lat[0]) : 0,
            direction: stopInfo.direction ? parseFloat(stopInfo.direction[0]) : 0,
            code: stopInfo.code[0],
            locationType: stopInfo.locationType[0]
          });
        }
      } catch (error) {
        console.error(`Error fetching data for stop ID ${stopId}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching stop data:', error);
  }
  return stopData;
};

const cleanMTAStopsData = async (stopsData) => {
  const newStopsData = {
    route: stopsData.data.entry.routeId,
    zeroDirDest: stopsData.data.entry.stopGroupings[0].stopGroups[0].name.name,
    zeroDirStopsData: [],
    oneDirDest: stopsData?.data?.entry?.stopGroupings[0]?.stopGroups[1]?.name?.name || "Refer Above (Bus is a Loop)",
    oneDirStopsData: []
  };

  // Fetch and populate stop data for zero direction stops
  const zeroDirStopsIds = stopsData.data.entry.stopGroupings[0].stopGroups[0].stopIds;
  newStopsData.zeroDirStopsData = await getStopsData(zeroDirStopsIds);
  // Fetch and populate stop data for one direction stops
  if (stopsData?.data?.entry?.stopGroupings[0]?.stopGroups[1]?.stopIds) {
    const oneDirStopsIds = stopsData.data.entry.stopGroupings[0].stopGroups[1].stopIds;
    newStopsData.oneDirStopsData = await getStopsData(oneDirStopsIds);
  }

  return newStopsData;
};

module.exports = cleanMTAStopsData;