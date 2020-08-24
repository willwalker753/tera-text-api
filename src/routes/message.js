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

function createMessageTableName(usernameOne, usernameTwo, userIdOne, userIdTwo){
    if(userIdOne > userIdTwo){
        let temp = usernameOne;
        usernameOne = usernameTwo;
        usernameTwo = temp;
    }
    return usernameOne + usernameTwo;
}

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

router.post('/send', async (req, res) => {
    try {
        let ts = new Date();
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

router.post('/send/pic', async (req, res) => {
    try{
        let ts = new Date();
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