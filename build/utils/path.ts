import { resolve } from 'path'
// 项目根路径
export const projectRoot = resolve(__dirname, '../../')
// 输出的根路径
export const outDir = resolve(__dirname, '../../dist')
// 组件根目录
export const componentRootPath = resolve(__dirname, '../../packages/components')
// 主题根目录
export const themeRootPath = resolve(__dirname, '../../packages/theme')
// 项目入口
export const buildInput = resolve(__dirname, '../../packages/cat-ui')
// 处理 @cat-ui  将 @cat-ui/xxx => cat-ui/es/xxx | cat-ui/lib/xxx
export const pathRewriter = (format: string) => {
  return (id: string) => {
      id = id.replace(/@cat-ui/g, `cat-ui/${format}`)
      return id
  }
}