const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const session = require('express-session');
var flash = require('connect-flash');
const axios = require('axios');
var request = require('request');

const TWO_HOURS = 1000 * 720;
const {
    PORT = 8108,
    NODE_ENV = 'development',
    SESS_LIFETIME = TWO_HOURS,
    SESS_NAME = 'sid',
    SESS_SECRET = 'Miner@!soDc$1'
} = process.env;
const IN_PROD = NODE_ENV === 'production'

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public/'));
app.use('/controllers', express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(express.static('python/repository_mining/repository_data'));
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
app.use('//', routes)
const server = app.listen(PORT, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});