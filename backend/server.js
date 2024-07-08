const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 9998
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
const DB_URI = 'mongodb://localhost:27017/GoUSA';

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            console.error('JWT verification error:', err); // Log the verification error
            return res.sendStatus(403); // Return 403 Forbidden for invalid tokens
        }
        req.user = user; // Set the authenticated user information in the request object
        next();
    });
}

mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

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
const users = require('./routes/users.js')

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
app.use('/api/users', users);

app.post('/api/users/register', async (req, res) => {
    console.log('Register endpoint called');
    console.log('Request body:', req.body); // Log the request body
  
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ error: 'Username and password are required' });
    }
  
    // Your registration logic here
    res.status(201).send({ message: 'User registered successfully' });
  });
  
  app.post('/api/users/login', async (req, res) => {
    console.log('Login endpoint called');
    console.log('Request body:', req.body); // Log the request body
  
    const { username, password } = req.body;
    if (!username || !password) {
      console.log('Login failed: Username and password are required');
      return res.status(400).send({ error: 'Username and password are required' });
    }
  
    // Simulate login failure for demonstration purposes
    const isLoginSuccessful = username === 'correctUsername' && password === 'correctPassword';
  
    if (!isLoginSuccessful) {
      console.log('Login failed: Invalid username or password');
      return res.status(401).send({ error: 'Invalid username or password' });
    }
  
    res.status(200).send({ token: 'fake-jwt-token', user: { id: 'user-id', username } });
  });

  app.get('/api/users/me', authenticateToken, (req, res) => {
    // Return user details based on authenticated user (req.user)
    res.json(req.user); // Assuming req.user contains user data
});


app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });