// pages/main/inquiry/index.js
import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'

import { getInquiryList,postInquiry } from '../../../resource/inquiry'

import { getCode } from '../../../resource/user1'

import WxValidate from '../../../lib/WxValidate'
import { $Message } from '../../../dist/base/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    fruit: [{
      id: 1,
      name: '男',
    }, {
      id: 2,
      name: '女'
    }],
    currentGender: '',
    submit: {
      client_name: "",
      gender: '',
      birthday: '',
      tel: '',
      code: '',
      customize: []
    },
    questionShow: false,
    questionObj: {},
    countDown: ''
  },
  onLoad: function (options) {
    this.initValidate()
  },
  onShow: function () {
    this.initData()
  },
  onHide: function () {
    clearTimeInterval(countDownInterval)
  },
  async initData() {
    let serveData = await getInquiryList().catch(error => {
      console.error(error)
    })
    this.setData({
      'submit.customize': serveData.data.data.customize
    })
  },
  initValidate: function (params) {
    let rules = {
      client_name: {
        required: true
      },
      gender: {
        required: true
      },
      birthday: {
        required: true
      },
      tel: {
        required: true
      },
      code: {
        required: true
      },
    }
    let messages = {
      client_name: {
        required: "请输入名字"
      },
      gender: {
        required: "请选择性别"
      },
      birthday: {
        required: "请选择出生日期"
      },
      tel: {
        required: "请输入电话"
      },
      code: {
        required: "请输入验证码"
      }
    }

    this.WxValidate = new WxValidate(rules, messages)

  },
  formSubmit: function (e) {
    let submitData = Object.assign(this.data.submit, e.detail.value)
    if (!this.WxValidate.checkForm(submitData)) {
      const error = this.WxValidate.errorList[0]
      $Message({
        content: error.msg,
        type: 'error'
      });
      return false
    }
    postInquiry(submitData).then((res)=>{
    console.log("TCL: res", res)
      wx.showToast({
        title: '提交成功!',
        icon: 'success',
        duration: 1500,
        mask: true,
      });
      wx.switchTab({
        url:'/pages/main/Index/index'
      })
    }).catch((err)=>{
      console.log("TCL: err", err)
      wx.showToast({
        title: err.data.data,
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    })
  },
  handleTelChange(e) {
    this.setData({
      ['submit.tel']: e.detail.detail.value
    })
  },
  async handleCountDown() {

    if (!this.data.submit.tel) {
      wx.showToast({
        title: '请输入电话',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true
      })
      return
    }

    let code = await getCode({ tel: this.data.submit.tel }).catch((err) => {
      console.error(err)
      wx.showToast({
        title: '出错了！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    })
    this.data.countDown = this.data.countDown ? this.data.countDown : 60
    let countDownInterval = setInterval(() => {
      if (this.data.countDown > 0) {
        this.setData({
          countDown: this.data.countDown - 1
        })
      } else {
        clearInterval(countDownInterval)
        this.setData({
          countDown: ''
        })
      }
    }, 1000)
  },
  handleNameChange({ detail = {} }) {
    this.setData({
      ['submit.client_name']: detail.value
    })
  },
  handleGenderChange(e) {
    let gender
    if(e.detail.value ===  '男'){
      gender = 1
    }else if(e.detail.value === '女'){
      gender = 2
    }
    this.setData({
      currentGender: e.detail.value,
      ['submit.gender']: gender
    })
  },
  bindDateChange({ detail = {} }) {
    this.setData({
      ['submit.birthday']: detail.value
    })
  },
  handQuestion(e) {
    this.questionIndex = e.currentTarget.dataset.index
    let questionObj = e.currentTarget.dataset.item
    this.setData({
      questionObj,
      questionShow: true
    })
  },
  handAnswer(e) {
    let answer = e.detail
    this.data.submit.customize[this.questionIndex].answer = e.detail
    this.setData({
      questionShow: false,
      [`submit.customize[${this.questionIndex}]`]: this.data.submit.customize[this.questionIndex]
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})