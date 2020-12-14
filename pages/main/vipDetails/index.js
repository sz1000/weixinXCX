// pages/main/vipDetails/index.js
let app = getApp().globalData

import {
  postVipOrder,
  getUserInfo,
  getVipPrice
} from '../../../resource/user1'

const {
  $Message
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSaler: "",
    cardId: "",
    loginShow: false,
    registShow: false,
    openCode: "",
    member_price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("会员中心", options)
    if (options.sharerId) {
      app.sharerId = options.sharerId
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getVipPrice().then(res=>{
      console.log(res)
      this.setData({
        member_price:res.data.data.member_price
      })
    })

    getUserInfo().then(res => {
      if(res.data.data.isSaler){
        app.isSaler = true
        app.registSaler = true
        this.setData({
          isSaler: res.data.data.isSaler,
          cardId: res.data.data.salerInfo.saler_no
        })
        wx.setStorageSync('loginData', res.data.data);
      }
    }).catch(err => {
      app.isSaler = false
      app.registSaler = false
      wx.clearStorage()
      console.error(err)
    })

  },
  handleRegist(e) {
    if (e.detail.isRegist) {
      this.handleAddVip()
    }
  },
  handleAddVip() {
    wx.showLoading({
      title: '加载中请稍后',
      mask: true
    });

    if (!wx.getStorageSync('loginData') && !wx.getStorageSync('token') ) {
      this.setData({
        loginShow: true
      })
      wx.hideLoading()
    } else {
      postVipOrder({
        parent_id: app.sharerId || 0
      }).then(res => {
        res.data.data.timeStamp = res.data.data.timestamp
        wx.requestPayment({
          timeStamp: res.data.data.timestamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success(success) {
            wx.hideLoading()
            wx.navigateTo({
              url: '/pages/successPage/index'
            })
          },
          fail(fail) {
            wx.hideLoading()
            $Message({
              content: '支付失败',
              type: 'error'
            })
          },
        })
      }).catch(err => {
        console.error(err)
      })
    }
  },
  handleGetLogin(e) {
    if (!e.detail.isRegist) {
      this.setData({
        loginShow: false,
        registShow: true,
        openCode: e.detail.openCode
      })
    } else {
      this.setData({
        loginShow: false
      })
      if (!wx.getStorageSync('loginData').isSaler) {
        this.handleAddVip()
      } else {
        this.onShow()
      };
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: `${wx.getStorageSync('loginData').nick_name || ''}邀请您成为黄金会员`,
      path: `/pages/main/vipDetails/index?sharerId=${wx.getStorageSync('loginData').id}`
    }
  }
})