require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({  
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

router.post('/profilepic', async (req, res) => {
    try {
        let sql = "UPDATE users SET profilepic='"+req.body.picture.base64+"' WHERE username='"+req.body.username+"'";
        let response = await pool.query(sql);
        res.send(response)
    }
    catch {
        res.send('Failed to update profile picture')
    }
})

module.exports = router;