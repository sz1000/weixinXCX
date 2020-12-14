import regeneratorRuntime, {
  async
} from './utils/regeneration-runtime'


import url from './lib/httpServe/config.js'
import {
  clear,
  getUserInfo
} from "./resource/user1.js";
import {
  getSalerInfo
} from "./resource/saler.js";

App({
  onLaunch: async function (promise) {
    var that = this;
    //检测是否参数分享者的ID的参数进入
    if (promise.query.sharerId) {
      this.globalData.sharerId = promise.query.sharerId
    }
    //检测是否需要注册成为销售欧
    if (promise.query.registSaler) {
      this.globalData.registSaler = promise.query.registSaler
    }
    //如果携带则注册成为下级
    if (promise.query.parentId) {
      this.globalData.parentId = promise.query.parentId
      this.globalData.registSaler = true
    }
    //强制跟新版本
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    //从缓存获取登录状态
    // this.setLogoInfo()
  },
  globalData: {
    uploadDomain: url.uploadDomain,
    hasIdNotSaler: false,
    sharerId: null, //分享者的ID
    isLogo: false, //登录状态
    userInfo: null,
    logoAuth: null,
    isSaler: false, //确认登录用户是否是销售
    registSaler: false, //是否注册销售
    parentId: null, //是否有上级
  },
  setLogoInfo: function (params) {
    var that = this;
    return new Promise((resData, rej) => {
      wx.getStorage({
        key: 'loginData',
        success: function (res) {
          if (res.data != null) {
            that.globalData.isSaler = res.data.isSaler
            that.globalData.isLogo = true
            resData('success')
          }
        },
        fail: function (err) {
          that.globalData.isLogo = false
          rej(err)
        }
      })

    })
  },
  userInfo:{
    get:function () {
      return new Promise(function(resolve, reject){
        wx.getStorage({
          key: 'loginData',
          success(userData) {
            console.log("TCL: success -> userData", userData)
            resolve(userData.data)
          },
          async fail (err) {
             let userData = await getUserInfo()
             if(userData.statusCode == 200){
               wx.setStorage({
                 key:'loginData',
                 data:userData.data.data,
                 success(data){
                   resolve(userData.data.data)
                 },
                 fail(err){
                    console.log("TCL: fail -> err", err)
                    reject(err)
                 }
               })
             }
          }
        })
      })
    },
    set:function () {
      try {
        wx.removeStorageSync('loginData')
      } catch (e) {
        console.error("删除缓存出错了")
      }
    }
  }
})