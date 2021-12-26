const { Connection } = require('tedious');
const { Request } = require('tedious');
const TYPES = require('tedious').TYPES;  
const Twitch = require('../database/Twitchgames');
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

  createTable(games) {
    const sql = `CREATE TABLE ${process.env.SQL_DB} ([id] [int] IDENTITY(1,1) PRIMARY KEY,[name] [NVarChar](500),[image] [NVarChar](500), [idTwitch] [int])`;
    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
  
      console.log(`'${process.env.SQL_DB}' created!`);
      this.loadBulkData(games);
    });
  
    this.instance.execSql(request);
  }

  loadBulkData(games) {
    const option = { keepNulls: true }; // option to enable null values
    const bulkLoad = this.instance.newBulkLoad(process.env.SQL_DB, option, (err, rowCont) => {
      if (err) {
        throw err;
      }
  
      console.log('rows inserted :', rowCont);
      console.log('DONE!');
      this.instance.close();
    });
  
    // setup columns
    bulkLoad.addColumn('name', TYPES.NVarChar, {nullable: true });
    bulkLoad.addColumn('image', TYPES.NVarChar, {nullable: true });
    bulkLoad.addColumn('idTwitch', TYPES.Int, { nullable: true });
    this.instance.execBulkLoad(bulkLoad, games);    
    // perform bulk insert
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
  
      const request = new Request(
        `DELETE FROM dbo.${process.env.SQL_DB} WHERE idTwitch = @id;`,
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
      `UPDATE dbo.${process.env.SQL_DB} SET name=@name, image=@image WHERE idTwitch = @id;`,
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

  insertSqlPromise = async (item={}) => {
    return new Promise((resolve,reject) => {
      const request = new Request(`INSERT dbo.${process.env.SQL_DB} (name,image,idTwitch) OUTPUT INSERTED.idTwitch VALUES (@name,@image,@idTwitch);`, (err, rowCount, rows) => {  
        if (err) {
          reject(err);
      } else {
          //console.log(rowCount + ' row(s) inserted');
          
      }
    });
    
    request.addParameter('name', TYPES.NVarChar, item.name);

    request.addParameter('image', TYPES.NVarChar , item.image);
    
    request.addParameter('idTwitch', TYPES.Int, item.id_twitch);

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted",  (rowCount, more) =>  {
      resolve({message: 'REGISTRO', item });
    });

    this.instance.execSql(request);  
    
    })
  }
}