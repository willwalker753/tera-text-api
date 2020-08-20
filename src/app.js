require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { Pool } = require('pg')
const app = express()

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const friendRoute = require('./routes/friend');

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/friend', friendRoute);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app