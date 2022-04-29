// https://juejin.cn/post/6956501799327137828
import { resolve } from 'path'
import { parallel } from 'gulp'
import { RollupOptions, OutputOptions, rollup } from 'rollup'
import { buildInput, outDir, pathRewriter } from './utils/path'
import { baseRollupPlugins } from './utils/plugin'
import { readdirSync } from 'fs'
import { buildConfig } from './utils/config'
// 打包cat-ui
const buildFull = async () => {
  // 配置rollup的打包信息
  const rollupBaseConfig: RollupOptions = {
      // 入口文件 cat-ui/index.ts
      input: resolve(buildInput, 'index.ts'),
      plugins: baseRollupPlugins,
      // 过滤vue文件，vue文件单独打包
      external: id => /^vue/.test(id)
  }
  // 打包两种 esm， umd
  // https://rollupjs.org/guide/en/#core-functionality
  const moduleTypeConfig: OutputOptions[] = [
      {
          format: 'umd',
          name: 'catUi', // umd 导出的全局名称
          file: resolve(outDir, 'index.js'), // 打包生成的umd文件
          exports: 'named',
          globals: {
              // 表示使用的vue是全局的
              vue: 'Vue',
          }
      },
      {
          format: 'esm',
          file: resolve(outDir, 'index.esm.js') // esm 入口
      }
  ]

  // 生成一个 bundle
  const bundle = await rollup(rollupBaseConfig)

  // 写入
  return Promise.all(moduleTypeConfig.map(m => {
      // 直接写入，不生成sourceMap
      bundle.write(m)
  }))
}
// 打包入口文件
const buildEntry = async () => {
  // 读取cat-ui目录下的所有内容，包括目录和文件
  // {withFileTypes:true}，返回dirent对象组成的数组  返回字符串组成的数组
  const entryFiles = readdirSync(buildInput, { withFileTypes: true })

  // 过滤掉 不是文件的内容和package.json文件  index.ts 作为打包入口
  const entryPoints = entryFiles
      .filter((f) => f.isFile())
      .filter((f) => !['package.json'].includes(f.name))
      .map((f) => resolve(buildInput, f.name))

  const config = {
      input: entryPoints,
      plugins: baseRollupPlugins,
      external: (id: string) => /^vue/.test(id) || /^@cat-ui/.test(id)
  }
  const bundle = await rollup(config)
  return Promise.all(
      Object.values(buildConfig)
          .map((config) => ({
              format: config.format,
              dir: config.output.path,
              paths: pathRewriter(config.output.name),
              exports: config.format === 'cjs' ? 'named' : undefined
          }))
          .map((option) => bundle.write(option as OutputOptions))
  )
}
export const buildFullComponents = parallel(
  buildFull,
  buildEntry
)