import regeneratorRuntime from '../../../lib/httpServe/regeneration-runtime.js'

Page({
  data: {
    avatarUrl: '',
    showBackBtn: ''
  },
  onShow: async function () {
    console.log('onShow')
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    wx.getStorage({
      key: 'loginData',
      success: function(res) {
        console.log(res)
        that.setData({
          avatarUrl:res.data.avatar
        })
      }
    })
  },
  //页面跳转
  switchToPage: function (e) {
    let page = e.currentTarget.dataset.page
    let params = e.currentTarget.dataset.params ? e.currentTarget.dataset.params : ''
    let url = '/pages/setUp/' + page + '/index' + params
    wx.navigateTo({
      url: url
    })
  },
  showInfo:function () {
    wx.navigateTo({
      url:'/pages/myCard/salerInfo/index'
    })
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})