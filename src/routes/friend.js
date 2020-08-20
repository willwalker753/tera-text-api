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

router.post('/addcode', async (req, res) => {
    try {
        //console.log(req.body)
        let sql = 'SELECT id, username FROM users WHERE id=$1';
        let params = [ req.body.friendCode ];
        let response = await pool.query(sql, params);
        //console.log(response);
        if(response.rows[0].id === undefined) {
            res.send('no matches');
        }
        else if(response.rows[0].id){
            sql = 'INSERT INTO '+req.body.username+'(friendid, friendusername) VALUES($1, $2) RETURNING *';
            params = [ response.rows[0].id, response.rows[0].username ];
            responseAddFriend = await pool.query(sql, params);
            
            sql = 'INSERT INTO '+response.rows[0].username+'(friendid, friendusername) VALUES($1, $2) RETURNING *';
            params = [ req.body.userId, req.body.username ];
            responseAddFriend = await pool.query(sql, params);
        }
        res.send(response.rows);
        
    }
    catch {
        res.send('Account not found')
    }
})
router.post('/all', async (req, res) => {
    console.log(req)
    try {
        let sql = 'SELECT friendid, friendusername FROM '+req.body.username;
        let response = await pool.query(sql);
        res.send(response.rows);
    }
    catch {
        res.send('Trouble connecting to db')
    }
})

module.exports = router;