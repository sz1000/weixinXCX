const regeneratorRuntime = require('../../../lib/httpServe/regeneration-runtime.js')

var app = getApp()

Page({
  data: {

  },
  goToHomePage: function () {
    wx.reLaunch({
      url: '/pages/main/Index/index'
    })
  },
  onLoad: function () {
    console.log()
  }
})