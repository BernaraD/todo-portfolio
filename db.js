const Pool = require('pg').Pool
require('dotenv').config();

const devConfig = {
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.PG_DATABASE,
    port: process.env.DBPORT,
};

const prodConfig = {
    connectionString: process.env.DATABASE_URL //heroku add on
}

const pool = new Pool(process.env.NODE_ENV === 'production'? prodConfig : devConfig)

module.exports = pool;