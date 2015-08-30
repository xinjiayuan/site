var gulp = require('gulp'),
    ejs = require("gulp-ejs"),
    del = require("del"),
    gulpCopy = require('gulp-copy'),
    site = require("./data/site-data");

gulp.task('clean', function(cb) {
    del(['dist'],cb);
});

gulp.task('copy', ['clean'], function() {
 return  gulp.src('./assets/**/*')
  .pipe(gulpCopy("./dist",{prefix:1}));
});

gulp.task('generate', ['copy'], function () {

  return gulp.src("./templates/index.ejs")
    .pipe(ejs(site.index))
    .pipe(gulp.dest("./dist"));
});


