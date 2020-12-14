import regeneratorRuntime, { async } from "../../../lib/httpServe/regeneration-runtime.js";
import { deleteOrder,orderCancel,payOrder,getDetailOrder } from "../../../resource/order.js";
import { productDetailGet } from "../../../resource/product.js";
import  momentJs from "../../../lib/moment.js";

var orderId = null
var productId = null

Page({
  data:{
    serveData:{},
    date:'2019-05-01',
    hospital: '杭州安歆医疗美容',
    textLength:0,
    remarks:'',
    showDate:false,
    showTime:false,
    status:null,
    secretKey:null,
    orderTime:'',
    payTime:'',
    confirmTime:'',
    type:null,
  },
  onLoad: function (options) {

    if(options.orderId){
      this.initData(options.orderId)
    }else{
      console.error("没有获取到orderId")
    }    
  },
 async initData(orderId){
    let serveData = await getDetailOrder(orderId).catch((err)=>{
      console.error(err)
    })
    if(serveData.data.data.opening){
      let leaderInfo =  wx.getStorageSync("loginData")
      serveData.data.data.leaderInfo= leaderInfo
      serveData.data.data.members = new Array(serveData.data.data.actInfo.group_people_num - 1)
      serveData.data.data.groupInfo = {status:99}
    }
    this.setData({
      serveData:serveData.data.data
    })
    console.log("TCL: initData -> serveData.data.data", serveData.data.data)
    
  },
  //复制订单号
  copyOrderNum:function () {
    wx.setClipboardData({
      data:this.data.serveData.order_num,
      success(res){
        wx.showToast({
          title:'复制成功',
          icon:'success'
        })
      }
    })
  },
  getValue:function (e) {
    let value = e.detail.value
    let textNum = value.length
    this.setData({
      textLength:textNum,
      remarks:value
    })
  },
  bindDate:function (e) {
    console.log(e)
    let value = e.detail.value
    this.setData({
      date:value,
      showDate:true
    })
  },
  bindTime:function (e) {
    console.log(e)
    let value = e.detail.value
    this.setData({
      time:value,
      showTime:true
    })
  },
  //处理返回的事件字符串
  dateFormate:function (data) {
    let res
    res = data.replace(/\s+/g,' ');
    res = data.replace(/(^\s*)|(\s*$)/g, '');
    res = res.split(" ");
    return res
  },
  //时间格式转换不够十添加0
  p(s) {
    return s < 10 ? '0' + s : s
  },
  //删除订单
  deleteOrder: async function (e) {
    var that = this
    wx.showModal({
      title: '确认删除订单',
      content: '删除不可恢复',
      async success(res) {
        if (res.confirm) {
          let res = await deleteOrder(this.data.serveData.id)
          if (res.data.msg == 'success') {
           wx.showToast({
             title:'删除成功'
           })
           wx.redirectTo({
             url:'/pages/order/Index/index?current='+ 3
           })
          }
        }
      },
      fail:function () {
      
      }
    })
  },
  //取消订单
  cancelOrder: async function (e) {
    let res = await orderCancel(this.data.serveData.id)
    if (res.data.msg == 'success') {
      wx.showToast({
        title: '取消订单成功',
        icon: 'none',
      });
      wx.redirectTo({
        url:'/pages/order/Index/index?current='+1
      })
    }

  },
  //支付并预约
  orderPay: async function (e) {
    console.log(this.data.serveData.id)
    let res = await payOrder(this.data.serveData.id).catch((err)=>{
      console.error(err)
    })
    let item = res.data.data
    if (res.data.msg == 'success') {
      wx.requestPayment({
        'timeStamp': item.timestamp,
        'nonceStr': item.nonceStr,
        'package': item.package,
        'signType': item.signType,
        'paySign': item.paySign,
        success: function (res) {
          if (res.errMsg == 'requestPayment:ok') {
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    }
  },
   //重新预约(要修改)
   orderAgain: async function (e) {
    let detailData = await productDetailGet(productId)
    if (detailData.data.msg == 'success') {
      wx.navigateTo({
        url: '/pages/project/projectDetail/index?projectId=' + productId
      })
    } else {
      wx.showToast({
        title: detailData.data.msg,
        icon: 'error'
      })
      return
    }
  },
})