import { App, Plugin } from "vue";
// 给组件添加install方法，用于全局注册
export type SFCWithInstall<T> = T & Plugin
export const withInstall = <T>(comp: T) => {
  (comp as SFCWithInstall<T>).install = function(app: App){
    app.component((comp as any).name, comp)
  }
  return comp
}