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
        let sql = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
        let params = [ req.body.username, req.body.password ];
        let response = await pool.query(sql, params);

        userTable(response.rows);

        res.send(response.rows);
    }
    catch {
        res.send('Account creation unsuccessful')
    }
})

async function userTable(userData){
    try {
        console.log(userData[0].id);
        let tableName = userData[0].username;
        let sql = 'CREATE TABLE '+tableName+' (id serial PRIMARY KEY, friendId integer NOT NULL, friendUsername VARCHAR(255) NOT NULL)';
        console.log(sql);
        let params = [ tableName ];
        let response = await pool.query(sql);
    }
    catch {
        console.log('failed to create userTable')
    }
}

module.exports = router;