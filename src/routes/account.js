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

// Creates table name with two usernames. the username with the lower id goes first
function createMessageTableName(usernameOne, usernameTwo, userIdOne, userIdTwo){
    if(userIdOne > userIdTwo){
        let temp = usernameOne;
        usernameOne = usernameTwo;
        usernameTwo = temp;
    }
    return usernameOne + usernameTwo;
}

router.post('/profilepic/get', async (req, res) => {
    try {
        let sql = 'SELECT profilepic FROM users WHERE username=$1';
        params = [ req.body.username ];
        let response = await pool.query(sql, params);
        res.send(response)
    }
    catch {
        res.send('Failed to get profile picture')
    }
})

router.post('/profilepic/update', async (req, res) => {
    try {
        let sql = "UPDATE users SET profilepic='"+req.body.picture.base64+"' WHERE username='"+req.body.username+"'";
        let response = await pool.query(sql);
        res.send(response)
    }
    catch {
        res.send('Failed to update profile picture')
    }
})

router.post('/delete', async (req, res) => {
    try {  
        // Remove login info   
        let sql = 'DELETE FROM users WHERE username=$1';
        let params = [ req.body.username ];
        let response = await pool.query(sql, params);
        // Get friend list
        sql = 'SELECT friendId, friendusername FROM '+req.body.username;
        let responseFriends = await pool.query(sql);  
        responseFriends = responseFriends.rows; 
        // Iterate over friend list removing user's name from each friend's table and deleting shared message tables
        for(let i=0; i<responseFriends.length; i++){
            sql = 'DELETE FROM '+responseFriends[i].friendusername+' WHERE friendusername=$1';
            params = [ req.body.username ]; 
            response = await pool.query(sql, params);
            let friendTable = createMessageTableName(req.body.username, responseFriends[i].friendusername, req.body.userId, responseFriends[i].friendid)
            sql = 'DROP TABLE IF EXISTS '+friendTable;
            response = await pool.query(sql);
        }
        // Drop user's own table
        sql = 'DROP TABLE IF EXISTS '+req.body.username;
        response = await pool.query(sql);
        res.send(response)
    }
    catch {
        res.send('Unable to delete account')
    }
})

module.exports = router;