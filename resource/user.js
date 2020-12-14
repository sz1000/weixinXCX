import HttpServe from '../lib/httpServe/index'


export default {
  wechatLogin: new HttpServe({
    url: "api/v1/auth/wechatLogin",
    Authorization: false
  }),
  regist: new HttpServe({
    url: "api/v1/auth/regist",
    Authorization: false
  }),
  code: new HttpServe({
    url: "api/v1/auth/code",
    Authorization: false
  })
}