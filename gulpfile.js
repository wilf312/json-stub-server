var gulp = require('gulp')
var forever = require('forever-monitor')
var gulpWatch = require('gulp-watch')
var foreverProcess = null

gulp.task('watch', ()=> {
  var targets = [
    'server/*.json',
    'server/*.js',
  ];
  gulpWatch(targets, ()=> {
    gulp.start('restart')
  })
})

gulp.task('server', function () {
    foreverProcess = new forever.Monitor('./server/server.js').start();
});


gulp.task('restart', ()=> {
    foreverProcess.restart()
})



gulp.task('default', ['server', 'watch'])