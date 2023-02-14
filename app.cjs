const express = require('express');
const app = express(); 

const dotenv = require('dotenv'); 
dotenv.config(); 

const exphbs = require('express-handlebars');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const currentSession = require("./app-setup/app_setup_session.cjs");
app.use(currentSession);

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.tripid = req.session.tripid;
  next();
})

const routes = require('./routes/routes.cjs');
app.use('/', routes);

app.engine('hbs', exphbs.engine({
  extname: 'hbs', 
  defaultLayout: 'start_page_main.hbs', 
}));

app.set('view engine', 'hbs');

module.exports = app;
