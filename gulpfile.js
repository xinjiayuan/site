var gulp = require('gulp'),
    ejs = require("gulp-ejs"),
    site = require("./data/site-data");

gulp.task('generate', function () {
  return gulp.src("./templates/index.ejs")
    .pipe(ejs({
        menu: site.index.menus,
        submenu: site.index.submenus,
        projects: site.index.projects
    }))
    .pipe(gulp.dest("./dist"));
});


