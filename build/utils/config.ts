import { resolve } from 'path'
import { outDir } from './path'
export const buildConfig = {
    esm: {
        module: 'ESNext', // tsconfig输出的结果es6模块
        format: 'esm', // 需要配置格式化化后的模块规范
        output: {
            name: 'es', // 打包到dist目录下的那个目录
            path: resolve(outDir, 'es')
        },
        bundle: {
            path: 'cat-ui/es'
        }
    },
    cjs: {
        module: 'CommonJS',
        format: 'cjs',
        output: {
            name: 'lib',
            path: resolve(outDir, 'lib')
        },
        bundle: {
            path: 'cat-ui/lib'
        }
    }
}
export type BuildConfig = typeof buildConfig