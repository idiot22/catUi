import { series } from "gulp";
import { withTaskName } from "../build/utils";
import { resolve, join } from 'path'
import { getShellParamsByConfig } from "../scripts/getShellParams";
import { componentRootPath, themeRootPath } from "../build/utils/path";
import { readFileSync, appendFileSync, existsSync } from 'fs'
import { mkdir, sed, touch } from 'shelljs'

const write = (path: string, data: string) => sed('-i', '', data, path)
const firstCharToUp = (name: string) => name.slice(0, 1).toUpperCase() + name.slice(1)
// 把a-b-c改成 aBC
const dealWithTemplateName = (name: string) => name.split('-').reduce((result: string, value: string, index: number) => {
  if (value) {
      result += index > 0 ? firstCharToUp(value) : value
  }
  return result
}, '')
const getFile = (path: string) => readFileSync(resolve(__dirname, path), 'utf-8')


export default series(
  withTaskName('generate template', async ()=> {
    // 创建模版没有给模版名字时，默认为
    let templateName = `template_${new Date().valueOf()}`
    let [t] = getShellParamsByConfig()
    if(t){
      templateName = t
    }
    const upTemplateName = dealWithTemplateName(t)
    console.log(upTemplateName, 'upTemplateName')
    const replaceName = (data: string, up: boolean = true): string => data.replace(/Component/g, firstCharToUp(upTemplateName)).replace(/component/g, up ? upTemplateName : templateName)
    // 组件入口
    const componentEntryPath = resolve(componentRootPath, templateName)
    // 组件安装路径
    const installPath = resolve(componentEntryPath, 'index.ts')
    // 组件脚本路径
    const componentScriptPath = resolve(componentEntryPath, `src/${ upTemplateName }.ts`)
    const componentPath = resolve(componentEntryPath, `src/${ templateName }.vue`)
    const scssPath = join(themeRootPath, `/src/component/${ templateName }.scss`)
    // 判断是否存在
    if (existsSync(componentPath)) {
      throw new Error(`${ templateName } 控件已存在`)
    }
    // 生成文件夹
    mkdir(componentEntryPath, resolve(componentEntryPath, 'src'))
    // 生成脚本文件
    touch(installPath, componentScriptPath, componentPath, scssPath)
    
    // 写入内容
    write(installPath, replaceName(getFile('./index.ts'), false))
    write(componentScriptPath, replaceName(getFile('./src/component.ts')))
    write(
        componentPath,
        getFile('./src/component.vue')
            .replace(/component([Emits|Props])/g, `${ upTemplateName }$1`)
            .replace(/(\.\/)component/g, `$1${ upTemplateName }`)
            .replace(/(Ci)Component/g, `$1${ firstCharToUp(upTemplateName) }`)
    )
    write(scssPath, getFile('./template.scss').replace(/component/g, templateName))
    // 导出
    appendFileSync(resolve(componentRootPath, 'index.ts'), `export * from './${ templateName }'\n`)
    appendFileSync(resolve(themeRootPath, 'src/component/index.scss'), `@use './${ templateName }.scss';\n`)

    // 生成模板
    console.log('模板已生成在', componentEntryPath)
  })
)