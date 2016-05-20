var express = require('express'),
  routes = require('./routes'),
	http = require('http'),
	path = require('path'),
  mongoskin = require('mongoskin'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/def-projects',
  db = mongoskin.db(dbUrl, {safe: true}),
  collections = {
  projects: db.collection('projects')
};
	
// Express.js Middleware
var session = require('express-session'),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

//App code	
var app = express();
var server = http.createServer(app);

app.locals.appTitle = 'DEF Code Projects';

// Expose collections to request handlers
app.use(function(req, res, next) {
  if (!collections.projects) return next(new Error('No collections.'))
  req.collections = collections;
  return next();
});

// Express.js configurations
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Express.js middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}))
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
  server.listen(app.get('port'), function(){
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
