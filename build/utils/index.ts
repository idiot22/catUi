import { spawn } from 'child_process'
import { projectRoot } from './path'
export const withTaskName = <T>(name, fn: T) => Object.assign(fn,{displayName: name})

// 在node中使用子进程运行脚本
export const run = async (command: string) => {
  return new Promise((resove)=>{
    const [ cmd, ...args] = command.split(" ")
    // cmd 要运行的命令
    // args 字符串参数列表
    const app = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: 'inherit', // 直接将子进程的输出给父进程共享
      shell: true
    })
    app.on('close', resove)
  })
}
export const cleanFile = async (path) => {
  await run(`rm -rf ${path}`)
} 
export const runTask = async (taskName: string) => await run(`pnpm run build ${ taskName }`)
/**
 * 1. 打包样式
 * 2. 打包工具方法
 * 3. 打包所有组件
 * 4. 打包每个组件
 * 5. 生成一个组件库
 * 6. 发布
 * **/