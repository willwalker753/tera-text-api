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
        let password = req.body.password;
        let saltRounds = 10;
        let hash = bcrypt.hashSync(password, saltRounds);
        password = hash;   
        let sql = 'INSERT INTO users(username, password, profilepic) VALUES($1, $2, $3) RETURNING *';
        let params = [ req.body.username, password, req.body.profilePic ];
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
        let tableName = userData[0].username;
        let sql = 'CREATE TABLE '+tableName+' (id serial PRIMARY KEY, friendId integer NOT NULL, friendUsername VARCHAR(255) NOT NULL)';
        let params = [ tableName ];
        let response = await pool.query(sql);
    }
    catch {
        console.log('failed to create userTable')
    }
}

module.exports = router;