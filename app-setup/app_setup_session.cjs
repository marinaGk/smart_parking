const session = require("express-session");

let currentSession = 

    session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie:{ 
            maxAge: 1000*60*60,
            sameSite: true,
        }
    })

module.exports = currentSession;