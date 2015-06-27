var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('yodabot', function(){
	nodemon({ script: 'index.js' });
});

gulp.task('default', ['yodabot']);