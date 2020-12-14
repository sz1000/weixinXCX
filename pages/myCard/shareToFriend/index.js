import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import appConfig from "../../../lib/httpServe/config.js";
import {
  getOneArticle
} from "../../../resource/material.js";

import {
  getLocalImage
} from '../../../lib/utils'
import {
  getCardInfo
} from '../../../resource/card'
import {
  getAppCode
} from '../../../resource/material'
var context = wx.createCanvasContext('createCardCanvas')

var app = getApp()
Page({
  data: {
    multiMode:true,
    imgUrl:""
  },
  onLoad: function (option) {
    wx.showLoading({
      title: '名片生成中...',
      mask:true
    })
    let userData = wx.getStorageSync('loginData')
      if(userData !== ''){
        this.initData(userData.id)
      }else{
        wx.showToast({
          title: '没有登录，请登录。',
          mask:true,
          icon: 'none',
          duration: 2000
        })
      }
  },
  async initData(cardId) {
    let serveData = await getCardInfo(cardId)
    let bgimg = await getLocalImage(serveData.data.data.bg_img)
    console.log(bgimg)
    let name = serveData.data.data.name
    let org = serveData.data.data.org
    let address = serveData.data.data.address
    let headImg = await getLocalImage(serveData.data.data.avatar)
    let id = wx.getStorageSync('loginData').id
    let RQpath = `pages/main/Index/index?parentId=${id}&registSaler=true`
    let RQimg = await getAppCode({
      path: RQpath
    })
    let ma = await getLocalImage(RQimg.data.data.appCodeUrl)
    let img = await this.createCard(bgimg.path, ma.path, name, headImg.path, org, address)
    this.setData({
      imgUrl:img
    })
    wx.hideLoading()
  },
  //生成名片图片
  createCard(bgimg, ma, name, headImg, org, address) {
    return new Promise((resolve, reject) => {
      //背景图片
      context.drawImage(bgimg, 0, 0, 375 * 2, 667 * 2)
      //圆角边框
      drawRoundRect(context, 15 * 2, 421 * 2, 345 * 2, 230 * 2, 8 * 2)
      context.setFillStyle('#fff')
      context.fill()

      //二维码
      context.beginPath()
      context.drawImage(ma, 268 * 2, 560 * 2, 80 * 2, 80 * 2)

      //姓名
      context.font = "bold 40px Arial";
      context.setFillStyle('#333333')
      context.fillText(name, 47 * 2, 477 * 2)

      //渐变
      var gradient = context.createLinearGradient(130 * 2, 517 * 2, 187 * 2, 521 * 2);
      gradient.addColorStop(0, '#FD7E59');
      gradient.addColorStop(1, '#F55F52');
      context.fillStyle = gradient;
      context.fillRect(125 * 2, 504 * 2, 52 * 2, 4 * 2);

      //顾问
      context.font = "normal 13px Arial";
      context.setFontSize(13 * 2)
      context.setFillStyle('#575757')
      context.fillText('做你最贴心的美丽顾问', 47 * 2, 506 * 2)

      //所属机构
      context.fillText(org, 70 * 2, 532 * 2)
      context.drawImage('../../../static/img/hospital.png', 47 * 2, 520 * 2, 15 * 2, 15 * 2)

      //通信地址
      context.setFillStyle('#333333')
      console.log(address.length)
      if (address.length < 23) {
        context.fillText(address, 64 * 2, 555 * 2)
      } else {
        let addressRow1 = address.substr(0, 23)
        let addressRow2 = address.substr(23, address.length)
        context.fillText(addressRow1, 64 * 2, 555 * 2)
        context.fillText(addressRow2, 64 * 2, 572 * 2)
      }

      context.drawImage('../../../static/img/address.png', 47 * 2, 544 * 2, 10 * 2, 15 * 2)

      //头像
      context.save();
      context.beginPath();
      context.arc(140, 829, 70, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      context.drawImage(headImg, 70, 759, 70 * 2, 70 * 2);
      context.restore();

      context.draw(false, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375 * 2,
          height: 667 * 2,
          destWidth: 375 * 2,
          destHeight: 667 * 2,
          canvasId: 'createCardCanvas',
          fileType: 'jpg',
          quality: 1,
          success: function (res) {
            resolve(res.tempFilePath)
          }
        })
      })
    })


    function drawRoundRect(cxt, x, y, width, height, radius) {
      cxt.beginPath();
      cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
      cxt.lineTo(width - radius + x, y);
      cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
      cxt.lineTo(width + x, height + y - radius);
      cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
      cxt.lineTo(radius + x, height + y);
      cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
      cxt.closePath();
    }
  },
  saveBtn: async function () {
    wx.saveImageToPhotosAlbum({
      filePath:this.data.imgUrl,
      success(res) { }
    })
    //复制文字
    wx.setClipboardData({
      data: "亲~长按识别二维码，你可以通过这张小小的卡片认识我~你最贴心的美丽顾问",
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '保存并复制成功'
            })
          }
        })
      }
    })

  },

})