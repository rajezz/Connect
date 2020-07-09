const express = require('express');
const session = require('express-session');
const body_parser = require('body-parser');
const mySql = require('mysql');
const path = require('path');
const faker = require('faker');
const router = require('./router/route');
var port = process.env.PORT || 3000;
var app = express();
app.use(body_parser.urlencoded({ extended: true, }));
app.use(body_parser.json());

app.use('/', router);
app.use(express.static(path.join(__dirname + '/public')));

app.listen(port);