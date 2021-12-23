const express = require('express');

const db = require('../config/database.js');

const router = express.Router();

router.get('/createdb', (req,res) => {
    let sql = 'CREATE DATABASE twitch_test';
    db.query(sql, (err) => {
        if(err) {
            throw err;
        }

        res.send("Database created");
    });
});

router.get('/createtable', (req,res) => {
    let sql = 'CREATE TABLE twitch_games(id int AUTO_INCREMENT)';
    db.query(sql, (err) => {
        if(err) {
            throw err;
        }

        res.send("Database created");
    });
});

router.get('/games', (req,res) => {
    res.send(twitch.getGames);
});

router.get('/game', (req,res) => {
    res.send(twitch.getGames);
});

router.post('/create_games', (req,res) => {
    res.send(twitch.getGames);
});

router.put('/update_games', (req,res) => {
    res.send(twitch.getGames);
});

router.delete('/delete_games', (req,res) => {
    res.send(twitch.getGames);
});

module.exports = router