var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('selfsigned.key');
var certificate = fs.readFileSync('selfsigned.crt');

var credentials = {key: privateKey, cert: certificate};
const express = require('express');
var app = express();
var bodyParser = require('body-parser');
const session = require('express-session');
var flash = require('connect-flash');
const axios = require('axios');
var request = require('request');

const TWO_HOURS = 1000 * 720;
const {
    PORT = 443,
    NODE_ENV = 'production',
    SESS_LIFETIME = TWO_HOURS,
    SESS_NAME = 'sid',
    SESS_SECRET = 'Miner@!soDc$1'
} = process.env;
const IN_PROD = NODE_ENV === 'production'

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public/'));
app.use('/controllers', express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(express.static('C:/repository_mining/repository_data'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));

const router = express.Router()
const routes = require('./js/routes')(router, {});
app.use('', routes)

//const router = express.Router()
//const routes = require('./js/routes')(router, {});
// const routes = require('./js/routes');
// app.use('//', routes)
// const server = app.listen(PORT, () => {
//     console.log(`Express running → PORT ${server.address().port}`);
// });


var httpsServer = https.createServer(credentials, app);

httpsServer.listen(443);

