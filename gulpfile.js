'use strict'

const gulp = require('gulp'),
  connect = require('gulp-connect'),
  ghPages = require('gulp-gh-pages')

const WATCHED_FILES_GLOB = '{gulpfile.js,index.html,index.jsx,package.json}'

gulp.task('server:connect', () =>
{
  return connect.server({
    livereload: true,
    fallback: './index.html',
    host: 'localhost',
    port: 8080,
    root: './'
  })
})

gulp.task('server:reload', () =>
{
  return gulp.src(WATCHED_FILES_GLOB)
    .pipe(gulp.src(WATCHED_FILES_GLOB))
    .pipe(connect.reload())
})

gulp.task('deploy', function ()
{
  // HACK
  const assetsGlob = '**/*.png'
  return gulp.src([assetsGlob, 'app.manifest', 'favicon.ico', 'index.html', 'index.jsx'])
    .pipe(ghPages())
})

gulp.task('watch', ['server:connect'], () =>
{
  return gulp.watch([WATCHED_FILES_GLOB], ['server:reload'])
})
