const regeneratorRuntime = require('../../lib/httpServe/regeneration-runtime.js')

import {
  getCode,
  changeInfo,
  regist
} from '../../resource/user1.js'
const {
  $Message
} = require('../../dist/base/index');

import WxValidate from '../../lib/WxValidate'

let app = getApp().globalData;


Component({
  properties: {
    openCode: {
      type: String
    },
    isShow: {
      type: Boolean
    },
    onlyShowTel: {
      type: Boolean
    },

  },
  data: {
    sendCodeDis: false,
    tel: "",
    submitData: {
      name: '',
      tel: "",
      checkCode: ""
    },
    codeInvalidTimeMap: {},
    codeInputText: "发送验证码"
  },
  //attached 相当于onload  detached相当于unload
  lifetimes: {
    attached: function () {
      this.initValidate()
    },
    detached: function () {
      clearInterval(this.data.intervalId)
    },
  },
  methods: {
    initValidate: function (params) {
      let rules = {
        name: {
          required: true
        },
        tel: {
          required: true,
          numberLength:11
        },
        checkCode: {
          required: true,
          numberLength:4
        }
      }
      let messages = {
        name: {
          required: "请输入姓名"
        },
        tel: {
          required: "请输入手机号码",
          numberLength:"输入11位的手机号码"
        },
        checkCode: {
          required: "请输入验证码",
          numberLength: "请输入正确的验证码"
        }
      }
      this.WxValidate = new WxValidate(rules, messages)
      this.WxValidate.addMethod('numberLength', (value, param) => {
          return  value.length === param
      })

    },
    handleStopMove() {
      return true
    },
    closeModal: function () {
      this.setData({
        isShow: false
      })
    },
    handleGetTel: function (e) {
      var val = e.detail.value;
      this.data.submitData.tel = val;      
    },
    handleGetName: function (e) {
      var val = e.detail.value;
      this.data.submitData.name = val;
    },
    handleGetCode: function (e) {
      var val = e.detail.value;
      this.data.submitData.checkCode = val;
    },
    handleGetCheckCode() {

    },
    submit(params) {
      if (this.WxValidate.checkForm(this.data.submitData)) {
        console.log("组成吃")
        // return
        regist(Object.assign({}, this.data.submitData, params, {
          openCode: this.data.openCode,
          orgId: 0
        })).then(res => {
          wx.setStorageSync('loginData', res.data.data);
          app.isLogo = true
          this.setData({
            isShow:false
          })
          this.triggerEvent('change', {isRegist:true})
        }).catch(err => {
          this.triggerEvent('change', {isRegist:false})
          $Message({
            content: err.data.msg,
            type: 'error'
          })
          console.error(err)
        })
      } else {
        $Message({
          content: this.WxValidate.errorList[0].msg,
          type: 'error'
        })
      }
    },
    getCodeNumber: async function () {
      //验证手机号
      console.log("验证手机号",this.data.tel)
      if (this.data.submitData.tel.length !== 11) {
        console.log("sdasd")
        $Message({
          content: '请输入11位手机号',
          type: 'error'
        })
        return
      }
      getCode({tel:this.data.submitData.tel}).then(res=>{
         //发送验证码倒计时
         this.codeCountDown()
      }).catch(err=>{
        $Message({
          content: '获取验证码失败，请稍后再试',
          type: 'error'
        })
      })
     
    },
    getUserInfo(e) {
      //获取用户信息
      if (e.detail.userInfo) {
        e.detail.userInfo.avatar = e.detail.userInfo.avatarUrl
        this.submit(e.detail.userInfo)
      }
    },
    codeCountDown() {
      let codeInputText = 60
      this.setData({
        codeInputText,
        sendCodeDis: true
      })
      let countDown = setInterval(() => {
        if (codeInputText <= 0) {
          clearInterval(countDown)
          this.setData({
            sendCodeDis: false,
            codeInputText: '重新发送'
          })
          return
        }
        this.setData({
          codeInputText: codeInputText -= 1
        })
      }, 1000)
    }
  }
})