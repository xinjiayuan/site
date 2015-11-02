var gulp = require('gulp'),
    ejs = require("gulp-ejs"),
    del = require("del"),
    gulpCopy = require('gulp-copy');

gulp.task('clean', function(cb) {
    del(['dist'],cb);
});

gulp.task('copy', ['clean'], function() {
 return  gulp.src('./assets/**/*')
  .pipe(gulpCopy("./dist",{prefix:1}));
});

gulp.task('generate', ['copy'], function () {
  var generateSite = require("./data/site-data");
  return generateSite();
});

gulp.task('generate-noimg', ['copy'], function () {
  var generateSite = require("./data/site-data");
  return generateSite({'noProjectImage':true});
});
