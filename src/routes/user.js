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

router.post('/', async (req, res) => {
    try {
        let responseArr = [];
        let username = req.body.username;
        let userId = req.body.userId;
        let sql = 'SELECT friendid, friendusername FROM '+username;
        let response = await pool.query(sql);
        let friendArr = response.rows
        for(let i=0;i<friendArr.length;i++){
            let tableName = createMessageTableName(username, friendArr[i].friendusername, userId, friendArr[i].friendid);
            sql = 'SELECT message, ts FROM '+tableName+' ORDER BY id DESC LIMIT 1';
            let responseMessage = await pool.query(sql);
            sql = 'SELECT profilepic FROM users WHERE username=$1';
            let params = [ friendArr[i].friendusername ];
            let responseProfilePic = await pool.query(sql, params);
            if(responseMessage.rows[0]){
                responseArr[i] = { 
                    friendusername: friendArr[i].friendusername, 
                    friendid: friendArr[i].friendid, 
                    friendmessage: responseMessage.rows[0].message,
                    friendts: responseMessage.rows[0].ts,
                    friendProfilePic: responseProfilePic.rows[0].profilepic
                }
            }
            else{
                responseArr[i] = { 
                    friendusername: friendArr[i].friendusername, 
                    friendid: friendArr[i].friendid, 
                    friendmessage: 'No messages yet',
                    friendts: '',
                    friendProfilePic: responseProfilePic.rows[0].profilepic
                }
            }
            
        }
        res.send(responseArr);
    }
    catch {
        res.send('Account not found')
    }
})

module.exports = router;