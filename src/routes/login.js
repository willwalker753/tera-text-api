require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({  
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

router.post('/', async (req, res) => {
    try {
        let sql = 'SELECT * FROM users WHERE username=$1 AND password=$2';
        let params = [ req.body.username, req.body.password ];
        let response = await pool.query(sql, params);
        res.send(response.rows);
    }
    catch {
        res.send('Account not found')
    }
})

module.exports = router;