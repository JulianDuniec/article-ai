var path = require('path'),
	stylus = require('stylus'),
	expressController = require('express-controller'),
	_ = require('underscore'),
	http = require('http'),
	express = require('express');

module.exports = function(options) {
	var me = {
		
		//Port that server listens to
		port : options.port,

		//Contains the express-app
		app : null,
		
		init : function() {
			//Since configure looses context when we call app.configure,
			//we need to bind the context
			_.bindAll(this, "configure");

			//Creates the app-object
			this.createApp();

			//Set the app to use the configure-method
			this.app.configure(this.configure);
		},

		/*
			Creates the app-object
		*/
		createApp : function() {
			this.app = express();
		},

		/*
			Middleware that sets global variables for all requests.
		*/
		setLocals : function(req, res, next) {
			
			
			next();
		},

		/*
			Configures the app-object
		*/
		configure : function() {
			//Configure view-engine
			this.app.set('views', __dirname + '/../views');
			this.app.set('view engine', 'jade');
			this.app.use(express.favicon(__dirname + '/../public/images/favicon.ico'));
			this.app.use(express.logger('dev'));
			this.app.use(express.methodOverride());
			this.app.use(express.static(path.join(__dirname, '/../public'), {
				maxAge : 31557600000
			}));
			this.app.use(express.cookieParser());

			this.app.use(express.cookieSession({ 
				secret: '1o23okm123908j123ijn', 
				cookie: { maxAge: 60 * 60 * 1000 }}));

			this.app.use(express.bodyParser({
				//Required for file-uploads to work
				keepExtensions : true,
			}));

			this.app.use(
				stylus.middleware({
						src : __dirname + '/../public/',
						force : true,
						compress : true
					}));

			this.app.use(this.setLocals);
		},

		/*
			Starts the server
		*/
		start : function() {
			//Start a http-server and listen to the port
			http.createServer(this.app).listen(this.port).listen(function() {

			});
			//Create routing
			expressController
	            .setDirectory(__dirname + '/../controllers')
	            .bind(this.app);
		}
	};
	
	//Automatically call init() on creation
	me.init();

	return me;
};