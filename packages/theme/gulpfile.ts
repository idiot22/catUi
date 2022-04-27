import { series, src, dest } from "gulp";
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import path from 'path'
// 自动添加前缀
import autoPrefixer from 'gulp-autoprefixer'
// 压缩css
import gulpCleanCss from 'gulp-clean-css'
import { outDir } from '../../build/utils/path'

// 编译scss
function compile(){
  // 能将sass转成css
  const sass = gulpSass(dartSass)
  // 注意所有css的入口文件为 src/*.css 文件，其他文件则不进行打包
  return src(path.resolve(__dirname, './src/*.scss'))
  .pipe(sass.sync()) // 解析为css
  .pipe(autoPrefixer()) // 添加前缀
  .pipe(gulpCleanCss()) // 压缩
  .pipe(dest(path.resolve(outDir, 'theme/css')))
}
function copyfont(){
  return src(path.resolve(__dirname, './src/fonts/**'))
  .pipe(dest(path.resolve(outDir, 'theme/fonts')))
}
export default series(compile, copyfont)