// pages/appointment/detaileAppointment/index.js
import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import {
  getAppointment,
  putAppointmentCancel
} from '../../../resource/appointment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submit: {},
    pickerArr:[
      "后悔了，不想去了",
      "我想换个时间去",
      "去过了，不满意效果",
      "和商家达成一致，取消预约",
      "其他"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   * @param id 预约的id 获取预约的信息
   */
  onLoad: function (options) {
    console.log("TCL: options", options)
    if (options.id) {
      this.id = options.id
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData(this.id)
  },
  async initData(id) {
    let serveData = await getAppointment(id)
    console.log("TCL: initData -> serveData", serveData.data.data)
    this.setData({
      submit: serveData.data.data
    })
  },
  handCopy() {
    wx.setClipboardData({
      data: this.data.submit.appoint_num,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
              icon: 'success'
            })
          }
        })
      }
    })
  },
  handCancelAoppint(e) {
    let selected = this.data.pickerArr[e.detail.value]
    putAppointmentCancel(this.data.submit.id,selected).then((res) => {
      console.log("TCL: handCancelAoppint -> res", res)
      wx.showToast({
        title: '取消成功',
        icon: 'success'
      })
      wx.redirectTo({
        url: '/pages/appointment/list/index'
      })
    }).catch(error => {
      console.log("TCL: handCancelAoppint -> error", error)
      wx.showToast({
        title: '取消失败',
        icon: ''
      })
    })
  },
  handModifyAoppint() {
    console.log("修改预约")
    wx.navigateTo({
      url: '/pages/appointment/newAppointment/index?id='+ this.data.submit.id
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.id = null
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})