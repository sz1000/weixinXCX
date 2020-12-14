import regeneratorRuntime, { async } from "../../../lib/httpServe/regeneration-runtime.js";
import { getUserInfo } from "../../../resource/user1.js";
import { getAppCode } from "../../../resource/material.js"

var app = getApp()

Page({
  data: {
    id:"",
    parentId:'',
    qrCode:''
  },
  onShareAppMessage:function (res) {
    var that = this
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: `${wx.getStorageSync('loginData').nick_name}邀请您成为黄金会员！`,
      path:'/pages/main/vipDetails/index?sharerId='+this.id,
      imageUrl:that.data.qrCode
    }
  },
  //获取二维码
  getQrCode:async function (p) {
    
    let res = await getAppCode({path:'/pages/main/vipDetails/index?sharerId='+this.id})
    this.setData({
      qrCode:res.data.data.appCodeUrl
    }) 
  },
  onLoad: async function(options) {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    this.id = wx.getStorageSync('loginData').id
    let res = await getUserInfo()
    this.setData({
      parentId:res.data.data.salerInfo.user_id,
    })
    this.getQrCode()
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})