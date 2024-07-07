// subway-data-cleaner.js

const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

function parseGtfsRealtimeData(buffer) {
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

  const parsedData = feed.entity.map(entity => {
    if (entity.tripUpdate) {
      return {
        tripId: entity.tripUpdate.trip.tripId,
        routeId: entity.tripUpdate.trip.routeId,
        stopTimeUpdates: entity.tripUpdate.stopTimeUpdate.map(update => ({
          stopId: update.stopId,
          arrival: update.arrival ? {
            time: update.arrival.time,
            delay: update.arrival.delay
          } : null,
          departure: update.departure ? {
            time: update.departure.time,
            delay: update.departure.delay
          } : null
        }))
      };
    }
    return null;
  }).filter(item => item !== null);

  return parsedData;
}

module.exports = parseGtfsRealtimeData;
