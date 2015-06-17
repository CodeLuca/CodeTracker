var express = require('express');
var exphbs  = require('express-handlebars');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var db = mongojs('mongodb://localhost:27017/codetracker', ['users']);
var session = require('express-session')
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: '1234567890QWERTY'}));

app.use(express.static(__dirname + '/views'));
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');
 
app.get('/', function (req, res) {
    if(!req.session.username){
      res.redirect('/login');
    } else {
      res.redirect('/home')
    }
});

require('./js/search.js')(app, db);
require('./js/admin.js')(app, db);
require('./js/login.js')(app, db);
require('./js/home.js')(app, db);

var port = 3000;
app.listen(port);
console.log('Listening on Port: ' + port)