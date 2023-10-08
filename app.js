const express = require('express')
const app = express();
const ErrorMiddleware = require('./middlewares/error')
const cookieParser = require('cookie-parser')
const path = require('path')

app.use(express.json());
app.use(cookieParser());
app.use('/upload',express.static(path.join(__dirname,'upload')))


const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');

app.use('/api/v1/',products);
app.use('/api/v1/',auth);
app.use('/api/v1/',order);

app.use(ErrorMiddleware)
module.exports = app;