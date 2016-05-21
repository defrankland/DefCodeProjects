var express = require('express'),
  routes = require('./routes'),
	http = require('http'),
	path = require('path'),
  mongoskin = require('mongoskin');


// default to a 'localhost' configuration:
var dbUrl = 'mongodb://127.0.0.1:27017/defcodeprojects';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  dbUrl = 'mongodb://' +
  process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var db = mongoskin.db(dbUrl, {safe: true})
var collections = {
  projects: db.collection('projects')
};

	
// Express.js Middleware
var logger = require('morgan'),
  errorHandler = require('errorhandler'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

//App code	
var app = express();

app.locals.appTitle = 'DEF Code Projects';

// Expose collections to request handlers
app.use(function(req, res, next) {
  if (!collections.projects) return next(new Error('No collections.'))
  req.collections = collections;
  return next();
});

// Express.js configurations

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080 
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
if (typeof ip === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    ip = "127.0.0.1";
};
        
app.set('port', port);
app.set('ip', ip);
var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Express.js middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

/* Controllers */
app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/api/projects/', routes.project.list);
app.get('/api/projects/:projectUrl', routes.project.loadProject);
app.get('/about', routes.about.about);
app.get('/public/*', function(req, res) {
  res.sendFile(req.originalUrl.split('?')[0], { root: __dirname });
 });
app.all('*', function(req, res) {
  res.send(404);
})

var boot = function () {
  server.listen(app.get('port'), app.get('ip'), function(){
    console.info('Express server listening on port ' + app.get('port'));
  });
}

var shutdown = function() {
  server.close();
}

if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
