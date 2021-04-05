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
const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');
const accountRoute = require('./routes/account');

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50MB' }));
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/friend', friendRoute);
app.use('/user', userRoute);
app.use('/message', messageRoute);
app.use('/account', accountRoute);

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