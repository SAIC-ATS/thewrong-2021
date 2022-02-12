var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var proxy = require('express-http-proxy');

var mjpegProxy = require("mjpeg-proxy").MjpegProxy;
var mjpegUrl = "http://192.168.0.90/mjpg/video.mjpg";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/camera', 
    createProxyMiddleware({ 
        target: 'http://root:root@192.168.0.90/', 
        changeOrigin: true, 
        hostRewrite: true, 
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {

            console.log("PROXY REQEUST " + proxyReq.path);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log("proxy RES")
        },
        autoRewrite: true, 
        pathRewrite: {'^/camera' : '/'}
}));

app.get('/feed', new mjpegProxy(mjpegUrl).proxyRequest);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
