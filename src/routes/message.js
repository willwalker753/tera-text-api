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
    console.log(req.body)
    try {
        let tableName = createMessageTableName(req.body.username, req.body.friendUsername, req.body.userId,  req.body.friendId);
        let sql = 'SELECT id, message, sender, ts FROM '+tableName;  
        let messageResponse = await pool.query(sql);
        res.send(messageResponse);
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
        console.log(req.body.text, req.body.username, ts)
        let messageResponse = await pool.query(sql, params);
        res.send(messageResponse);
    }
    catch {
        res.send('Cannot post message')
    }
})

module.exports = router;