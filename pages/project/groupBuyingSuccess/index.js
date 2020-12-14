// pages/project/groupBuyingSuccess/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({groupId=''}) {

      if(groupId){
        this.groupId = groupId
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.countDown()
  },
  countDown(){
    let _this = this
    if(this.data.count <= 0) {
      wx.redirectTo({
        url:"/pages/project/groupBuyingDtaile/index?type=details&groupId=" + _this.groupId
      })
    }
    setTimeout(()=>{
      this.setData({
        count:this.data.count - 1
      },()=>{
        _this.countDown()
      })
    },1000)
 
  },
  handleToDetaile(){
    wx.redirectTo({
      url:"/pages/project/groupBuyingDtaile/index?type=details&groupId=" + this.groupId
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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