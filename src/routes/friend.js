require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

let usernameOne;
let usernameTwo;

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

router.post('/addcode', async (req, res) => {
    try {
        let sql = 'SELECT id, username FROM users WHERE id=$1';
        let params = [ req.body.friendCode ];
        let response = await pool.query(sql, params);
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

            usernameOne = req.body.username;
            usernameTwo = response.rows[0].username;  
            let tableName = createMessageTableName(usernameOne, usernameTwo, req.body.userId, response.rows[0].id);
            sql = 'CREATE TABLE '+tableName+' (id serial PRIMARY KEY, message VARCHAR(5000), sender VARCHAR(255) NOT NULL, picture TEXT, ts VARCHAR(30) NOT NULL)';
            responseAddFriend = await pool.query(sql);
        }
        res.send(response.rows);     
    }
    catch {
        res.send('Account not found')
    }
})
router.post('/addusername', async (req, res) => {
    try {
        let sql = 'SELECT id, username FROM users WHERE username=$1';
        let params = [ req.body.friendUsername ];
        let response = await pool.query(sql, params);
        if(response.rows[0].username === undefined) {
            res.send('no matches');
        }
        else if(response.rows[0].username){
            sql = 'INSERT INTO '+req.body.username+'(friendid, friendusername) VALUES($1, $2) RETURNING *';
            params = [ response.rows[0].id, response.rows[0].username ];
            responseAddFriend = await pool.query(sql, params);
            
            sql = 'INSERT INTO '+response.rows[0].username+'(friendid, friendusername) VALUES($1, $2) RETURNING *';
            params = [ req.body.userId, req.body.username ];
            responseAddFriend = await pool.query(sql, params);

            usernameOne = req.body.username;
            usernameTwo = response.rows[0].username;  
            let tableName = createMessageTableName(usernameOne, usernameTwo, req.body.userId, response.rows[0].id);
            sql = 'CREATE TABLE '+tableName+' (id serial PRIMARY KEY, message VARCHAR(5000), sender VARCHAR(255) NOT NULL, picture TEXT, ts VARCHAR(30) NOT NULL)';
            responseAddFriend = await pool.query(sql);
        }
        res.send(response.rows);
        
    }
    catch {
        res.send('Account not found')
    }
})
router.post('/removefriend', async (req, res) => {
    
    try {
        let sql = 'DELETE FROM '+req.body.username+' WHERE friendusername=$1';
        let params = [ req.body.usernameToRemove ];
        let response = await pool.query(sql, params);

        sql = 'DELETE FROM '+req.body.usernameToRemove+' WHERE friendusername=$1';
        params = [ req.body.username ];
        let responseRemoveFriend = await pool.query(sql, params);

        sql = 'SELECT id, username FROM users WHERE username=$1';
        params = [ req.body.usernameToRemove ];
        let responseTable = await pool.query(sql, params);

        let tableName = await createMessageTableName(req.body.username, req.body.usernameToRemove, req.body.userId, responseTable.rows[0].id);
        sql = 'DROP TABLE '+tableName;
        let responseRemoveTable = await pool.query(sql);
        res.send(response.rows);   
    }
    catch {
        res.send('Trouble connecting to db')
    }
})
router.post('/all', async (req, res) => {
    try {
        let sql = 'SELECT friendid, friendusername FROM '+req.body.username;
        let response = await pool.query(sql);
        for(let i=0; i<response.rows.length; i++) {
            sql = 'SELECT profilepic FROM users WHERE username=$1';
            let params = [ response.rows[i].friendusername ];
            let responseProfilePic = await pool.query(sql, params);
            response.rows[i].friendProfilePic = responseProfilePic.rows[0].profilepic;
        }
        
        res.send(response.rows);
    }
    catch {
        res.send('Trouble connecting to db')
    }
})

module.exports = router;