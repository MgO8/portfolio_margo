require("dotenv").config();
const gulp = require("gulp");

const isProd = process.env.NODE_ENV === "production";

const fs = require("fs");

const sass = require("gulp-sass")(require('node-sass')),
  cssmin = require("gulp-clean-css"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  browserSync = require("browser-sync"),
  webpack = require("webpack-stream"),
  path = require("path"),
  ejs = require("gulp-ejs"),
  rename = require("gulp-rename");

const webpackConfig = isProd
  ? require("./webpack.prod.js")
  : require("./webpack.dev.js");

const reload = browserSync.reload;
const { watch } = gulp;

const PATHS = {
  src: {
    scss: "src/scss/app.scss",
    ejs: [
      "src/templates/index.ejs"
    ],
    img: "src/img/*",
    fonts: "src/fonts/*",
    // js: {
    //   root: path.resolve("src/js"),
    //   entry: "src/js/index.ts",
    // },
  },
  build: {
    css: "dist/css",
    html: "dist",
    img: "dist/img",
    // js: "dist/js",
    fonts: "dist/fonts",
  },
  webpackPublicPath: "/js",
  serveDir: "./dist",
  watchDir: "src/**",
};

/* Собираем scss */
const buildSass = () => {
  return (
    gulp
      .src(PATHS.src.scss)
      .pipe(
        sass({
          includePaths: [path.join(__dirname, "/node_modules")],
        })
      )
      // .pipe(postcss([autoprefixer()]))
      .pipe(cssmin())
      .pipe(gulp.dest(PATHS.build.css))
      .pipe(reload({ stream: true }))
  );
};

const buildImg = () => {
  return (
    gulp
      .src(PATHS.src.img)
      // .pipe(
      //   imagemin([
      //     imagemin.gifsicle({ interlaced: true }),
      //     imagemin.jpegtran({ progressive: true }),
      //     imagemin.optipng({ optimizationLevel: 5 }),
      //     imagemin.svgo({
      //       plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
      //     })
      //   ])
      // )
      .pipe(gulp.dest(PATHS.build.img))
    // .pipe(reload({ stream: true }))
  );
};

const buildFonts = () => {
  return gulp
    .src(PATHS.src.fonts)
    .pipe(gulp.dest(PATHS.build.fonts))
  // .pipe(reload({ stream: true }));
};

const buildTS = () => {
  return gulp
    .src(PATHS.src.js.entry)
    .pipe(webpack(webpackConfig(PATHS)))
    .pipe(gulp.dest(PATHS.build.js))
    .pipe(reload({ stream: true }));
};

const buildEjs = () => {
  const json = fs.readFileSync(path.join(__dirname, "./src/templates/lang/ru.json"));
  const ru = JSON.parse(json);
  return gulp
    .src(PATHS.src.ejs)
    .pipe(ejs(ru))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(PATHS.build.html))
    .pipe(reload({ stream: true }));
};

const buildStatic = () => {
  return gulp
    .src("static/**")
    .pipe(gulp.dest("dist/static/"))
}

const build = gulp.parallel(buildSass, buildImg, buildEjs, buildFonts, buildStatic);

const serve = gulp.series(build, () => {
  browserSync.init({
    server: PATHS.serveDir,
    open: false // dont open browser
  });

  watch(PATHS.watchDir, build);
});

module.exports = {
  build,
  serve,
};
