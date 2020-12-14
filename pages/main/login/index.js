Page({
  data: {

  },
  onLoad: function () {
    console.log("小程序加载了")



  },
  onShow: function () {
    wx.switchTab({
      url: '/pages/main/Index/index'
    })
  },
  bindGetUserInfo: function (userInfo) {
    console.log(userInfo)
    wx.navigateTo({
      url: '/pages/main-advertisementPage/index'
    })
  }
})