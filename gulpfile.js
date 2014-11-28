'use strict';

//Initalise Gulp
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')()

// Error Handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Define Paths (and some settings)
var paths = {
  style: {
    src: 'src/style',
    main:  'src/style/style.scss',
    files: 'src/style/**/*.scss',
    dest: 'dest'
  },
  icon: {
    src: 'src/icon',
    files: './src/icon/twelve-icons.sketch',
    dest: 'dest/font',
    name: 'ic',
    template: 'icon'
  }
}
// Make sure you check the /src/icon files to adjust to your icon font setup.
gulp.task('icongenerate', function() {
    return gulp.src(paths.icon.files)
    // Pull the artboards from the sketch document.
    // Each artboard counts for one icon.
    .pipe($.sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(gulp.dest(paths.icon.dest + '/singles'))
    // Run the iconfont task after pulling exporting the SVG files.
    .pipe($.iconfont({ fontName: paths.icon.name }))
    .on('codepoints', function(codepoints) {
    var options = {
      glyphs: codepoints,
      fontName: paths.icon.name,
      fontPath: '../font/', // set path to font (from your CSS file if relative)
      className: 'ic' // set class name in your CSS
    };
    // Generate a CSS and SCSS file.
    gulp.src(paths.icon.src + '/' + paths.icon.template + '.css') // Your template file.
      .pipe($.consolidate('lodash', options))
      .pipe(gulp.dest(paths.icon.dest)) // CSS for font preview (Below).
      .pipe($.rename({ basename: '_icon', extname: '.scss' }))
      .pipe(gulp.dest(paths.style.dest)); // SCSS for inclusion.
    // Generate a HTML font preview
    gulp.src(paths.icon.src + '/' + paths.icon.template + '.html')
      .pipe($.consolidate('lodash', options))
      .pipe($.rename({ basename:'icons.sample' }))
      .pipe(gulp.dest(paths.icon.dest)); // set path to export your sample HTML
    })
    .pipe($.debug({verbose: false}))
    .pipe(gulp.dest(paths.icon.dest)) // set path to export your fonts
    .pipe($.size({title: 'font created!'}));
});

// Default gulp task
gulp.task('default', function() {
  gulp.start('icongenerate');
});
