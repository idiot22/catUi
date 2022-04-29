// 解析ts
import ts from 'rollup-plugin-typescript2'
// 为了解析不带扩展名的导入 默认值 extensions: [ '.mjs', '.js', '.json', '.node' ]
import { nodeResolve } from '@rollup/plugin-node-resolve'
// 用于将CommonJS模块转换为ES6，这样它们就可以被包含在Rollup包中
import commonJs from '@rollup/plugin-commonjs'
// 解析vue
import vue from 'rollup-plugin-vue'

export const baseRollupPlugins = [
    nodeResolve(), ts(), vue(), commonJs()
]