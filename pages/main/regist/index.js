const regeneratorRuntime = require('../../../lib/httpServe/regeneration-runtime.js')
// import userServer from '../../../resource/user.js'
import {
  regist,
  getCode
} from '../../../resource/user1.js'

var app = getApp().globalData
const {
  $Message
} = require('../../../dist/base/index');

Page({
  data: {
    inputTel: '',
    inputName: '',
    inputCode: '',
    codeInvalidTimeMap: {},
    codeInputText: '获取验证码'
  },
  /**
   * 
   * @param {object} query openCode携带注册时实用。
   * 
   */
  onLoad: function (query) {
		console.log("TCL: query--注册页面", query)
    if (query.openCode) {
      this.setData({
        openCode: query.openCode
      })
    }else{
      console.error("没有获取到微信权限")
    }
    //验证码
    this.data.intervalId = setInterval(() => {
      if (this.data.codeInvalidTimeMap[this.data.inputTel] > Date.now()) {
        this.setData({
          codeInputText: `重新发送(${Math.floor((this.data.codeInvalidTimeMap[this.data.inputTel] - Date.now()) / 1000)}秒)`
        })
      } else {
        this.setData({
          codeInputText: '获取验证码'
        })
      }
    }, 1000)
  },
  closeModal: function () {
    // this.setData({
    //   isShow: false
    // })
  },
  //获取验证码
  getCode: async function () {
    if (this.data.inputTel.length !== 11) {
      $Message({
        content: '请输入11位手机号',
        type: 'error'
      })
      return
    }
    if (this.data.codeInvalidTimeMap[this.data.inputTel] > Date.now()) {
      return
    }

    this.data.codeInvalidTimeMap[this.data.inputTel] = Date.now() + 60 * 1000
    let result = await getCode({
      tel: this.data.inputTel
    })

  },
  getName: function (e) {

    var val = e.detail.value;
    this.data.inputName = val;
  },
  getTel: function (e) {
    var val = e.detail.value;
    this.data.inputTel = val;
  },
  setCode: function (e) {
    var val = e.detail.value;
    this.data.inputCode = val;
  },
  bindGetUserInfo: async function (e) {
    let nickName = e.detail.userInfo.nickName
    let avatarUrl = e.detail.userInfo.avatarUrl
    let gender = e.detail.userInfo.gender
    if (!this.data.onlyShowTel) {
      if (!this.data.inputName.length) {
        $Message({
          content: '请输入姓名',
          type: 'error'
        })
        return
      }
    }

    if (!this.data.inputTel.length && isNaN(this.data.inputTel)) {
      $Message({
        content: '请输入正确手机号',
        type: 'error'
      })
      return
    }
    if (!this.data.inputCode.length) {
      $Message({
        content: '请输入验证码',
        type: 'error'
      })
      return
    }
    //通过验证，提交注册信息
    let regis = await regist({
      checkCode: this.data.inputCode,
      tel: this.data.inputTel,
      name: this.data.inputName,
      openCode: this.data.openCode,
      orgId: 1,
      avatar: avatarUrl,
      nickName,
      gender
    })
    console.log(regis)
    //带salerId的用户注册成功之后跳成为销售页面
    if (regis.data.msg == 'success') {
      console.log(regis.data.data)
      let item = regis.data.data
      let userInfo = {
        avatar:item.avatar,
        created_at:item.created_at,
        gender:item.gender,
        id:item.id,
        name:item.name,
        nick_name:item.nick_name,
        org_id:item.org_id,
        tel:item.tel,
        updated_at:item.updated_at,
        isSaler:false
      }
      console.log(userInfo)
      wx.setStorage({
        key: 'loginData',
        data: userInfo
      })

      app.isLogo = true
      app.firstIn = false
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1000
      })
      
    }
    console.log(app.registSaler)
    if (regis.data.msg == 'success' && app.registSaler) {
      console.log('销售')
      wx.redirectTo({
        url: '../toSalerRegis/index'
      })
    } else {
      console.log('普通')
      wx.navigateBack({
        delta: 1
      })      
      // wx.reLaunch({
      //   url: '../../main/homePage/index'
      // })
    }
    console.log(regis)
    let requestBody = {
      tel: this.data.inputTel,
      key: this.data.telCodeKey,
      checkCode: this.data.inputCode
    }

    if (!this.data.onlyShowTel) {
      requestBody.name = this.data.inputName
    }
  },
  unLoad: function () {
    clearInterval(this.data.intervalId)
  }
})