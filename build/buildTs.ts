import { withTaskName } from './utils'
import { resolve } from 'path'
import { buildConfig } from './utils/config'
import { dest, parallel, series, src } from 'gulp'
import { outDir, projectRoot } from './utils/path'
import gulpTs from 'gulp-typescript'

const tsConfigPath = resolve(projectRoot, 'tsconfig.json')

// 需要打包和过滤的文件
const inputs = ['**/*.ts', '!gulpfile.ts', '!node_modules']

// 专门用来打包ts文件的
export const buildTs = (dirname: string, name: string) => {
    return parallel(Object.entries(buildConfig).map(([key, config]) => {
        // 输出的路径
        const outputPath = resolve(dirname, config.output.name)
        const inputPath = resolve(outDir, config.output.name, name)
        return series(
            // 解析ts，生成声明文件
            withTaskName(`build: ${ outputPath }`, async () => {
                return src(inputs)
                    .pipe(gulpTs.createProject(tsConfigPath, {
                        declaration: false, // 不需要生成声明文件
                        strict: false, // 关闭严格模式
                        module: config.module  // 模块类型
                    })())
                    .pipe(dest(inputPath))
            })
        )
    }))
}
