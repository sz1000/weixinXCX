import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import appConfig from "../../../lib/httpServe/config.js";
import {
  getOneArticle,
  getAppCode
} from "../../../resource/material.js";
import { getLocalImage } from "../../../lib/utils.js";
var id = null //文章id
var ctx = wx.createCanvasContext('materialShareCanvas')
var localCanvasImgUrl, textWrap=0

Page({
  data: {
    imgUrl: '',
    multiMode: false
  },
   //回到首页
   goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  },
  
  
  //打开授权
  openSetting() {
    console.log("打开设置窗口");
    wx.openSetting({
      success(settingdata) {
        console.log(settingdata)
        if (settingdata.authSetting["scope.writePhotosAlbum"]) {
          console.log("获取权限成功，再次点击图片保存到相册")
        } else {
          console.log("获取权限失败")
        }
      }
    })
  },
  saveBtn: async function () {
    var that = this
    wx.getSetting({
      success:(res)=> {
        if(res.authSetting['scope.writePhotosAlbum'] == false){
          console.log('没有权限')
          wx.showModal({
            title: '检测到您未授权访问相册,是否去授权访问相册',
            icon: 'fail',
            success: function (res) {
              console.log(res)
              if (res.confirm) {
                that.openSetting()
              }
            },
          })
        }else{
          console.log('已经有权限')
        }
      }
    })
    if (localCanvasImgUrl) {
      wx.saveImageToPhotosAlbum({
        filePath: localCanvasImgUrl,
        success: function (ele) {
          wx.showToast({
            title: '图片下载成功',
            icon: 'success'
          })
          // wx.hideToast()
        },
        fail: function (err) {
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            console.log("打开设置窗口");
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  console.log("获取权限成功，再次点击图片保存到相册")
                } else {
                  console.log("获取权限失败")
                }
              }
            })
          }
        }
      })
    }

  },
  onShow:function () {
  },

  //canvas文本换行函数
  textWrap:function (data) {
    console.log(data)
    var chr = data.split("");
    var temp = ""
    var row = []
    ctx.font = 'normal 14px sans-serif'
    ctx.setFillStyle('#333333')
    for(var i = 0;i<chr.length;i++){
      if(ctx.measureText(temp).width<272){
        temp += chr[i]
      }else{
        i--;
        row.push(temp);
        temp = ""
      }
    }
    row.push(temp)
    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      textWrap = 1
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < 240) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 20, 360 + b * 20, 270);
    }
  },
  onLoad: async function (option) {
    var that = this
    var page = getCurrentPages();
    if (page.length == 1) {
      that.setData({
        showBackBtn: true
      })
    }
    id = option.articleId
    let data = await getAppCode({
      path: '/pages/material/materialDetail/index?articleId=' + id
    })
    let res = await getLocalImage(data.data.data.appCodeUrl)

    if (option.articleId) {
      wx.showLoading({
        title: '图片生成中...'
      })
      let resData = await getOneArticle(option.articleId)
      let headImg = await getLocalImage(resData.data.data.head_img)
     //绘制canvas开始
      ctx.drawImage(headImg.path, 0, 0, 312, 279)
      ctx.save()
      ctx.beginPath()
      ctx.arc(20+20,20+291,20,0,Math.PI*2,false)
      ctx.clip()
      ctx.drawImage(resData.data.data.avatar,20,291,40,40)
      ctx.restore()
      ctx.font = 'normal 13px sans-serif'
      ctx.setFillStyle('#777777')
      ctx.fillText(resData.data.data.author_name,66,305)
      ctx.fillText(resData.data.data.created_at,66,325)
      that.textWrap(resData.data.data.title)
      ctx.drawImage(res.path,106,380+textWrap*20,100,100)
      ctx.draw(false,function (e) {
        wx.hideLoading()
        wx.canvasToTempFilePath({
          canvasId:'materialShareCanvas',
          fileType:'jpg',
          success(res){
            localCanvasImgUrl = res.tempFilePath
            console.log(res.tempFilePath)
          }
        })
      })
    }

  }
})