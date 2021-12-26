const express = require('express');

const Database = require('../database/Database');

const Twitch = require('../database/Twitchgames');

const router = express.Router();

const config = {
    server: process.env.SQL_SERVER,
    authentication: {
      type: 'default',
      options: {
        userName: process.env.SQL_USERNAME,
        password: process.env.SQL_PASS,
      },
    },
    options: {
      database: process.env.SQL_DB,
    },
  };

const db = new Database(config);
const twitch = new Twitch();
db.connect();
router
.post('/api/start/', async (req,res) => {
    const games = await twitch.getGames();
    const gamesFormated = games.data.map((item) => ({
        name:item.name,
        image:item.box_art_url.replace('{width}','285').replace('{height}','380'),
        idTwitch:item.id
    }));
    db.createTable(gamesFormated);
    res.json({data:'SEEDER'}).status(202).end();
})
.get('/api/twitch/games/', async (req,res) => {
    
    const games = await twitch.getGames();
    
    res.json({data:games.data}).status(202).end();
})

.get('/api/games', (req,res) => {
    db.executeSQL(`SELECT * FROM dbo.${process.env.SQL_DB}`).then((result) => {
        res.json({data:result}).status(202).end();
    });
})
.post('/api/games/create', async (req,res) => {
    const {id_twitch,name,image} = req.body;
    
    if(!id_twitch) return res.json({ok:'id required'}).status(404);
    if(!name) return res.json({ok:'name required'}).status(404);
    if(!image) return res.json({ok:'image required'}).status(404);

    try {
        const insert = await db.insertSqlPromise(req.body) 
        res.json(insert).status(202).end();
    } catch (error) {
        res.json(error).status(404).end();
    }
    
})

.get('/api/game/:id', (req,res) => {
    const {id} = req.params;
    db.executeSQL(`SELECT * FROM dbo.${process.env.SQL_DB} WHERE idTwitch = `+ id).then((result) => {
        res.json({data:result}).status(202).end();
    });
})

.put('/api/game/update/:id', (req,res) => {
    const {id} = req.params;
    const {name,image} = req.body;
    if(!name) return res.json({ok:'name required'}).status(404);
    if(!image) return res.json({ok:'image required'}).status(404);
    db.updateSQL(id,req.body);
    res.json({data:'updated'}).status(200).end();
})
.delete('/api/game/delete/:id', (req,res) => {
    const {id} = req.params;
    db.deleteSQL(id);
    res.json({data:'DELETED'}).status(200).end();
});

module.exports = router