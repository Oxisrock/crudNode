const axios = require('axios');

var access_key = '' ;


const getToken = (url) => {
    const options = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials',
    }

    axios.post(url,options)
      .then(function (response) {
        access_key = response.data.access_token;
      })
      .catch(function (error) {
        console.log(error);
      });
}

getToken(process.env.GET_TOKEN);

const getGames = (url,access_key) => {
    headers = {
        'Client-ID':process.env.CLIENT_ID,
        'Authorization': 'Bearer ' + access_key
    };

    axios.get(url, {headers})
    .then(function (response) {
        // handle success
        return(response.data);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });

}

setTimeout(() => {
    getGames(process.env.GET_GAMES,access_key);
}, 2000);
