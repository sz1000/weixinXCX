// pages/myCard/cardInfo/index.js
import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import WxValidate from '../../../lib/WxValidate'
import qiniuServe from '../../../lib/httpServe/serveQiniu.js'
const {
  $Message
} = require('../../../dist/base/index');

import {
  getCardInfo,
  putCardInfo
} from '../../../resource/card'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectType:"",//选择列表的类型
    selectShow:false,
    introData:"",
    submitData: {
      avatar: "",
      org: "",
      name: "",
      title: "",   
      tel: "",
      wxid: "",
      address: "",
      intro: "",
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    this.initValidate()
  },
  async initData() {
    let loginData = wx.getStorageSync("loginData")
    let serveData = await getCardInfo(loginData.id)
    this.id = loginData.id
    this.setData({
      submitData:serveData.data.data
    })
  },
  initValidate: function (params) {
    let rules = {
      avatar: {
        required: true
      },
      org: {
        required: true
      },
      name: {
        required: true
      },
      title: {
        required: true
      },
      tel: {
        required: true,
        tel: true
      },
      wxid: {
        required: true
      },
      address: {
        required: true
      },
      intro: {
        required: true
      },
    }
    let messages = {
      avatar: {
        required: "请上传头像"
      },
      org: {
        required: "请输入机构名称"
      },
      name: {
        required: "请输入姓名"
      },
      title: {
        required: "请输入职位"
      },
      tel: {
        required: "请输入电话",
        tel: '请输入正确的手机号'
      },
      wxid: {
        required: "请输入微信号"
      },
      address: {
        required: "请输入公司地址"
      },
      intro: {
        required: "请输入简介"
      },
    }

    this.WxValidate = new WxValidate(rules, messages)

  },
  introChange(e){
    this.setData({
      ['submitData.intro']:e.detail.detail.value
    })
  },
 async updataHeadImg(){
    let uploaded = await qiniuServe.uploaderImg({
      count: 1,
      sizeType: '',
      sourceType: ''
    }).catch((e) => {
      console.log(e)
      return []
    })
    this.setData({
      ['submitData.avatar']:uploaded
    })
  },
  selectElement(e){
    let selectType =  e.currentTarget.dataset.target
    this.setData({
      selectType,
      selectShow:true
    })
  },
  selectHandle(e){
    let target = `submitData.${e.detail.type}`
    let targetId = `submitData.${e.detail.type.slice(0,e.detail.type.length-4)}Id`
    this.setData({
      selectShow:false,
      [target]:e.detail.data,
      [targetId]:e.detail.data.id
    })
  },
  submit: function (params) {
    let submitData = Object.assign(this.data.submitData,params.detail.value) 
    if (!this.WxValidate.checkForm(submitData)) {
      const error = this.WxValidate.errorList[0]
      $Message({
        content: error.msg,
        type: 'error'
      });
      return false
    }
    putCardInfo(this.data.submitData.id,submitData).then((res)=>{
    }).catch((error)=>{
    })
    
    // console.log(getCurrentPages())
    // let pages = getCurrentPages()
    // console.log(pages.length)
    // pages.splice(pages.length - 1,1)
    // console.log(getCurrentPages())
    wx.navigateBack ({
      url:"/pages/myCard/newCard/index?id=" + this.id
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})