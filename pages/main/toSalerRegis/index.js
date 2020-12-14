var app = getApp();

Page({
  data: {
    showBtn: false,
    isInvited: true,
  },
  onLoad: function (options) {
    console.log("全局APP")
    this.setData({
      url: app.globalData.uploadDomain
    })
  },
  // 按钮的显示隐藏
  onPageScroll: function (e) {
    if (e.scrollTop >= 730) {
      this.setData({
        showBtn: true
      })
    } else {
      this.setData({
        showBtn: false
      })
    }
  },
  // 页面跳转
  switchTo: function () {
    wx.navigateTo({
      url: '/pages/main/salerRegis/index'
    })
  }
})