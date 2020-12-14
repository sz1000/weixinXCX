import regeneratorRuntime from "../../../lib/httpServe/regeneration-runtime.js";
import {
  myEarnings
} from "../../../resource/saler.js";
const app = getApp()

Page({

  data: {
    visible: false,
    canWithDraw: 0,
    cantWithDraw: 0,
    todayAmount: 0,
    withDraw: 0,
    orderNum: 0,
    sum: '',
  },
  handleOpen() {
    this.setData({
      visible: true
    });
  },

  handleClose() {
    this.setData({
      visible: false
    });
  },
  confirmWithdrawal() {//点击却确认提现
    //点击提现调用接口逻辑在这里面写
      this.setData({
        visible: false
      });
  },
  showMessage: function() {
    wx.showToast({
      title: '暂未开放',
      duration: 1500
    })
  },

  //可叮的收益明细
  // handleToPrifitDetail(){
  //   wx.navigateTo({
  //     url: '/pages/myProfit/detail/index'
  //   });
  // },
  onLoad: async function() {
    let res = await myEarnings()
    console.log(res)
    let item = res.data.data
    if (res.data.msg == 'success') {
      this.setData({
        canWithDraw: item.canWithDraw,
        cantWithDraw: item.cantWithDraw,
        todayAmount: item.todayAmount,
        withDraw: item.withDraw,
        totalIncome: item.totalIncome,
        withDrawing: item.withDrawing
      })
    }
  }
})