require('dotenv').config();

const axios = require('axios');
module.exports = class Twitchgames {
    accessKey = '';
    constructor() {
        (async () => {
           this.accessKey = await this.getToken();
        })();
        
    }
    getToken = async () => {
        const options = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'client_credentials',
        }
    
        const {data:tokenData} = await axios.post(process.env.GET_TOKEN,options);
        
        
        return tokenData.access_token;
    }
    
    getGames = async () => {
        const headers = {
            'Client-ID':process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + this.accessKey
        };
        const {data:games} = await axios.get(process.env.GET_GAMES, {headers});
        
        return games;
    }    
}