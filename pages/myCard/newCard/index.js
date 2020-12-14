// pages/myCard/newCard/index.js
import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import {
  getCardInfo,
  putlinke,
  putlinkeCancel,
  postPv
} from '../../../resource/card'

let app = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareShow:false,
    self: true,
    cardData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.id = options.id
    }
    if (options.self) {
      this.setData({
        self: JSON.parse(options.self)
      })
    }
  },
  onShow(options){
    if(this.id){
      setTimeout(() => {
        this.initData(this.id)
      }, 100);
    }
  },
  async likeCunt() {
    let cardId = this.data.cardData.id
    let _this = this
    if (app.isLogo) {
      if (!this.data.cardData.isLike) {
        console.log("可自己点赞")
        await putlinke(cardId).then((res) => {
          _this.setData({
            ["cardData.isLike"]: true,
            ["cardData.likeCount"]: this.data.cardData.likeCount + 1
          })
        }).catch((error) => {
          console.log("TCL: likeCunt -> error", error)
        })
      } else {
        await putlinkeCancel(cardId).then((res) => {
          console.log("TCL: likeCunt -> res", res)
          _this.setData({
            ["cardData.isLike"]: false,
            ["cardData.likeCount"]: this.data.cardData.likeCount - 1
          })
        }).catch((error) => {
          console.log("TCL: likeCunt -> error", error)
        })
      }

    } else {
      let local = wx.getStorageSync('cardArr') === "" ? [] : wx.getStorageSync('cardArr')
      if (local.find((e) => e === cardId)) {
        local.splice(local.findIndex((e) => e === cardId), 1)
        wx.setStorageSync('cardArr', local)
        this.setData({
          ["cardData.isLike"]: false,
          ["cardData.likeCount"]: this.data.cardData.likeCount - 1
        })
      } else {
        local.push(cardId)
        wx.setStorageSync('cardArr', local)
        this.setData({
          ["cardData.isLike"]: true,
          ["cardData.likeCount"]: this.data.cardData.likeCount + 1
        })
      }
    }
  },
  async initData(id) {
    let serveData = await getCardInfo(id,app.isLogo).catch((err)=>{
			console.error("TCL: initData -> err", err)
    })
    this.setData({
      cardData: serveData.data.data
    })
    console.log("TCL: initData -> app.isLogo", app.isLogo)
    postPv(this.data.cardData.id,app.isLogo).catch((error)=>{
      console.log("TCL: error 浏览记录", error)
    })
  },
  toCardInfo() {
    let id = wx.getStorageSync('loginData').id
    console.log("TCL: toCardInfo -> id", id)
    if (id) {
      wx.navigateTo({
        url: `/pages/myCard/cardInfo/index?id=${id}`
      })
    } else {
      console.error("缓存错误，无ID")
    }

  },
  toCropCardImg() {
    wx.redirectTo({
      url: "/pages/myCard/cropCardImg/index?cardId=" + this.data.cardData.id
    })
  },
  shareChange(data){
    this.setData({
      shareShow:!this.data.shareShow
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let id = wx.getStorageSync('loginData').id
    return {
      title: `来自${this.data.cardData.name}的名片`,
      path: `/pages/myCard/newCard/index?id=${id}&self=false`
    }
  }
})