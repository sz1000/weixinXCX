//拦截管理器
import wxResource from "./request"
import regeneratorRuntime, {
  async
} from './regeneration-runtime'

class interceptorManager extends wxResource {
  constructor(options) {
    super(options)
    this.Authorization = options.Authorization != null ? options.Authorization : true
    super.setRequestHook(this.requestHook)
    super.setResponseHook(this.responseHook)
  }

  get requestHook() {
    let arr = []
    if (this.Authorization) {
      arr.push(this.getToken)
    }
    return arr
  }

  get responseHook() {
    return [this.errManager,
      this.setToken
    ]
  }
  //错误处理钩子
  errManager(responce) {
    if(responce.statusCode === 401 ){
      wx.removeStorageSync("loginData")
      wx.removeStorageSync("token")
    }
    return responce
  }

  setToken(responce) {
    if (responce.header.Authorization) {
      wx.setStorage({
        key: 'token',
        data: responce.header.Authorization
      })
    }
    return responce
  }

  async getToken(requestConfig) {
    let token = await new Promise((res, rej) => {
      wx.getStorage({
        key: 'token',
        success(tokenData) {
          res(tokenData.data)
        },
        fail(err) {
          rej("No Token")
        }
      })
    })
    requestConfig.header.Authorization = token
    return requestConfig
  }

}


export default interceptorManager