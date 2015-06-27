var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var http = require('http');

var env = process.env.NODE_ENV;

if (env === 'production') {
	var apiHost = process.env.YODABOT_API_URL;
	// keep the yodabotapi server alive;
	setInterval(function() {
    http.get(apiHost);
	}, 3000);
}

gulp.task('yodabot', function(){
	nodemon({ script: 'index.js' });
});

gulp.task('default', ['yodabot']);