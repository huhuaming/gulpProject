// 导入工具包，require("node_modules里对应模块")
var gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),          // 压缩html
    rev =require("gulp-rev-append"),            // 给页面引用url添加版本号，以清除页面缓存
    compass = require("gulp-compass"),          // compass编译scss,生成雪碧图
    autoprefixer =require("gulp-autoprefixer"), // 自动处理浏览器前缀
    cssmin = require("gulp-clean-css"),         // 压缩css
    imagemin = require("gulp-imagemin"),        // 压缩图片
    pngquant = require("imagemin-pngquant"),    // 深度压缩图片
    cache = require("gulp-cache"),              // 只压缩修改的图片
    jshint = require('gulp-jshint'),            // JS语法检测
    uglify = require('gulp-uglify'),            // JS丑化
    concat = require('gulp-concat'),            // JS拼接
    browserSync =require("browser-sync"),       // 浏览器同步
    reload = browserSync.reload;                // 自动刷新

// 定义当前工作路径
var path={
    dev:{
        html:"src/jbrain/html",
        css:"src/jbrain/css",
        scss:"src/jbrain/scss",
        img:"src/jbrain/img",
        js:"src/jbrain/js"
    },
    dist:{
        html:"dist/jbrain/html",
        css:"dist/jbrain/css",
        img:"dist/jbrain/img",
        js:"dist/jbrain/js"
    }
}

// 定义web服务模块，增加浏览器同步浏览
gulp.task("browser-sync",function(){
    browserSync({
        server:{
            baseDir:"."
        }
    });
});

// html相关任务
gulp.task("htmlTask",function(){
    // var options={
    //     removeComments:true,                // 清除HTML注释
    //     collapseWhitespace:true,            // 压缩HTML
    //     collapseBooleanAttrbutes:true,      // 省略布尔属性的值(个人觉得这个不该要)<input checked="true" /> ==> <input />
    //     removeEmptyAttributes:true,         // 删除所有空格作属性值  <input id="" />  ==> <input />
    //     removeScriptTypeAttributes:true,    // 删除<script>的type="text/javascript"
    //     removeStyleLinkTypeAttributes:true, // 删除<style>和<link>的type="text/css"
    //     minifyJs:true,                      // 压缩页面内JS
    //     minifyCSS:true                      // 压缩页面内CSS
    // };
    gulp.src(path.dev.html+'/*.html')          // 该任务针对的文件(**表示html文件夹下0个或多个文件夹)
        .pipe(htmlmin(options))                // 压缩html
        .pipe(rev())                           // 给页面引用添加版本号
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({stream:true}));
});

// scss相关任务
/*
gulp.task("scssTask",function(){
    gulp.src(path.dev.scss+"/*.scss")
        .pipe(compass({
            config_path:"./config.rb",         //配置文件
            css:path.dev.css,                  //编译路径
            sass:path.dev.scss,                //scss路径
            image:path.dev.img                 //图片路径，用于生成雪碧图
        }))
        .pipe(autoprefixer({
            browsers:["last 2 versions","last 1 Explorer versions"],    //主流浏览器最新2个版本与IE最新版本
            cascade:true,                   //美化属性值
            remove:true                     //去掉不必要的前缀
        }))
        //.pipe(cssver())                     //css文件引用URL（background：url之类）加版本号
        //.pipe(cssmin())                     //在开发环境src中用config.rb编译成未压缩的css,在上线之前将css压缩到生产环境中dist
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({stream:true}));
});*/

// css相关任务,如果并不是scss项目，可执行这段代码
gulp.task("cssTask",function(){
    gulp.src(path.dev.css+"/.css")
        .pipe(autoprefixer({
            browsers:["last 2 versions","last 1 Explorer versions"],    //主流浏览器最新2个版本与IE最新版本
            cascade:true,                   //美化属性值
            remove:true                     //去掉不必要的前缀
        }))
        .pipe(cssver())                     //css文件引用URL（background：url之类）加版本号
        //.pipe(cssmin())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({stream:true}));
});

// img相关任务
gulp.task("imgTask",function(){
    gulp.src(path.dev.img+"/*.{png,jpg,gif,ico}")
        .pipe(cache(imagemin({
            optimizationLevel: 5,           //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true,              //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true,               //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true,                //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()]               //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({stream:true}));
});

// js相关任务
gulp.task('jsTask', function() {
    gulp.src(path.dev.js+'/*.js')
        //.pipe(concat("all.js"))              //合并js，合并后的文件名为all.js,其实一般并不需要合并js
        // .pipe(uglify({
        //     mangle:true,                     //是否修改变量名，默认：true
        //     compress:true,                   //是否完全压缩，默认：true
        //     preserveComments:"all"           //保留所有注释
        // }))
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({stream:true}));
});

//定义默认任务
gulp.task("default",function(){
    gulp.run("browser-sync","htmlmin","compass","jsmin","imagemin");
    //检测文件发送变化 - 分开监听为了执行对应的命令
    gulp.watch(path.dev.html+"/*.html",["htmlmin"]);
    gulp.watch(path.dev.scss+"/*.scss",["compass"]);
    gulp.watch(path.dev.img+"/*.{png,jpg,gif,ico}",["imagemin"]);
    gulp.watch(path.dev.js+"/*.js",["jsmin"]);
});
