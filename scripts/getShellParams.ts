/**
 * 获取shell的参数
 * @param paramsCount 参数个数
 * @return 返回参数
 * **/
export const getShellParams = (paramsCount = 1) => {
  console.log(process.argv)
}
// 获取命令行以--开头的参数
export const getShellParamsByConfig = (): string[] => {
  const npmConfig = process.env.npm_config_argv
  if(npmConfig){
    try{
      const config = JSON.parse(npmConfig)
      return config.original.reduce((result: string[], value: string)=>{
        if(value.startsWith('--')){
          result.push(value.split('--').pop())
        }
        return result
      },[]) ?? []
    }catch(e){
      return []
    }
  }
}