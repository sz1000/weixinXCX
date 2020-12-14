// pages/main/userInfo/userInfoSet/index.js
import {
  getSalerInfo,
  updateSalerInfo
} from '../../../../resource/saler'

import {
  changeInfo,
  getUserInfo
} from '../../../../resource/user1'

const {
  $Message
} = require('../../../../dist/base/index');

let {
  userInfo
} = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    identityList: ['学生', '待业', '兼职'],
    experienceList: ['否', '是'],
    userData: {},
    isSaler: '',
    verifyPhoneShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData()
  },
  initData() {
    userInfo.get().then(res => {
      console.log(res)
      this.setData({
        isSaler: res.isSaler,
        userData:Object.assign({},res,res.salerInfo)
      })
    }).catch(err => {
      console.error("TCL: er", err)
    })
  },
  formSubmit({
    detail
  }) {
    let submitData = detail.value
    if (!submitData.name) {
      $Message({
        content: '请输入姓名',
        type: "error"
      })
      return
    }
    delete submitData.tel
    if (this.data.isSaler) {
      updateSalerInfo(submitData).then(res => {
        userInfo.set()
        wx.navigateBack({
          delta: 1
        });
      })
    } else {
      changeInfo(submitData).then(res => {
        userInfo.set()
        wx.navigateBack({
          delta: 1
        });
      })
    }


  },
  handleExperienceChange(e) {
    this.setData({
      ['userData.identity']: e.detail.value
    })
  },
  bindPickerChange(e) {
    this.setData({
      ['userData.experience']: e.detail.value
    })
  },
  handleShowVerifyPhone() {
    this.setData({
      verifyPhoneShow: true
    })
  },
  handleHideVerifyPhone({
    detail
  }) {
    if (detail) {
      this.initData()
    }
    this.setData({
      verifyPhoneShow: false
    })
  }
})