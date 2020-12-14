// pages/appointment/success/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"预约"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.id =  options.id
    if(options.title){
      this.setData({
        text:options.title
      })
      wx.setNavigationBarTitle({
        title:options.title+"预约"
      })
    }
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  
  handToList(){
    if(!this.id){
      wx.showToast({
        title: '出错了',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      return  
    }
    wx.navigateTo({
      url:'/pages/appointment/detaileAppointment/index?id=' + this.id
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})