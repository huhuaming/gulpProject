var gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),      //压缩html
    rev =require("gulp-rev-append"),        //给页面引用url添加版本号，以清除页面缓存
    compass = require("gulp-compass"),      //compass编译scss,生成雪碧图
    autoprefixer =require("gulp-autoprefixer"), //自动处理浏览器前缀
    cssmin = require("gulp-clean-css"),     //压缩css
    imagemin = require("gulp-imagemin"),    //压缩图片
    pngquant = require("imagemin-pngquant"),//深度压缩图片
    cache = require("gulp-cache"),          //只压缩修改的图片
    browserSync =require("browser-sync"),   //浏览器同步
    reload = browserSync.reload;            //自动刷新


