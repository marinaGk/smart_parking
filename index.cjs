const app = require('./app.cjs');
const dotenv = require('dotenv');
dotenv.config();


const port = process.env.APP_PORT;

const server = app.listen(port, () => { console.log("Listening to port " + port + "using database" + process.env.DATABASE_URL) });

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
    });
});
