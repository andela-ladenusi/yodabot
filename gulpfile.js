var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('watch', function () {
  gulp.watch('scripts/*.js', ['default', 'yoda']);
});

gulp.task('yoda', shell.task('HUBOT_SLACK_TOKEN=xoxb-4491956418-LUBmGhLmi2Mve6KJzOYZZvGV ./bin/hubot --adapter slack'));

gulp.task('default', ['yoda', 'watch']);