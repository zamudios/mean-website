/**************************************************************
    Import Node Modules
***************************************************************/
const express = require('express');             // Pulling express package.
const app = express();                          // Initializing and saving express application.
const router = express.Router();                // Create router as a module.
const mongoose = require('mongoose');           // Node Tool for MongoDB.
const config = require('./config/database');    // Import database (Mongoose) configurations.
const path = require('path');                   // NodeJS package for file paths.
const authentication = require('./routes/authentication')(router);      // Import Authentication Routes.
const blogs = require('./routes/blog')(router);
const bodyParser = require('body-parser');      // Parse incoming request bodies in a middleware before handlers, available under the req.body property.
const cors = require('cors');

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, { useMongoClient: true }, (err) =>{
    if (err) {
        console.log('Could not connet to database.', err)
    } else {
        console.log('Connected to database: ' + config.db);
    }
});

// Middleware

// Allow cross origin from angular development server.
app.use(cors({ origin: 'http://localhost:4200' }));

// Provide static directory for frontend.
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json());
// Provide static directory for frontend
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);

// Connect server to angular 4 Index.html
app.get('*', (req, res) => {                    // Handle user GET request.
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 3000.
app.listen(3000, () => {                        // Tell server to listen on port 3000.
    console.log('listening of port 3000');
});