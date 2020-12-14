// pages/distributionCenter/vipgrade/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
        "id": 1,
        "code": "普通会员",
        "text": 0
      },
      {
        "id": 2,
        "code": "黄金会员",
        "text": 398
      },
      {
        "id": 3,
        "code": "代理商",
        "text": 3888
      },
      {
        "id": 4,
        "code": "服务商",
        "text": 28500
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})