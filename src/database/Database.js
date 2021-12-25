const { Connection } = require('tedious');
const { Request } = require('tedious');
const TYPES = require('tedious').TYPES;  
  
module.exports = class Database {
  defaultConfig = {
    server: 'process.env.SQL_SERVER',
    authentication: {
      type: 'default',
      options: {
        userName: 'username',
        password: 'password',
      },
    },
    options: {
      database: 'databasename',
    },
  };

  config = {};

  instance = {};

  constructor(config = this.defaultConfig) {
    this.config = config;
    this.instance = new Connection(this.config);
  }

  connect() {
    this.instance.on('connect', async err => {
      if (err) return console.log(err);
    
      console.log('SQL SERVER CONNECTED');
    
    });
    this.instance.connect();
  }
  //READ and QUERY
  async executeSQL(query = '') {
    return new Promise( async (resolve) => {
      const request = new Request(query, err => {
        if (err) return console.log(err);
      });

        let response = [];

        request.on('row', columns => {
          const results = columns.reduce((acm,item) => {
            const key = item.metadata.colName;
            const val = item.value;
            return {...acm, [key]:val};
          },{});
          response = [...response,results];
        });
        /*
        request.on('done', function(rowCount, more) {  
          console.log(rowCount + ' rows returned');  
        });  
        */
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            resolve(response);
        });
        this.instance.execSql(request);  
    });
  }

  deleteSQL(id) {
    console.log("Deleting '" + id + "' from Table...");
  
      const request = new Request(
          'DELETE FROM dbo.games WHERE id = @id;',
          function(err, rowCount, rows) {
          if (err) {
              console.log(err);
          } else {
              console.log(rowCount + ' row(s) deleted');
          }
          });
      request.addParameter('id', TYPES.Int, id);
  
      // Execute SQL statement
      request.on("requestCompleted", function (rowCount, more) {
        console.log('DELETE GAME'+ id);
      });
      this.instance.execSql(request);
  }

  updateSQL(id, req, callback = () => null) {

    // Update the employee record requested
    const request = new Request(
    'UPDATE dbo.games SET name=@name, image=@image WHERE id = @id;',
    function(err, rowCount, rows) {
        if (err) {
        callback(err);
        } else {
        console.log(rowCount + ' row(s) updated');
        callback(null, 'Jared');
        }
    });
    
    request.addParameter('id', TYPES.Int, id);
    request.addParameter('name', TYPES.NVarChar, req.name);
    request.addParameter('image', TYPES.NVarChar, req.image);
    
    request.on("requestCompleted", function (rowCount, more) {
      console.log('UPDATE GAME'+ id);
    });
    // Execute SQL statement
    this.instance.execSql(request);
}

  insertSQL(req, callback = (options = {message: '',data: null}) => undefined, onError = (error) => null) {
    const request = new Request("INSERT dbo.games (id, name, image) OUTPUT INSERTED.id VALUES (@id, @name, @image);", function(err) {  
        if (err) {
          onError(err);  
        }  
      });  

      request.addParameter('id', TYPES.Int, req.id);  
      request.addParameter('name', TYPES.NVarChar,req.name);  
      request.addParameter('image', TYPES.NVarChar , req.image);  

      request.on('row', function(columns) {  
          columns.forEach(function(column) {  
            if (column.value === null) { 
              console.log({message: 'Row not found', data:null});  
            } else {
              callback({message: 'Create new row', data:column.value});   
            }  
          });  
      });

      // Close the connection after the final event emitted by the request, after the callback passes
      request.on("requestCompleted", function (rowCount, more) {
        console.log('registro');
      });
      this.instance.execSql(request);  
  }  
}