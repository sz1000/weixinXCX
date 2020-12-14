import regeneratorRuntime, {
  async
} from "../../../lib/httpServe/regeneration-runtime.js";
import qiniuServe from '../../../lib/httpServe/serveQiniu.js'
import {
  addPayOrder
} from "../../../resource/order.js";


var app = getApp()
const {
  $Message
} = require('../../../dist/base/index');
Page({
  data: {
    showBackBtn: false,
    payItem: '',
    money: '',
    patientTime: '',
    tempFilePaths: [],
    date: '请选择日期',
    time: '请选择时间',
    id: '',
    type: '',
    files: [],
    show: true,
    certImgUrls: []
  },
  inputItem(e) {
    let value = e.detail.value

    let item = e.currentTarget.dataset.name
    console.log(item)
    this.setData({
      [item]: value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  //上传图片
  joinPicture: async function (e) {
    var that = this
    // let imgArr = []
    let uploaded = await qiniuServe.uploaderImg({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    }).catch((e) => {
      console.log(e)
      return []
    })
    console.log(uploaded)
    if (uploaded.length == 0) return
    this.data.certImgUrls.push(uploaded)
    that.setData({
      files: this.data.certImgUrls
    })
    if (that.data.files.length >= 3) {
      that.setData({
        show: false
      })
    }
  },
  submit: function () {
    let that = this
    let validate = {
      payItem: that.data.payItem,
      money: that.data.money*100,
      date: that.data.date,
      time: that.data.time,
      files: that.data.files
    }
    let {
      entries
    } = Object
    var i = 0
    for (let [key, value] of entries(validate)) {
      let cast

      if (value == '' || value === '请选择时间' || value === '请选择日期')
        switch (key) {
          case "time":
            cast = '请选择时间'
            break;
          case "date":
            cast = '请选择日期'
            break;
          case "money":
            cast = '请输入预约金额'
            break;
          case "payItem":
            cast = '请输入项目名称'
            break;
          case "files":
            cast = '请上传图片凭证'
        }
      //答应消息
      if (cast) {
        $Message({
          content: cast,
          type: 'error'
        })
        cast = ''
        break;
      } else {
        i += 1
        if (i == 5) {
          this.requireSetData()
          i = 0;
        }
      }
    }
  },
  requireSetData: async function () {
    var that = this;
    let id = that.data.orderId
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let type = that.data.type
    switch (type) {
      case 'onLine':
      console.log('线上')
        await addPayOrder({
          type:0,
          orderId:id,
          project: that.data.payItem,
          price: that.data.money*100,
          certImgs: that.data.files,
          visitTime: that.data.date + ' ' + that.data.time,
        }).then(res => {
          console.log(res)
          wx.hideLoading()
          if(res.data.msg == 'success'){
            wx.redirectTo({
              url: '/pages/myFollowOrder/details/index?type='+'onLine'+'&id='+id
            })
          }
        })
        break;
      case 'offLine':
      console.log('线下')
        await addPayOrder({
          type:1,
          orderId:id,
          project: that.data.payItem,
          price: that.data.money*100,
          certImgs: that.data.files,
          visitTime: that.data.date + ' ' + that.data.time,
        }).then(res =>{
          console.log(res)
          wx.hideLoading()
          if(res.data.msg == 'success'){
            wx.redirectTo({
              url: '/pages/myFollowOrder/details/index?type='+'offLine'+'&id='+id
            })
          }
        })
        
        break;
    }
  },
  onLoad: function (options) {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    this.setData({
      type: options.type,
      orderId: options.orderId
    })
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})