require('dotenv').config();

const axios = require('axios');
module.exports = class Twitchgames {
    access_key = '';
    getToken = () => {
        const options = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'client_credentials',
        }
    
        axios.post(process.env.GET_TOKEN,options)
          .then(function (response) {
            return response.data.access_token;
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    
    getGames = () => {
        console.log(this.getToken());
        const headers = {
            'Client-ID':process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + access_key
        };
        setTimeout(() => {
            axios.get(process.env.GET_GAMES, {headers})
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }, 1000);
    
    }    
}