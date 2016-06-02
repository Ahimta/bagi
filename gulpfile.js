'use strict'

let gulp = require('gulp'),
    changed = require('gulp-changed'),
    connect = require('gulp-connect'),
    ghPages = require('gulp-gh-pages')

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
  gulp.src('{gulpfile.js,index.html,index.jsx,package.json}')
    .pipe(changed('{gulpfile.js,index.html,index.jsx,package.json}'))
    .pipe(connect.reload())
})

gulp.task('deploy', function ()
{
  let remoteUrl = 'https://github.com/Ahimta/bagi.git'
  return gulp.src('{index.html,index.jsx}')
    .pipe(ghPages())
})

gulp.task('watch', ['server:connect'], () =>
{
  gulp.watch(['{gulpfile.js,index.html,index.jsx,package.json}'], ['server:reload'])
})
