global.t = require('moment');

var cookieParser = require('cookie-parser'),
    env = process.env.NODE_ENV || 'development',
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    routes = require('./api/routes');

(function run(appdir) {

  app.use(cookieParser());

  app.dir = appdir;

  // things to do on each request
  app.use(function (req, res, next) {
    // log each request in development environment
    if(env !== 'production') console.log(t().format('HH:MM'), req.method, req.url, req.socket.bytesRead); 

    res.cookie('apiKey', 'AIzaSyC-32P8uWFJzEu7mqXdL-8T9A0ISR5811I');

    next();
  });

  // static files
  app.use(express.static(app.dir + '/public'));

  // Standard error handling
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  // to support JSON-encoded bodies
  app.use(bodyParser.json({limit: '2000mb'}));
  // to support URL-encoded bodies
  app.use(bodyParser.urlencoded({
    limit: '2000mb', extended: true
  }));

  routes(app);

  // Fire up server
  var server = app.listen(process.env.PORT || 7000, function() {
    console.log('Listening on port %d', server.address().port);
  });
})(process.cwd());

module.exports = app;