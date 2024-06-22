const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 9999
const KEY = 'b1af2818-ea0d-4b2f-b632-5119632b6ae3'
app.use(cors()); // Enable CORS for all routes

const busRoutes = require('./routes/mta/bus.js');

app.use(busRoutes);

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });
