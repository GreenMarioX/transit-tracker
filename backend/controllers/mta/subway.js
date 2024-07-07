const axios = require('axios');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const parseGtfsRealtimeData = require('./helpers/subway-data-cleaner');

const API_KEY = 'your_api_key_here'; // Replace with your MTA API key

const fetchGtfsRealtimeData = async (url) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            headers: {
                'x-api-key': API_KEY
            }
        });

        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(response.data));
        feed.entity.forEach((entity) => {
            if (entity.tripUpdate) {
              console.log(entity.tripUpdate);
            }
          });
        return feed
    } catch (error) {
        console.error('Error fetching GTFS Realtime data:', error);
    }
};

module.exports = fetchGtfsRealtimeData;
