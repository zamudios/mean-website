const express = require('express');             // Pulling express package.
const app = express();                          // Initializing and saving express application.
const mongoose = require('mongoose');
const config = require('./config/database');    // Import database configurations.
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) =>{
    if (err) {
        console.log('Could not connet to database.', err)
    } else {
        console.log('Connected to database: ' + config.db);
    }
});

app.use(express.static(__dirname + '/client/dist'));

app.get('/', (req, res) => {                    // Handle user GET request.
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(3000, () => {                        // Tell server to listen on port 3000.
    console.log('listining of port 3000');
});