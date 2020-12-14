Page({

  data: {

  },
  //返回首页
  back: function () {
    wx.redirectTo({
      url: "/pages/main-indexPage/index"
    })
  }
})