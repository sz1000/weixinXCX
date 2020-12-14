// pages/project/groupBuyingRule/index.js

import {productDetailGet} from '../../../resource/product'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actInfo:undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if(options.productId){
      this.initData(options.productId)
    }else{
      console.error("规则页没有获取到productId")
    }
  },
  initData(productId){
    productDetailGet(productId).then((res)=>{
      this.setData({
        actInfo:res.data.data.actInfo || undefined
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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