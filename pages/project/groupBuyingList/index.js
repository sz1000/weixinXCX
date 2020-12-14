// pages/project/groupBuyingList/index.js
import {getBuyingList} from '../../../resource/groupBuying'
import regeneratorRuntime, { async } from '../../../lib/httpServe/regeneration-runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData()
  },
 async initData(){
    let serveData = await getBuyingList().catch((err)=>{
      console.error(err)
      return 
    })
    this.setData({
      listData:serveData.data.data
    })
    console.log("TCL: initData -> serveData", serveData.data.data)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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