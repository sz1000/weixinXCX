import regeneratorRuntime from '../../../lib/httpServe/regeneration-runtime.js'


Page({
  data: {
    question: [{
      name: '为什么余额宝没有收到收益？',
    }, {
      name: '为什么日本化妆品那么好用？'
    }, {
      name: '汉堡抢新品福利券'
    }, {
      name: '为什么余额宝没有收到收益？',
    }, {
      name: '汉堡抢新品福利券'
    }, {
      name: '为什么余额宝没有收到收益？',
    }, {
      name: '汉堡抢新品福利券'
    }, {
      name: '为什么余额宝没有收到收益？',
    }],
    showBackBtn: '',
    nickName: ''
  },
  onLoad: function () {
    var that = this;
    var page = getCurrentPages();
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    wx.getStorage({
      key: 'loginData',
      success: function (res) {
        that.setData({
          nickName: res.data.nick_name
        })
      }
    })
  },
  // 回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '/pages/main/Index/index'
    })
  }
})