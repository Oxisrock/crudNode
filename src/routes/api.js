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
.get('/api/twitch/games/create', (req,res) => {
    twitch.getGames();
    res.json({data:'new games'}).status(202);
    //Twitch.getGames;
})

.get('/api/games', (req,res) => {
    db.executeSQL('SELECT * FROM dbo.games').then((result) => {
        res.json({data:result}).status(202);
    });
})
.post('/api/games/create', (req,res) => {
    const {id,name,image} = req.body;
    if(!id) return res.json({ok:'id required'}).status(404);
    if(!name) return res.json({ok:'name required'}).status(404);
    if(!image) return res.json({ok:'image required'}).status(404);
    db.insertSQL(req.body,({message='',data=null}) => {
        res.json({message,data}).status(data ? 202 : 404);
    });
})

.get('/api/game/:id', (req,res) => {
    let id = req.params.id;
    db.executeSQL('SELECT * FROM dbo.games WHERE id = '+ id).then((result) => {
        res.json({data:result}).status(202);
    });
})

.put('/api/game/update/:id', (req,res) => {
    const {id} = req.params;
    const {name,image} = req.body;
    if(!name) return res.json({ok:'name required'}).status(404);
    if(!image) return res.json({ok:'image required'}).status(404);
    db.updateSQL(id,req.body);
    res.json({data:'updated'}).status(200);
})
.delete('/api/game/delete/:id', (req,res) => {
    let id = req.params.id;
    db.deleteSQL(id);
    res.json({data:'ok'}).status(200);
});

module.exports = router