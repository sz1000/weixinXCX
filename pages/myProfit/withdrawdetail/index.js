// pages/myProfit/detail/index.js
import moment from '../../../lib/moment'
import { myEarnings, getIncomeList } from '../../../resource/saler'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeValue: '',
    count: {
      canWithDraw: 0,
      cantWithDraw: 0,
      withDraw: 0,
    },
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      timeValue: moment().format('YYYY-MM')
    })
    this.initData(moment().format('YYYY-MM'))
  },
  initData(data) {
    myEarnings(data).then((res) => {
      console.log(res)
      this.setData({
        count: res.data.data
      })
    }).catch(err => {
      console.error(err)
    })
    //获取收益明细列表
    getIncomeList(data).then(res => {
      console.log("TCL: initData -> res", res.data.data)

      this.setData({
        list: res.data.data
      })
    }).catch(err => {
      console.error(err);
    })
  },
  handleChangeTime(e) {
    console.log("TCL: handleChangeTime -> e", e)
    this.initData(e.detail.value)
    this.setData({
      timeValue: e.detail.value
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})