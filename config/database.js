const mysql = require('mysql');

//Create connection

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

//connect to Mysql

db.connect(error => {
    if (error) {
        throw error;
    }
    console.log('Mysql Connect');
});


/*
var Connection = require('tedious').Connection;

  var config = {
    server: "localhost", // or "localhost"
    options: {},
    authentication: {
      type: "default",
      options: {  
        userName: "root",
        password: "",
      }
    }
  };

  var connection = new Connection(config);

  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error: ', err)
    }
    // If no error, then good to go...
    executeStatement();
  });

  // Initialize the connection.
  connection.connect();
*/

module.exports = db