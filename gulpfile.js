var gulp = require('gulp')
var forever = require('forever-monitor')
var gulpWatch = require('gulp-watch')
var foreverProcess = null

gulp.task('watch', ()=> {
  var targets = [
    'src/*.json',
    'src/*.js',
    'test/*.js',
  ]
  gulpWatch(targets, ()=> {
    gulp.start('restart')
  })
})

gulp.task('server', function () {
  foreverProcess = new forever.Monitor('./test/index.js').start()
})

gulp.task('restart', ()=> {
  foreverProcess.restart()
})



gulp.task('default', ['server', 'watch'])