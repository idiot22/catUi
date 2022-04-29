import * as components from '@cat-ui/components'
import { App } from 'vue'
const install = (app: App) => {
  Object.entries(components).forEach(([name, component]) => {
    // 注册控件
    app.component(name, component)
  })
}
export default {
  install
}
// 可以按需导入
export * from '@cat-ui/components'
