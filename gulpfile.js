var gulp = require('gulp')
var forever = require('forever-monitor')
var gulpWatch = require('gulp-watch')
var foreverProcess = null

gulp.task('watch', ()=> {
  var targets = [
    'src/*.json',
    'src/*.js',
  ]
  gulpWatch(targets, ()=> {
    gulp.start('restart')
  })
})

gulp.task('server', function () {
  foreverProcess = new forever.Monitor('./src/index.js').start()
})

gulp.task('restart', ()=> {
  foreverProcess.restart()
})



gulp.task('default', ['server', 'watch'])