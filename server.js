require('dotenv').config();

const routes = require('./src/routes/api');

const express = require('express');

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


//routes

app.use('/', routes);

app.listen(process.env.PORT, () => {
    console.log('Server started on port 8000');
});

