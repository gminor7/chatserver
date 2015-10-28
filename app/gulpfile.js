var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var fs = require('fs');

gulp.task('browserify', function() {
    gulp.src('src/js/main.js')
      .pipe(browserify({transform:'reactify'}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
  rmDir('./dist',false)
  return gulp.src(['src/index.html','src/css/**/*','src/fonts/**/*','src/images/**/*'], { base: './src' })
    .pipe(gulp.dest('dist')).on('finish',function(){

    });
});

gulp.task('default',['browserify', 'copy']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});

function rmDir(dirPath, removeSelf) {
    if (removeSelf === undefined)
        removeSelf = true;
    try { 
        var files = fs.readdirSync(dirPath); 
    } catch(e) { 
        return; 
    }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rmDir(filePath);
            }
        }
    }
    if (removeSelf) {
        fs.rmdirSync(dirPath);
    }
}