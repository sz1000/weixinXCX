// pages/main/userInfo/userVerify/index.js
import regeneratorRuntime, {
  async
} from '../../../../lib/httpServe/regeneration-runtime.js'
import qiniuServe from "../../../../lib/httpServe/serveQiniu.js";

import {
  getSalerInfo,
  updateSalerInfo
} from '../../../../resource/saler'


const {
  $Message
} = require('../../../../dist/base/index')


let {
  userInfo
} = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitData: {
      idcard_front: '',
      idcard_back: '',
      idcard_num: '',
      name: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.initData()
  },
  initData() {
    getSalerInfo(wx.getStorageSync('loginData').id).then(res => {
      let submitData = {
        idcard_front: res.data.data.idcard_front,
        idcard_back: res.data.data.idcard_back,
        idcard_num: res.data.data.idcard_num,
        name: res.data.data.name,
      }
      this.setData({
        submitData
      })
    })
  },
  handleSubmit(e) {
    let submitData = Object.assign({}, this.data.submitData, e.detail.value)
    if (!submitData.name) {
      $Message({
        content: '请输入姓名',
        type: 'error'
      });
      return
    }
    if (!(submitData.idcard_num.length == 15 || submitData.idcard_num.length == 18)) {
      $Message({
        content: '请输入正确的身份证号',
        type: 'error'
      });
      return
    }
    updateSalerInfo(submitData).then(res => {
      userInfo.set()
      wx.navigateBack({
        delta: 1
      });
    })
  },
  async handleIdcardFrontImage() {
    let imgUrl = await qiniuServe.uploaderImg({
      count: 1
    })
    let tempUrl = 'submitData.idcard_front'
    this.setData({
      [tempUrl]: imgUrl
    })
  },
  async handleIdcardBackImage() {
    let imgUrl1 = await qiniuServe.uploaderImg({
      count: 1,
    })
    let tempUrl = 'submitData.idcard_back'
    this.setData({
      [tempUrl]: imgUrl1
    })
  }

})