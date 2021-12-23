require('dotenv').config();

const twitch = require('./config/twitchGames');

const routes = require('./routes/api');

const express = require('express');


const app = express();

//routes

app.use('/', routes);

app.listen(process.env.PORT, () => {
    console.log('Server started on port 3000');
});

