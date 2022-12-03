/**
 * Connection to database though Client object
 */

const { Client } = require('pg');

/**
 * Database 'smart_parking', postgreSQL
 */
const client = new Client({
    user: 'marty',
    host: 'localhost',
    database: 'smart_parking',
    password: 'madagascar1234',
    port: 5432,
});

/*const client = new Client ({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { 
        rejectUnauthorized: false
    }
});*/

client.connect((err) => {
    if (err)
        throw err;
});

module.exports = client