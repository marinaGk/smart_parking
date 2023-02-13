const express = require('express');
const app = express(); 

const exphbs = require('express-handlebars');

app.use(express.urlencoded({extended: false}));

app.use(express.static('public'));

const routes = require('./routes/routes.cjs');
app.use('/', routes);

app.engine('hbs', exphbs.engine({
  extname: 'hbs', 
  defaultLayout: 'start_page_main.hbs', 
}));

app.set('view engine', 'hbs');

module.exports = app;
