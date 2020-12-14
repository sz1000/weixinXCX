import regeneratorRuntime from '../../../lib/httpServe/regeneration-runtime.js'
import { productDetailGet } from "../../../resource/product.js";
import { async } from '../../../utils/regeneration-runtime.js';
import appConfig from "../../../lib/appConfig.js";
import {
  getUserAddressList
} from '../../../resource/user1'
import {
  wechatLogin
} from "../../../resource/user1.js";
import {
  createOrder
} from "../../../resource/order.js";

const { $Message } = require('../../../dist/base/index');

var app = getApp().globalData
Page({
  data:{
    addressList: [],
    noAddress: false,
    product:'',
    date:'',
    time:'',
    name:'',
    tel:'',
    hospitalAddr: '',
    hospital: '杭州安歆医疗美容',
    remarks:'',
    productId:null,
    textLength:0,
    showDate:false,
    showTime:false,
    type:null,//订单类型
  },
  onShow: function (data) {
    console.log(this.data.addressList)
    if (this.data.addressList.length <= 0 && !this.data.noAddress.noAddress){
      console.log("11111111111111")
      this.initData()
    } else if (this.data.addressList.length>0){
      this.addressList=this.data.addressList
    }
    if (this.data.noAddress && this.data.addressList.length > 0) {
      console.log("333333333")
      console.log(this.data.noAddress)
      this.noAddress = this.data.noAddress
      console.log(this.noAddress)
      }
    
    
  },

  handleTouserAddress: function () {
    wx.navigateTo({
      url: '/pages/main/userInfo/userAddress/Index/index'
    });
  },
  // onLoad: function (options) {
  //   this.setData({ src_list: decodeURIComponent(options.source) })
  // },
  initData() {
    getUserAddressList().then(res => {
      console.log("TCL: initData -> res", res)
      this.setData({
        addressList: res.data.data,
        noAddress: false
      })
    }).catch(err => {
      console.log("TCL: initData -> err", err)
    })
  },
  
 
  getTime:function (e) {
    let value = e.detail.value
    this.setData({

    })
  },
  getValue:function (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    let length = value.length
    switch (type) {
      case 'date':
        this.setData({
        showDate:true,
        })
        break;
      case 'time':
        this.setData({
        showTime:true,
        })
        break;
      case 'remarks':
        this.setData({
          textLength:length,
        })
        break;
    
      default:
        break;
    }
    this.setData({
      [type]:value,
    })
  },
  submitOrder: async function (params) {
    
      let that = this
      console.log(app)
      if (that.data.addressList.length<=0){
        $Message({
          content: '请选择收货地址',
          type: 'error'
        })
        return
      }
      let para = {
        salerId: app.sharerId || 0,
        productId: that.data.productId,
        customerName:that.data.name,
        tel:that.data.tel,
        extra:that.data.remarks
      }
      if(!that.data.remarks){
        delete para.extra
      }
      if(!app.isLogo){
        wx.login({
          async success(res) {
            if (res.code) {
              let loginAuth = await wechatLogin({
                orgId: appConfig.orgId,
                code: res.code
              })
              console.log("TCL: success -> loginAuth", loginAuth)
              if (!loginAuth.data.data.openCode) {
                const loginData = wx.setStorage({
                  key: 'loginData',
                  data: loginAuth.data.data,
                })
              }
              //没有注册跳去注册
              if (loginAuth.data.data.openCode) {
                wx.redirectTo({
                  url: `/pages/main/regist/index?openCode=${loginAuth.data.data.openCode}`
                })
              }
              let isSaler = loginAuth.data.data.isSaler
              
              if (loginAuth != null) {    
                let res = await createOrder(para)
                let item = res.data
                if (item.msg != 'success') {
                  wx.showToast({
                    title: item.msg,
                    icon: 'error'
                  })
                  return
                } else if (item.msg == 'success') {
                  let orderId = item.data.id
                  wx.navigateTo({
                    url: '/pages/project/pay/index?productId=' + that.data.productId + '&orderId=' + orderId
                  })
                }
    
              }
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }else{
        let res = await createOrder(para)
        let item = res.data
        if(item.msg != 'success'){
          wx.showToast({
            title: item.msg,
            icon: 'error'
          })
          return
        }else if (item.msg == 'success') {
          let orderId = item.data.id
          wx.navigateTo({
            url: '/pages/project/pay/index?productId=' + that.data.productId + '&orderId=' + orderId
          })
        }
      }
   
  },
  onLoad: async function (options) {
    console.log(options)
    const userInfo = wx.getStorageSync('loginData')
    let res = await productDetailGet(options.productId)
    console.log(res)
    this.setData({
      product:res.data.data,
      name:userInfo.name,
      tel:userInfo.tel,
      productId:options.productId,
      type:options.status
    })
  }
})