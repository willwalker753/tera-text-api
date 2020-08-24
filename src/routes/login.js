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

router.post('/', async (req, res) => {
    try {
        let sql = 'SELECT password FROM users WHERE username=$1';
        let params = [ req.body.username ];
        let responseHashedPassword = await pool.query(sql, params);
        let hashedPassword = responseHashedPassword.rows[0].password;
        if(bcrypt.compareSync(req.body.password, hashedPassword)) {
            sql = 'SELECT * FROM users WHERE username=$1 AND password=$2';
            params = [ req.body.username, hashedPassword ];
            let response = await pool.query(sql, params);
            res.send(response.rows);
        } 
        else {
            res.send(null)
        }
        
    }
    catch {
        res.send('Account not found')
    }
})

module.exports = router;