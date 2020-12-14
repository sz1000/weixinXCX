// pages/main/userInfo/userBankCard/index.js
import {
  getSalerInfo,
  updateSalerInfo
} from '../../../../resource/saler'

const {
  $Message
} = require('../../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitData: {
      bankAddr: '',
      subBank: '',
      bankCode: '',
      bank: ''
    }
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
    getSalerInfo(wx.getStorageSync('loginData').id).then(res => {
      console.log("TCL: initData -> res", res.data.data)
      let submitData = {
        bankAddr: res.data.data.bank_addr,
        subBank: res.data.data.sub_bank,
        bankCode: res.data.data.bank_code,
        bank: res.data.data.bank
      }
      console.log(submitData)
      this.setData({
        submitData
      })
    })
  },
  bindRegionChange(e) {
    this.setData({
      ['submitData.bankAddr']: e.detail.value
    })
  },
  handleSubmit(e) {
    console.log("TCL: handleSubmit -> e", e.detail.value)
    // return
    let submitData = Object.assign({},this.data.submitData,e.detail.value)
    console.log("TCL: handleSubmit -> submitData", submitData)
    if (!submitData.bankCode) {
      $Message({
        content: '请输入银行卡号',
        type: 'error'
      });
      return
    }
    if (!submitData.bank) {
      $Message({
        content: '请输入结算银行',
        type: 'error'
      });
      return
    }
    updateSalerInfo(submitData).then(res => {
      $Message({
        content: '修改成功',
        type: 'success'
      });
      wx.navigateBack({
        delta: 1
      });
    })
  }

})