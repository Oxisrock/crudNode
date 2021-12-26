
# Variables de entorno dentro de un .env

CLIENT_ID={id de api de twitch}

CLIENT_SECRET={id de api de twitch}

GET_TOKEN=https://id.twitch.tv/oauth2/token {endpoint la cual se genera el token de authentificacion}

GET_GAMES=https://api.twitch.tv/helix/games/top {endpoint la cual se obtiene los games top}

PORT=8000{puerto donde correra el servidor}

SQL_SERVER=DESKTOP-NIDSL5F {server sql server}

SQL_USERNAME=sa {usuario sql server}

SQL_PASS=root {password sql server}

SQL_DB=twitchgames {db sql server}

  

# ENDPOINTS

- [ ]  **POST** {server}/api/start/

Para crear la tabla en la db y hacer los juegos de twitch funcionen como un seeder

- [ ]  **GET** {server}/api/twitch/games

Para traerse los juegos que tiene twitch en su api

  

- [ ] **GET** {server}/api/games

Para traerse los juegos que se tiene registrado en la tabla

  

- [ ] **GET** {server}/api/game/{idTwitch}

Para traerse un juego especifico que se tiene registrado en la tabla

  

- [ ] **PUT** {server}/api/game/update/{idTwitch}

recibe por body : name y image

Para actualizar un juego especifico que se tiene registrado en la tabla

  

- [ ] **DELETE** {server}/api/game/delete/{idTwitch}

Para eliminar un juego especifico que se tiene registrado en la tabla

  

## Se utilizo la siguiente documentacion de la libreria tedious

 - http://tediousjs.github.io/tedious/index.html

  

 - https://docs.microsoft.com/en-us/sql/connect/node-js/step-1-configure-development-environment-for-node-js-development?view=sql-server-ver15
