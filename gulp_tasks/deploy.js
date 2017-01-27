const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');

const conf = require('../conf/gulp.conf');

gulp.task('deploy', () => {
  return gulp.src(conf.path.dist('**/*'))
    .pipe(ghPages());
});
