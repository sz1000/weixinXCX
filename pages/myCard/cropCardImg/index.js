// mycard/mycard.js
const regeneratorRuntime = require('../../../lib/httpServe/regeneration-runtime.js')
import {getUserInfo}  from '../../../resource/user1.js'
import qiniuService from "../../../lib/httpServe/serveQiniu.js";
import { updateSalerInfo } from "../../../resource/saler.js";
import { putCardInfo } from "../../../resource/card.js";
 // const qiniuService = require('../../service/qiniuService.js')
// const salesUserService = require('../../service/salesUserService.js')
// const saUserService = require('../../service/saUserService.js')
// const salesResource = require('../../resource/sales.js')
// const config = require('../../libs/config.js')
// const yautils = require('../../libs/utils.js')
// const callback = require('../../libs/callback.js')
// const token = require('../../libs/token.js')


var bgimgOriginW,
  bgimgOriginH,
  imgRatio,
  imgZoomRatio,
  handleMoveStartX,
  handleMoveStartY,
  imgMoveStartX,
  imgMoveStartY;
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var initX, initY, imgPath, touchesAmount;
// var bgimg = '../img/meibu.jpeg'
var ma = '../../static/img/ma.jpg'
var name, headImg, openId //用户的姓名和头像
const ctx = wx.createCanvasContext("myCanvas");
Page({
  data: {
    animationData: "",
    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false, //是否缩放状态
      distance: 0, //两指距离
      scale: 1 //缩放倍数
    },
    oldZoomScale: 1,
    imgPath: "",
    moveImgX: 0,
    moveImgY: 0,
    cutBoxX: 0,
    cutBoxY: 0,
    cutBoxW: 270, //裁剪框的宽
    cutBoxH: 480, //裁剪框的高
    bgimgX: "",
    bgimgY: "",
    bgBoxW: "",
    bgBoxH: "",
    bgimgZoomW: "",
    bgimgZoomH: "",
    bgimgOriginW: 0,
    bgimgOriginH: 0,
    bgimgOriginLength: 0,
  },
  imgMoveStart: function (e) {
    if (e.touches.length === 1) {
      let {
        clientX,
        clientY
      } = e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.touchStartEvent = e.touches;
    } else {
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        "stv.distance": distance,
        "stv.zoom": true //缩放状态
      });
    }
  },
  imgMoveIng: function (e) {
    touchesAmount = e.touches.length;
    if (e.touches.length === 1) {
      //单指移动
      if (this.data.stv.zoom) {
        //缩放状态，不处理单指
        return;
      }
      let {
        clientX,
        clientY
      } = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY - this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let {
        stv
      } = this.data;
      stv.offsetX += offsetX;
      stv.offsetY += offsetY;
      stv.offsetLeftX = -stv.offsetX;
      stv.offsetLeftY = -stv.offsetLeftY;
      //限制X方向的移动
      let scale = this.data.stv.scale;
      let chazhi = (this.data.bgimgZoomW * scale - this.data.bgimgZoomW) / 2;
      let minLengthRX =
        this.data.bgimgZoomW * scale - this.data.cutBoxW - chazhi;
      let minLengthLX;
      if (scale == 1) {
        minLengthLX = 0;
      } else {
        minLengthLX = chazhi;
      }
      stv.offsetX = stv.offsetX > minLengthLX ? minLengthLX : stv.offsetX;
      stv.offsetX = stv.offsetX > -minLengthRX ? stv.offsetX : -minLengthRX;

      //限制Y方向移动
      let chazhiY = (this.data.bgimgZoomH * scale - this.data.bgimgZoomH) / 2;
      let minLengthBY =
        this.data.bgimgZoomH * scale - this.data.cutBoxH - chazhiY;
      let minLengthTY;

      if (scale == 1) {
        minLengthTY = 0;
      } else {
        minLengthTY = chazhiY;
      }
      stv.offsetY = stv.offsetY > minLengthTY ? minLengthTY : stv.offsetY;
      stv.offsetY = stv.offsetY > -minLengthBY ? stv.offsetY : -minLengthBY;

      this.setData({
        stv: stv,
        bgimgX: stv.offsetX + initX,
        bgimgY: stv.offsetY + initY
      });
    } else {
      //双指缩放
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);

      let distanceDiff = distance - this.data.stv.distance;
      let newScale = this.data.stv.scale + 0.005 * distanceDiff;
      newScale = newScale > 2 ? 2 : newScale;
      this.setData({
        "stv.distance": distance,
        "stv.scale": newScale
      });
    }
  },
  imgMoveEnd: function (e) {
    if (touchesAmount == 2) {
      var scale = this.data.stv.scale;
      if (scale < 1) {
        this.setData({
          "stv.scale": 1
        });
      }
    }

    if (e.touches.length === 0) {
      this.setData({
        "stv.zoom": false //重置缩放状态
      });
    }
  },
  uploadImg: function () {
    var that = this;
    wx.chooseImage({
      //上传图片
      success: function (res) {
        imgPath = res.tempFilePaths[0];
        that.setData({
          imgPath: imgPath
        });
        wx.getImageInfo({
          //获取图片信息
          src: res.tempFilePaths[0],
          success: function (imgType) {
            bgimgOriginW = imgType.width; //获取到图片的宽
            bgimgOriginH = imgType.height - 50;
            // 图片比例
            imgRatio = bgimgOriginW / bgimgOriginH; 
            imgZoomRatio = bgimgOriginH / 480;
            var bgimgZoomH = 480;
            var bgimgZoomW = bgimgZoomH * imgRatio;

            that.setData({
              bgimgOriginW: bgimgOriginW,
              bgimgOriginH: bgimgOriginH,
              "stv.offsetX": 0,
              "stv.offsetY": 0,
              "stv.distance": 0,
              "stv.scale": 1,
              bgimgZoomW: bgimgZoomW,
              bgimgZoomH: bgimgZoomH
            });
          }
        });
      }
    });
  },
  creadCrad: function () {
    wx.showLoading({
      title: '名片生成请稍候',
      mask: true
    })
    var that = this
    var context = wx.createCanvasContext('createCardCanvas')
    var imgPath = this.data.imgPath;
    var canvasW = this.data.cutBoxW * imgZoomRatio;
    var canvasH = this.data.cutBoxH * imgZoomRatio;
    var x = -this.data.stv.offsetX * imgZoomRatio;
    var y = this.data.stv.offsetY * imgZoomRatio;
    ctx.drawImage(imgPath);
    ctx.draw(true, function () { //绘制裁剪图片
      that.setData({
        bgimgOriginLength: 1000
      })
      wx.canvasToTempFilePath({ //裁剪背景图片
        x: x,
        y: y,
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        fileType: "jpg",
        canvasId: "myCanvas",
        success: async function (res) {

          let userInfoData = await getUserInfo()
					console.log("TCL: userInfoData", userInfoData.data.data)

          // let saler = await salesUserService.getUserInfo()
          let userInfo = userInfoData.data.data

          // let cardInfo = await salesResource.card.getId(saler.salerId)
          console.log(userInfo)
          // console.log(saler)
          // console.log(cardInfo)
          // let salerId = saler.salerId
          
          var getLocaImg = function (imgUrl) {
            return new Promise((resolve, reject) => {
              wx.getImageInfo({
                src: imgUrl,
                success(imgdata) {
                  resolve(imgdata)
                },
                fail(err){
                  console.log("imgUrl")
                  console.log(imgUrl)
                  reject(err)
                }
              })
            })
          }
          
          var avatarUrl
           await getLocaImg(userInfo.avatar).then((res) => {
            avatarUrl = res.path
          })
          console.log(userInfo)
          var QRimg
          await getLocaImg(userInfo.avatar).then((res) => {
            QRimg = res.path
          })
          console.log(QRimg)
          let name = userInfo.name
          let bgimg = res.tempFilePath
          let cardImg
          // 绘制图片
          console.log("TCL: avatarUrl", avatarUrl)
          console.log("TCL: name", name)
          console.log("TCL: QRimg", QRimg)
          console.log("TCL: bgimg", bgimg)
          await createCard(bgimg, QRimg, name, avatarUrl).then((cardImgUrl) => {
            cardImg = cardImgUrl
          })

          let bgImgUrl = await qiniuService.uploaderUrl(bgimg)
					console.log("TCL: bgImgUrl", bgImgUrl)
          let cardImgUrl = await qiniuService.uploaderUrl(cardImg)
					console.log("TCL: cardImgUrl", cardImgUrl)
          let id = wx.getStorageSync('loginData').id
          if(that.caedId){
            await putCardInfo(that.caedId ,{
              bgImg: bgImgUrl,
              cardImg: cardImgUrl
            })
            wx.redirectTo({
              url: "/pages/myCard/newCard/index?id="+id
            })
          }else{
            console.error("没有caedId ")
          }
        }
      });
    });
    //生成名片图片
    function createCard(bgimg, ma, name, headImg) {
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

        //地址
        context.setFillStyle('#333333')
        context.fillText('上海', 64 * 2, 555 * 2)
        context.drawImage('../../../static/img/address.png', 47 * 2, 544 * 2, 10 * 2, 15 * 2)

        //医院
        context.fillText('杭州安歆医美', 142 * 2, 555 * 2)
        context.drawImage('../../../static/img/hospital.png', 122 * 2, 544 * 2, 15 * 2, 15 * 2)

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
    }


  },
  onLoad: async function (options) {
    if(options.cardId){
      this.caedId = options.cardId
    }
    var bgBoxW = windowWidth;
    var bgBoxH = windowHeight;
    initX = (windowWidth - 270) / 2;
    initY = (bgBoxH - 480) / 2;
    this.setData({
      cutBoxX: (windowWidth - 270) / 2,
      cutBoxY: (bgBoxH - 480) / 2,
      bgimgX: (windowWidth - 270) / 2,
      bgimgY: (bgBoxH - 480) / 2,
      bgBoxW: bgBoxW,
      bgBoxH: bgBoxH + 100
    });

    // var that = this;
    // wx.getImageInfo({
    //   src: "../img/test.png",
    //   success: function (imgData) {
    //     bgimgOriginW = imgData.width;
    //     bgimgOriginH = imgData.height;
    //     imgRatio = bgimgOriginW / bgimgOriginH;
    //     var bgimgZoomH = 480;
    //     var bgimgZoomW = bgimgZoomH * imgRatio;

    //     that.setData({
    //       bgimgZoomW: bgimgZoomW,
    //       bgimgZoomH: bgimgZoomH
    //     });
    //   }
    // });
  },
  // onShow: function () {
  //   wx.getStorage({ //从缓存获取openid
  //     key: 'UserMs',
  //     success: function (res) {
  //       openId = res.data.openID
  //       wx.request({ //用户数据
  //         // url: 'https://117900859.vstsa.xyz/card/info/get?openId=' + openId,
          
  //         header: {
  //           'content-type': 'application/json'
  //         },
  //         method: 'GET',
  //         success(res) { //数据返回成功回调
  //           name = res.data.name
  //           headImg = '../../static/img/headImg.jpg'
  //           wx.getImageInfo({
  //             src: res.data.qrCode,
  //             success: function (e) {
  //               ma = e.path
  //               console.log(123+ma);
  //             }
  //           })
  //         }
  //       })
  //     },
  //     fail: function (e) {
  //       console.log(e);
  //       console.log('名片也没有在缓存获取到openID')
  //     }
  //   })
  // }
});
