import { parallel, series } from 'gulp'
import { buildConfig } from './utils/config'
import { baseRollupPlugins } from './utils/plugin'
import { rollup, RollupOptions } from 'rollup'
import glob from 'fast-glob'
import { componentRootPath, outDir, pathRewriter, projectRoot } from './utils/path'
import { dirname, resolve } from 'path'
// https://github.com/dsherret/ts-morph/tree/latest/packages/ts-morph
import { Project, SourceFile } from 'ts-morph'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import * as VueCompiler from '@vue/compiler-sfc'
import { run } from './utils'
import typescript from 'rollup-plugin-typescript2'


// 打包所有的vue组件
const buildAllComponent = async () => {
    // 查找所有的vue组件路径
    const files = glob.sync('*', {
        cwd: componentRootPath,
        // 只查找文件夹
        onlyDirectories: true
    })

    // 将每个组件打包并且放到 dist/es/components dist/lib/components 下
    const build = files.map(async (file: string) => {
        // 组件入口文件
        const input = resolve(componentRootPath, file, 'index.ts')
        const config: RollupOptions = {
            input,
            plugins: baseRollupPlugins,
            external: (id) => /^vue/.test(id) || /^@cat-ui/.test(id), // 排除掉vue和@cat-ui的依赖
        }
        const bundle = await rollup(config)
        const options = Object.values(buildConfig).map(_config => ({
            format: _config.format,
            file: resolve(_config.output.path, `components/${ file }/index.js`),
            paths: pathRewriter(_config.output.name), // @cat-ui => cat-ui/es cat-ui/lib  处理路径
            exports: _config.format === 'cjs' ? 'named' : undefined
        }))

        // 写入
        await Promise.all(options.map(option => {
            bundle.write(option as RollupOptions)
        }))
    })

    // 所有的组件执行
    return Promise.all(build)
}

// 给vue文件生成.d.ts
const genTypes = async () => {
    const project = new Project({
        // 生成.d.ts 我们需要有一个tsconfig
        compilerOptions: {
            allowJs: true,
            declaration: true,
            emitDeclarationOnly: true,
            noEmitOnError: true,
            outDir: resolve(outDir, 'types'),
            baseUrl: projectRoot,
            paths: {
                '@cat-ui/*': ['packages/*'],
            },
            skipLibCheck: true,
            strict: false,
        },
        tsConfigFilePath: resolve(projectRoot, 'tsconfig.json'),
        skipAddingFilesFromTsConfig: true,
    })

    const filePaths = await glob('**/*', {
        // ** 任意目录  * 任意文件
        cwd: componentRootPath,
        onlyFiles: true,
        absolute: true
    })

    const sourceFiles: SourceFile[] = []

    await Promise.all(filePaths.map(async file => {
        // 只处理vue文件
        if (file.endsWith('.vue')) {
            // 读取vue文件
            const content = readFileSync(file, 'utf-8')
            // 通过sfc解析vue文件生成ast
            const sfc = VueCompiler.parse(content)
            // https://github.com/llxq/vue/blob/dev/src/compiler/parser/index.js
            const { script } = sfc.descriptor
            if (script) {
                const scriptContent = script.content // 拿到脚本  input.vue.ts  => input.vue.d.ts
                // 生成.d.ts文件
                const sourceFile = project.createSourceFile(file + '.ts', scriptContent)
                sourceFiles.push(sourceFile)
            }
        } else {
            const sourceFile = project.addSourceFileAtPath(file) // 把所有的ts文件都放在一起 发射成.d.ts文件
            sourceFiles.push(sourceFile)
        }
    }))

    await project.emit({
        // 默认是放到内存中的
        emitOnlyDtsFiles: true,
    })

    const tasks = sourceFiles.map(async (sourceFile: any) => {
        const emitOutput = sourceFile.getEmitOutput()
        const tasks = emitOutput.getOutputFiles().map(async (outputFile: any) => {
            const filepath = outputFile.getFilePath()
            mkdirSync(dirname(filepath), {
                recursive: true
            })
            writeFileSync(filepath, pathRewriter('es')(outputFile.getText()))
        })
        await Promise.all(tasks)
    })

    await Promise.all(tasks)
}

// 复制types
const copyTypes = () => {
    const src = resolve(outDir, 'types/components/')
    const copy = (module: string) => {
        const output = resolve(outDir, module, 'components')
        // 将src下的所有文件复制到 output （es/lib） 下
        return () => run(`cp -r ${ src }/* ${ output }`)
    }
    return parallel(copy('es'), copy('lib'))
}

// 打包所有组件入口 components/index.ts
const buildComponentEntry = async () => {
    const bundle = await rollup({
        input: resolve(componentRootPath, 'index.ts'),
        plugins: [typescript()],
        external: () => true
    })

    return Promise.all(Object.values(buildConfig).map(async config => {
        await bundle.write({
            format: config.format,
            // outDir/lib  outDir/es
            file: resolve(config.output.path, 'components/index.js')
        } as RollupOptions)
    }))
}

// 并行执行控件打包
export const buildComponents = series(
    buildAllComponent,
    genTypes,
    copyTypes(),
    buildComponentEntry
)
