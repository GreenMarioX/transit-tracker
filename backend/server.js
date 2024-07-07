const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 9998
app.use(cors()); // Enable CORS for all routes

const busData = require('./routes/mta/bus.js');
const busStopsData = require('./routes/mta/bus-stops.js')
const busRoutesData = require('./routes/mta/bus-routes.js')
const wmataBusRoutes = require('./routes/wmata/bus-routes.js')
const wmataBusStops = require('./routes/wmata/bus-stops.js')
const wmataBusPredictions = require('./routes/wmata/bus.js')
const mtaSubwayPredictions = require('./routes/mta/subway.js')
const wmataMetroRoutes = require('./routes/wmata/metro-routes.js')
const wmataMetroStops = require('./routes/wmata/metro-stops.js')
const wmataMetroPredictions = require('./routes/wmata/metro.js')

app.use(busData);
app.use(busStopsData);
app.use(busRoutesData);
app.use(wmataBusRoutes);
app.use(wmataBusStops)
app.use(wmataBusPredictions)
app.use(mtaSubwayPredictions)
app.use(wmataMetroRoutes)
app.use(wmataMetroStops)
app.use(wmataMetroPredictions)


app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });