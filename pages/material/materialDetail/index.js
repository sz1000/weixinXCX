import regeneratorRuntime, { async } from "../../../lib/httpServe/regeneration-runtime.js";
import { getOneArticle } from "../../../resource/material.js";


var app = getApp()
Page({
  data: {
    demo:{}
  },
   //回到首页
 goToHomePage: function () {
  wx.reLaunch({
    url: '../../main/Index/index'
  })
},
  onLoad: async function (option) {
    //打开分享
    var that = this
    wx.showShareMenu({
      withShareTicket:true,
      success:function (res) {
        console.log(res)
      },
      fail:function (err) {
        console.log(err)
      }
    })
    var page = getCurrentPages();
    if (page.length == 1) {
      that.setData({
        showBackBtn: true
      })
    }
    let res = await getOneArticle(option.articleId)
    let item = res.data.data
    console.log(res)
    let demo = {
      headImgUrl:item.head_img,
      headText:item.head_text,
      authorName:item.author_name,
      updateTime:item.updated_at,
      title:item.title,
      authorAvatarUrl:item.avatar,
      content:item.content
    }
    this.setData({
      demo
    })
  }
})