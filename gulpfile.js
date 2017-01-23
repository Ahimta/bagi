'use strict'

const gulp = require('gulp'),
  connect = require('gulp-connect'),
  ghPages = require('gulp-gh-pages')

const WATCHED_FILES_GLOB = '{gulpfile.js,index.html,index.jsx,package.json}'

gulp.task('server:connect', () =>
{
  connect.server({
    livereload: true,
    fallback: './index.html',
    host: 'localhost',
    port: 8080,
    root: './'
  })
})

gulp.task('server:reload', () =>
{
  gulp.src(WATCHED_FILES_GLOB)
    .pipe(gulp.src(WATCHED_FILES_GLOB))
    .pipe(connect.reload())
})

gulp.task('deploy', function ()
{
  return gulp.src(['assets/', 'app.manifest', 'favicon.ico', 'index.html', 'index.jsx'])
    .pipe(ghPages())
})

gulp.task('watch', ['server:connect'], () =>
{
  gulp.watch([WATCHED_FILES_GLOB], ['server:reload'])
})
