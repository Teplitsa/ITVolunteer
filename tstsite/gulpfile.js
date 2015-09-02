//paths for source and bundled parts of app
var basePaths = {
    src: 'src/',
    dest: 'assets/',
    bower: 'bower_components/'
};

//require plugins
var gulp = require('gulp');

var es = require('event-stream'),
    gutil = require('gulp-util'),
    mainBowerFiles = require('main-bower-files'),
    bourbon = require('node-bourbon'),
    path = require('relative-path'),
    runSequence = require('run-sequence');

//plugins - load gulp-* plugins without direct calls
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

//env - call gulp --prod to go into production mode
var sassStyle = 'expanded'; // SASS syntax
var sourceMap = true; //wheter to build source maps
var isProduction = false; //mode flag

if(gutil.env.prod === true) {
    isProduction = true;
    sassStyle = 'compressed';
    sourceMap = false;
}

//log
var changeEvent = function(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

//js
gulp.task('build-js', function() {
    var vendorFiles = mainBowerFiles({ //files from bower_components
            paths: {
                bowerDirectory: basePaths.bower,
                bowerJson: 'bower.json'
            }
        }),        
        appFiles = [basePaths.bower+'imagesloaded/imagesloaded.pkgd.min.js',
                    basePaths.bower+'masonry/dist/masonry.pkgd.min.js',                    
                    basePaths.src+'js/*']; //our own JS files

    return gulp.src(vendorFiles.concat(appFiles)) //join them
        .pipe(plugins.filter('*.js'))//select only .js ones
        .pipe(plugins.concat('bundle.js'))//combine them into bundle.js
        .pipe(isProduction ? plugins.uglify() : gutil.noop()) //minification
        .pipe(plugins.size()) //print size for log
        .on('error', console.log) //log
        .pipe(gulp.dest(basePaths.dest+'js')) //write results into file
});


//sass
gulp.task('build-css', function() {

    //paths bourbon
    var paths = require('node-bourbon').includePaths;

    var vendorFiles = gulp.src(''), //components bower_components/chosen/chosen.min.css
        appFiles = gulp.src(basePaths.src+'sass/main.scss') //our main file with @import-s
            .pipe(!isProduction ? plugins.sourcemaps.init() : gutil.noop())  //process the original sources for sourcemap
            .pipe(plugins.sass({
                outputStyle: sassStyle, //SASS syntas
                includePaths: paths //add bourbon + mdl
            }).on('error', plugins.sass.logError))//sass own error log
            .pipe(plugins.autoprefixer({ //autoprefixer
                browsers: ['last 4 versions'],
                cascade: false
            }))
            .pipe(!isProduction ? plugins.sourcemaps.write() : gutil.noop()) //add the map to modified source
            .on('error', console.log); //log

    return es.concat(appFiles, vendorFiles) //combine vendor CSS files and our files after-SASS
        .pipe(plugins.concat('bundle.css')) //combine into file
        .pipe(isProduction ? plugins.cssmin() : gutil.noop()) //minification on production
        .pipe(plugins.size()) //display size
        .pipe(gulp.dest(basePaths.dest+'css')) //write file
        .on('error', console.log); //log
});

//copy bootstrap for local fallback
gulp.task('copy-b-css', function(){

    return gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest(basePaths.dest+'css'));
});

gulp.task('copy-b-js', function(){
    
    var vendor = ['bower_components/jquery/dist/jquery.min.js',
                  'bower_components/bootstrap/dist/js/bootstrap.min.js'];
    
    return gulp.src(vendor)
        .pipe(plugins.concat('vendor.js'))//combine them into vendor.js        
        .pipe(plugins.size()) //print size for log
        .on('error', console.log) //log
        .pipe(gulp.dest(basePaths.dest+'js'));
});

gulp.task('copy-b-fonts', function(){

    return gulp.src('bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest(basePaths.dest+'fonts'));
});

gulp.task('copy-files', function(callback) {
    runSequence('copy-b-css',
        'copy-b-fonts',
        'copy-b-js',        
        callback);
});



//watchers
gulp.task('watch', function(){
    gulp.watch(basePaths.src+'sass/*.scss', ['build-css']).on('change', function(evt) {
        changeEvent(evt);
    });
    gulp.watch(basePaths.src+'js/*.js', ['build-js']).on('change', function(evt) {
        changeEvent(evt);
    });
});


//default
gulp.task('default', ['build-js', 'build-css', 'watch', 'copy-bootstrap']);