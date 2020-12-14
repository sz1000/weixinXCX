const regeneratorRuntime = require('../../../lib/httpServe/regeneration-runtime.js')
import {
  productDetailGet
} from "../../../resource/product.js";
import {
  payOrder
} from "../../../resource/order.js";


var app = getApp()

Page({
  data: {
    order: '',
    orderId: ''
  },
  pay: async function () {
    let res = await payOrder(this.data.orderId)
    console.log(res)
    let item = res.data.data
    if (res.data.msg == 'success') {
      console.log(item.timestamp)
      wx.requestPayment({
        'timeStamp': item.timestamp,
        'nonceStr': item.nonceStr,
        'package': item.package,
        'signType': item.signType,
        'paySign': item.paySign,
        success: function (res) {
          if(res.errMsg == 'requestPayment:ok'){
            wx.navigateTo({
              url:'/pages/project/paiedSuccess/index'
            })
          }
        },
        fail:function (error) {
          console.log(error)
        }
      })
    } 

  },
  onLoad: async function (option) {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    let res = await productDetailGet(option.productId)
    let item = res.data.data
    let order = {
      projectCoverImgUrl: item.cover_img,
      projectName: item.name,
      price: item.price,
      payPrice:item.pay_price,
      type:item.type
    }
    this.setData({
      order,
      orderId: option.orderId
    })
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})