import userServe from '../../resource/user.js'
const regeneratorRuntime = require('../../lib/httpServe/regeneration-runtime.js')
import appConfig from '../../lib/appConfig'
import {login} from '../../lib/utils'
var app = getApp()
Component({
  properties: {
    show:Boolean
  },
  data: {
    attribute: [{
      name: '授权登录',
      color: '#5297FC'
    }]
  },
  lifetimes: {

  },
  methods: {
    handleStopMove(){
      return true
    },
    handleCloseModal: function () {
      this.triggerEvent('change', {show:false,isLogin:false})
    },
    handleStop(){
      return true
    },  
    getLoginAuth(){
      login().then((res)=>{
       this.triggerEvent('change', Object.assign({},{show:false,isLogin:true,},res))
      }).catch((err)=>{
        console.error("err=>getLoginAuth",err)
        wx.showToast({
          title: '登陆失败',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      })

    },
  }

})