const mssql = require('mssql');
const {database} = require('./keys');

// const poolPromise = mssql.connect(database);

const poolPromise = new mssql.ConnectionPool(database)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// mssql.connect(database, (err) => {
//   if (err) return console.error(err);
//   console.log("SQL DATABASE CONNECTED");
// });

module.exports = {
    mssql, poolPromise
}