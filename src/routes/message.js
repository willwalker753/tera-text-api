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

// Creates table name with two usernames. the username with the lower id goes first
function createMessageTableName(usernameOne, usernameTwo, userIdOne, userIdTwo){
    if(userIdOne > userIdTwo){
        let temp = usernameOne;
        usernameOne = usernameTwo;
        usernameTwo = temp;
    }
    return usernameOne + usernameTwo;
}

// Get friend profile pic
router.post('/profilepic', async (req, res) => {
    try {
        let sql = 'SELECT profilepic FROM users WHERE username=$1';  
        let params = [ req.body.friendUsername ];
        let response = await pool.query(sql, params);
        res.send(response.rows[0])
    }
    catch {
        res.send('Friend profile pic not found')
    }
})

// Get all messages with friend
router.post('/all', async (req, res) => {
    try {
        let tableName = createMessageTableName(req.body.username, req.body.friendUsername, req.body.userId,  req.body.friendId);
        let sql = 'SELECT id, message, picture, sender, ts FROM '+tableName +' ORDER BY id DESC';  
        let messageResponse = await pool.query(sql);
        if(messageResponse.rows.length === req.body.numOfMessages) {
            messageResponse = '';
            res.send(messageResponse)            
        }
        else{
            res.send(messageResponse);
        }
    }
    catch {
        res.send('Messages not found')
    }
})

// Send a text message
router.post('/send', async (req, res) => {
    try {
        let ts = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});
        let tableName = createMessageTableName(req.body.username, req.body.friendUsername, req.body.userId,  req.body.friendId);
        let sql = 'INSERT INTO '+tableName+'(message, sender, ts) VALUES($1, $2, $3) RETURNING *';
        let params = [ req.body.text, req.body.username, ts ];
        let messageResponse = await pool.query(sql, params);
        res.send(messageResponse);
    }
    catch {
        res.send('Cannot post message')
    }
})


// Send a picture
router.post('/send/pic', async (req, res) => {
    try{
        let ts = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});
        let base64 = req.body.picture.base64;
        let tableName = createMessageTableName(req.body.username, req.body.friendUsername, req.body.userId,  req.body.friendId); 
        let sql = 'INSERT INTO '+tableName+'(picture, sender, ts) VALUES($1, $2, $3)';
        let params = [ base64, req.body.username, ts ];
        await pool.query(sql, params);
        res.send('Image successfully sent');
    }
    catch{
        res.send('Image could not be sent sent');
    }
})

module.exports = router;