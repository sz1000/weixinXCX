import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'

import WxParse from '../../../wxParse/wxParse.js'

import {
  getBuyingGroupsOpen
} from '../../../resource/groupBuying'

import {
  productDetailGet
} from '../../../resource/product.js'


import {
  getAppCode
} from "../../../resource/material.js";

import {
  getLocalImage,
  login
} from '../../../lib/utils'



var projectId, salerId, textNum = 0
var localCanvasImgUrl

var app = getApp().globalData

const ctx = wx.createCanvasContext('shareProductCanvas')

Page({
  data: {
    loginShow: false,
    submitBarType: "groupbBuying", //sell 销售  groupbBuying 拼团
    targetTime1: '2019-06-22 12:06:00',
    clearTimer: false,
    product: {},
    myFormat: ['天', '时', '分', '秒'],
    imgLoad: false,
    showSaleBtn: true,
    productId: '',
    userInfo: '',
    showTips: true,
    showCanvas: true,
    registerShow:false,
    openCode:""
  },
  /** 
   * options 的参数
   * @param {String} productId - 商品的ID 用于获取商品信息
   * @param {String} sharerId -  销售ID 用于鉴定是不是销售引导的用户
   */
  onLoad: async function (options) {

    console.log("TCL: options", options)
    console.log("TCL: options", options.productId)
    if (options.productId) {
      this.initData(options.productId)
    }
    if(options.sharerId){
      app.sharerId = options.sharerId
    }
  },
  async initData(productId) {
    let serveData = await productDetailGet(productId).catch((err) => {
      console.error("获取商品信息出错 ", err)
      return
    })

    if (serveData.data.data.actInfo) {
      serveData.data.data.actInfo.pay_price = serveData.data.data.pay_price
    }

    this.setData({
      submitBarType: serveData.data.data.actInfo ? 'groupbBuying' : 'sell',
      product: serveData.data.data
    })

    //设置富文本信息
    let projectContent = `${serveData.data.data.detail}`
    WxParse.wxParse('PROJECT', 'html', projectContent, this, 5)

    //制作分享卡片
    this.makeCard(this.data.product.id)

    //记录商品浏览量
    // getBuyingView(productId)

    console.log("TCL: initData -> serveData", serveData.data.data)
  },
  //拼团订单
  handleGroupBuyingOrder() {
    let actId = this.data.product.actInfo.id
    wx.showLoading({
      title: "请等待",
      mask: true
    });

    //验证有没有登陆
    if (!app.isLogo) {
      this.setData({
        loginShow: true
      })
      wx.hideLoading();
      return
    }
    //创建开团订单
    getBuyingGroupsOpen(actId).then((res) => {
      console.log("TCL: handleGroupBuyingOrder -> 开团点单", res)

      //组织开团信息
      let tempGroupInfo = Object.assign({}, {
        actInfo: Object.assign({}, this.data.product.actInfo, {
          productInfo: this.data.product
        })
      }, {
        members: []
      }, {
        leaderInfo: {
          avatar: wx.getStorageSync('loginData').avatar
        },
      })
      //获取开团信息临时存到本地
      wx.setStorageSync('tempGroupInfo', tempGroupInfo)

      wx.navigateTo({
        url: `/pages/project/groupBuyingDtaile/index?type=start&orderId=${res.data.data.id}`
      })

      wx.hideLoading()

    }).catch((err) => {
      console.error("handleGroupBuyingOrder-getBuyingGroupsOpen", err)
      // wx.hideLoading()
      wx.showToast({
        title: err.data.msg,
        icon: 'none',
        duration: 1500,
        mask: true,
      });

    })

  },
  //接受login回掉
  handleLoginChange(obj) {    
    if (obj.detail.isRegist) {
      wx.showToast({
        title: '登陆成功',
        icon: 'success',
        duration: 1500,
        mask: true,
      });
    } else {
      this.setData({
        openCode:obj.detail.openCode,
        registerShow:true
      })
    }

    this.setData({
      loginShow: obj.detail.show
    })
  },
  handleRedister(e){
    if(e.detail.isRegist){
      wx.showToast({
        title: '注册成功，可立即购买',
        icon: 'none',
        duration: 1500,
        mask: false
      })
    }
  },
  showCanvas: async function () {
    if (!app.isLogo) {
      await login()
    }
    this.setData({
      showCanvas: false,
    })
  },
  //制作分享卡片
  async makeCard(projectId) {
    let that = this
    
    //获取分享商品二维码
    let sharer =  app.isSaler ? `&sharerId=${wx.getStorageSync('loginData').id}` : ''
    let productQrCode = await getAppCode({
      path: `/pages/project/projectDetail/index?projectId=${projectId}${sharer}`
    })

    //  获取二维码
    let codeUrl = productQrCode.data.data.appCodeUrl
    let qrCodeUrl = await getLocalImage(codeUrl)

    //制作分享图片

    let tempImg = this.data.product.cover_img
    let tempArr = tempImg.split('//')

    if (tempArr.length > 2) {
      tempImg = 'https://img.kodin.cn/' + tempArr[tempArr.length - 1]
    }


    let coverImg = await getLocalImage(tempImg)
    // 绘制cnavas开始
    ctx.drawImage(coverImg.path, 0, 0, 312, 279)
    ctx.font = 'bold 19px sans-serif'
    ctx.fillText('杭州安歆医疗美容', 21, 310)
    that.textWrap(this.data.product.name)
    ctx.font = 'normal 15px sans-serif'
    ctx.setFillStyle('#FF4343')
    ctx.fillText('￥' + this.data.product.pay_price, 21, 380 + textNum * 20)
    ctx.font = 'normal 10px sans-serif'
    ctx.setFillStyle('#333333')
    ctx.fillText('长按识别小程序码', 212, 400)
    ctx.drawImage(qrCodeUrl.path, 212, 305, 75, 75)
    ctx.draw(false, function (e) {
      wx.canvasToTempFilePath({
        canvasId: 'shareProductCanvas',
        fileType: 'jpg',
        success(res) {
          localCanvasImgUrl = res.tempFilePath
        }
      })
    })
  },
  //打开授权
  openSetting() {
    wx.openSetting({
      success(settingdata) {
        if (settingdata.authSetting["scope.writePhotosAlbum"]) {
          console.log("获取权限成功，再次点击图片保存到相册")
        } else {
          console.log("获取权限失败")
        }
      }
    })
  },
  //保存画布内容到本地
  saveCanvas: function (params) {
    var that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          wx.showModal({
            title: '检测到您未授权访问相册,是否去授权访问相册',
            icon: 'fail',
            success: function (res) {
              if (res.confirm) {
                that.openSetting()
              }
            },
          })
        } else {
          console.log('已经有权限')
        }
      }
    })
    wx.saveImageToPhotosAlbum({
      filePath: localCanvasImgUrl,
      success(res) {
        if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
          wx.showToast({
            title: '图片保存成功',
            icon: 'success',
            duration: 1000,
          })
        }
        // wx.hideToast()
      },
      fail(err) {
        console.log('授权失败')
        return;
      }
    })
    this.setData({
      showCanvas: true,
    })
  },
  showTips: function () {
    this.setData({
      showTips: false
    })
  },
  closeTips: function () {
    this.setData({
      showTips: true
    })
  },
  closeModal: function () {
    this.setData({
      showTips: true,
      showCanvas: true
    })
  },
  //图片加载完成
  imgOnLoad: function () {
    this.setData({
      imgLoad: true
    })
  },
  //正常购买
  bindSubmitBuyOrder: function (e) {
    if (!app.isLogo) {
      this.setData({
        loginShow: true
      })
      return
    }
    let status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '/pages/order/orderCreat/index?productId=' + this.data.product.id + '&status=' + status
    })
  },
  //分享赚钱
  onShareAppMessage(res) {
    var that = this;
    let saler = app.isSaler ? `&sharerId=${wx.getStorageSync('loginData').id}` : ''
    return {
      title: that.data.product.name,
      path: '/pages/project/projectDetail/index?productId=' + that.data.product.id + saler
    }
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  },
  // canvas文本换行函数
  textWrap: function (data) {
    ctx.font = 'normal 15px sans-serif'
    ctx.setFillStyle('#333333')
    let textLength = data.length
    if (textLength <= 10) {
      ctx.fillText(data, 21, 350)
    } else if (textLength < 20) {
      textNum = 1
      let firstWrap = data.substr(0, 10)
      let secondWrap = data.substr(10, textLength - 10)
      ctx.fillText(firstWrap, 21, 350)
      ctx.fillText(secondWrap, 21, 370)
    } else {
      textNum = 1
      let firstWrap = data.substr(0, 10)
      let secondWrap = data.substr(10, 9) + '...'
      ctx.fillText(firstWrap, 21, 350)
      ctx.fillText(secondWrap, 21, 370)
    }
  },
})