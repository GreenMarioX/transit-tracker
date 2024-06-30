const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 9998
app.use(cors()); // Enable CORS for all routes

const busData = require('./routes/mta/bus.js');
const busStopsData = require('./routes/mta/bus-stops.js')
const busRoutesData = require('./routes/mta/bus-routes.js')

app.use(busData);
app.use(busStopsData);
app.use(busRoutesData);

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });