// pages/appointment/list/index.js
import regeneratorRuntime, { async } from '../../../lib/httpServe/regeneration-runtime.js'
import {getAppointmentListAll , putAppointmentCancel} from '../../../resource/appointment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:'',
    pickerArr:[
      "后悔了，不想去了",
      "我想换个时间去",
      "去过了，不满意效果",
      "和商家达成一致，取消预约",
      "其他"
    ],

    dataList:[]
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
    this.setData({
      current:""
    })
  },
 async initData(type){
    type = type ?  `&status=${type}` : ''
    let serveData = await getAppointmentListAll(wx.getStorageSync('loginData').id,type)
    this.setData({
      dataList:serveData.data.data
    })
  },
  handleChange ({ detail }) {
    this.initData(detail.key)
    this.setData({
        current: detail.key
    });
  },
 async bindPickerChange(element){
    wx.showLoading({
      title: '取消中',
    })
    let selected = this.data.pickerArr[element.detail.value]
    let index =  element.currentTarget.dataset.index
    
   await putAppointmentCancel(element.currentTarget.id,selected).catch((error)=>{
      wx.hideLoading()
      wx.showToast({
        title: '出错了',
        icon: 'error'
      })
    })

    this.data.dataList.splice(index,1)

    this.setData({
      dataList:this.data.dataList
    })

    wx.showToast({
      title: '取消预约成功',
      icon: 'success'
    })
  },
  handToNewAppoin(e){
    let id = e.currentTarget.id ? `?id=${e.currentTarget.id}` : ''
    wx.navigateTo({
      url:"/pages/appointment/newAppointment/index" +  id
    })
  },
  handToDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/appointment/detaileAppointment/index?id='+id 
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