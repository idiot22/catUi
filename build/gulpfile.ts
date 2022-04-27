import { series, parallel } from 'gulp'
import { cleanFile, run, withTaskName } from './utils'
export default series(
  // 删除dist
  withTaskName('clean', async () => await cleanFile('./dist')),
  // 并行运行各个包的打包
  parallel(
    withTaskName('build: packages', async () => {
    // --filter过滤允许您将命令限制于包的特定子集
    // --parallel 完全忽略并发和拓扑排序，在所有匹配的包中立即运行给定的脚本 与前缀流输出
    await run('pnpm --filter ./packages --parallel build')})
  )
)