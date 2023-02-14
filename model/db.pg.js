const dotenv = require('dotenv');
dotenv.config();

/**
 * Connection to database though Client object
 */

const { Client } = require('pg');

/**
 * Database 'smart_parking', postgreSQL
 */
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? true : false
})

client.connect((err) => {
    if (err)
        throw err;
});

module.exports = client