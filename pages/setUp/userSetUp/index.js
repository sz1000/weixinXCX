const regeneratorRuntime = require('../../../lib/httpServe/regeneration-runtime.js')
import {
  changeInfo,
  getUserInfo
} from "../../../resource/user1.js";
import { async } from "../../../lib/httpServe/regeneration-runtime.js";
import qiniuServe from "../../../lib/httpServe/serveQiniu";

var app = getApp()

Page({
  data: {
    name: '',
    nickName:'',
    avatarUrl: '',
    tel: '',
    showBackBtn: false,
    showSaveBtn: ''
  },
  showTelBox: function () {
    this.setData({
      showRegisterBox: true
    })
  },
 //回到首页
 goToHomePage: function () {
  wx.reLaunch({
    url: '../../main/Index/index'
  })
},
  //更改手机号码后刷新手机数据
  freshData:async function (params) {
    console.log("TCL: params", params)
    let res = await getUserInfo()
    this.setData({
      tel:res.data.data.tel
    }) 
  },
  //更换头像
  chooseAvatar:async function () {
    // wx.showLoading({
    //   title: '上传中...',
    //   mask: true
    // })
    let uploaded = await qiniuServe.uploaderImg({
      count: 1,
      sizeType: '',
      sourceType: ''
    })
    let res =await changeInfo({avatar:uploaded})
    // wx.hideLoading()
    if(res.data.msg == 'success'){
      wx.showToast({
        title:'头像更换成功',
        icon:'success'
      })
    }
    // .catch((e) => {
    //   console.log(e)
    // })
    console.log(uploaded)
    this.setData({
      avatarUrl:uploaded
    })
  },
  input: function (e) {
    console.log(e)
    let value = e.currentTarget.dataset.index
  },
  change: function (e) {
    console.log(e)
    var that = this;
    let beforeValue = e.currentTarget.dataset.name
    let afterValue = e.detail.value
    console.log(beforeValue)
    that.setData({
        name: afterValue
      },
      function () {
        if (afterValue != beforeValue) {
          that.setData({
            showSaveBtn: true
          })
        } else {
          that.setData({
            showSaveBtn: false
          })
        }
      })
  },
  //保存
  saveBtn: async function () {
    wx.showLoading({
      title:'正在保存...',
      mask:true
    })
    let res = await changeInfo({name:this.data.name})
    wx.hideLoading()
  },
  onLoad: async function () {
    let that = this
    wx.getStorage({
      key: 'loginData',
      success: function (res) {
        console.log(res)
        let item = res.data
        if (res.data != null) {
          var sex = ''
    if (item.gender == 1) {
      sex = '男'
    } else if (item.gender == 2) {
      sex = '女'
    } else {
      sex = '未知'
    }
          that.setData({
            name: item.name,
            avatarUrl: item.avatar,
            tel: item.tel,
            nickName:item.nick_name
          })
        }
      }
    })
  },
  onUnload: async function (){
    let res = await getUserInfo()
    let item = res.data.data
    wx.setStorage({
      key: 'loginData',
      data: item
    })
  }
})