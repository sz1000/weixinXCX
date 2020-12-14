import regeneratorRuntime, {
  async
} from "../../../lib/httpServe/regeneration-runtime.js";
import {
  getDetailFollow
} from "../../../resource/orderFollow.js";
import {
  getDetailOrder
} from "../../../resource/order.js";
var app = getApp()

Page({
  data: {
    orderData: [],
    userInfo:{}
  },
  toAddPay: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/myFollowOrder/addConsumption/index?type='+this.data.type+'&orderId='+this.data.id
    })
  },
  onLoad: async function (options) {
    console.log(options)
    let type = options.type
    this.setData({
      type,
      id:options.id
    })
    switch (type) {
      case 'onLine':
        let onLineData = await getDetailOrder(options.id)
        let userInfoOnLine = onLineData.data.data.userInfo
        this.setData({
          userInfo:userInfoOnLine,
          orderData: onLineData.data.data
        })
        break;
      case 'offLine':
        let res = await getDetailFollow(options.id)
        let userInfoOffLine = res.data.data
          let userInfo ={
            name:userInfoOffLine.consumer,
            tel:userInfoOffLine.tel
          }
        this.setData({
          userInfo,
          orderData: userInfoOffLine
        })
      default:
        break;
    }

    console.log(this.data.orderData)
  }
})