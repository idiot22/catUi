# 搭建过程
## 待学习知识点
+ ts命名空间
## 工具安装
```ts
npm i pnpm
pnpm init -y
pnpm i vue@next typescript -D
pnpm init
```
```ts
pnpm -C play dev //-C就是哪个模块下
```
### package下模块
每个模块下都要`pnpm init -y`<br>
然后去根目录安装这些包
```ts
pnpm i @cat-ui/components -w
```
## 组件
### 组件注册
```ts
import { App, Plugin } from "vue";
// 给组件添加install方法，用于全局注册
export type SFCWithInstall<T> = T & Plugin
export const withInstall = <T>(comp: T) => {
  (comp as SFCWithInstall<T>).install = function(app: App){
    app.component((comp as any).name, comp)
  }
  return comp
}
```
### 组件的按需加载
### 样式
到`theme`文件夹看结构

## 打包
gulp控制打包流程，打包采用rollup
### 结构
### 样式打包
```ts
pnpm i gulp-sass @types/gulp-sass @types/sass @types/gulp-autoprefixer gulp-autoprefixer @types/gulp-clean-css gulp-clean-css sass -D -w
```
### ts文件打包
buildTs

## 自动生成组件模版