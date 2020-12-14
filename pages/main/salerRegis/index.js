import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import {
  beSaler
} from '../../../resource/saler.js'
import {
  getUserInfo
} from "../../../resource/user1.js";
import qiniuServe from "../../../lib/httpServe/serveQiniu.js";
import {
  getBankName
} from "../../../resource/saler.js";

const {
  $Message
} = require('../../../dist/base/index');
var app = getApp().globalData

var isAgree, submitted,bankBranchName
Page({

  data: {
    workstatus: ['工作', '待业中'],
    traning: ['是', '否'],
    bank: ['建设银行', '工商银行', '农业银行', '招商银行'],
    userWorkStatus: '',
    userTraning: '',
    showTrain: '',
    hintVisible: false,
    circleStatus: false,
    bankCount: '',
    bankCode: '',
    bankLocation: '',
    address: '',
    bankBranchName: '',
    bankCode: '',
    userInfo: {},
    idImgUrlFront: '',
    idImgUrlReverse: '',
    isChecked:true
  },

  onLoad: async function (options) {
    const userInfo = wx.getStorageSync('loginData')
    this.setData({
      userInfo
    })
  },
  //选择开户行所在地
  selectBankLocation: function (e) {
    let locations = e.detail
    console.log(locations)
    this.setData({
      bankLocation: locations[0] + '-' + locations[1] + '-' + locations[2]
    })
  },
  //选择银行
  selectBank: function (e) {
    console.log(e.detail)
    let chooseBank;
    switch (e.detail) {
      case '0':
        chooseBank = '建设银行'
        break;
      case '1':
        chooseBank = '工商银行'
        break;
      case '2':
        chooseBank = '农业银行'
        break;
      case '3':
        chooseBank = '招商银行'
        break;
      default:
        break;
    }
    this.setData({
      bankCount: chooseBank
    })
  },
  // 选择工作状态
  selectWorkStatus: function (e) {
    console.log(e)
    var status;
    var identify;
    if (e.detail == 1) {
      status = '待业中';
      identify = 1
    } else {
      status = '工作';
      identify = 0
    }
    this.setData({
      userWorkStatus: status,
      identify
    });
  },
  // 微商经验
  selectTraning: function (e) {
    console.log(e)
    var traning;
    var showTrain;
    if (e.detail == 0) {
      traning = true;
      showTrain = '是'
    } else {
      traning = false;
      showTrain = '否'

    }
    this.setData({
      userTraning: traning,
      showTrain
    });
    console.log(this.data.userTraning)
  },
  //获取input输入值
  getValue: function (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    this.setData({
      [type]: value
    })
  },
  //验证银行卡号码
  checkBankCode: async function (e) {
    console.log(e.detail)
    let res = await getBankName(e.detail.value)
    console.log("___++++++++++++_________--")
    if (res.data.msg == 'success') {
      this.setData({
        bankCount: res.data.data,
      })
    }else{
      this.setData({
        isChecked:false
      })
    }
    console.log(res)
  },
  //选择身份证照片
  chooseIdentifyImg: async function (e) {
    var that = this
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'front':
        let uploaded1 = await qiniuServe.uploaderImg({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        })
        console.log(uploaded1)
        that.setData({
          idImgUrlFront: uploaded1
        })
        break;
      case 'reverse':
        console.log('djaidja')
        let uploaded2 = await qiniuServe.uploaderImg({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        })
        that.setData({
          idImgUrlReverse: uploaded2
        })
        break;

      default:
        break;
    }
    console.log(that.data.idImgUrlFront)
  },
  agreeKodin: function () {
    if (this.data.circleStatus) {
      isAgree = 0

    } else {
      isAgree = 1
    }
    this.setData({
      circleStatus: this.data.circleStatus ? false : true
    })
  },
  //提交按钮
  submit: async function () {
    let validate = {
      userWorkStatus: this.data.userWorkStatus,
      userTraning: this.data.showTrain,
      idImgUrlFront: this.data.idImgUrlFront,
      idImgUrlReverse: this.data.idImgUrlReverse,
      address: this.data.address,
      bankCount: this.data.bankCount,
      bankCode: this.data.bankCode,
      bankLocation: this.data.bankLocation,
      bankBranchName: this.data.bankBranchName
    }
    let {
      entries
    } = Object
    var i = 0
    for (let [key, value] of entries(validate)) {
      if (value == "") {
        let cast
        switch (key) {
          case "userWorkStatus":
            cast = '请选择你的工作状态'
            break;
          case "userTraning":
            cast = '请选择你的微商经验'
            break;
          case "idImgUrlFront":
            cast = '请上传你的身份证正面'
            break;
          case "idImgUrlReverse":
            cast = '请上传你的身份证反面'
            break;
          case "address":
            cast = '请填写你的通讯地址'
            break;
          case "bankCount":
            cast = '请选择你的结算银行'
            break;
          case "bankCode":
            cast = '请填写你的银行账号'
            break;
          case "bankLocation":
            cast = '请选择你的开户行所在地'
            break;
          case "bankBranchName":
            cast = '请填写开户行支行名称'
            break;
          default:
            break;
        }
        //答应消息
        $Message({
          content: cast,
          type: 'error'
        })
        break;
      }
      i++
      if (i == 9) {
        submitted = true
      }
    }
    if (submitted) {
      submitted = false
      wx.showLoading({
        title: '提交等待中...',
        mask: true,
        duration: 1000
      })
      if (!this.data.circleStatus) {
        $Message({
          content: '请同意Kodin合作协议',
          type: 'error'
        })
      } else {
        let parentId = app.parentId ? app.parentId : 0
        console.log(app.parentId)
        let salerRegis = await beSaler({
          experience: this.data.userTraning,
          identity: this.data.identify,
          parentId: parentId,
          idcardFront: this.data.idImgUrlFront,
          idcardBack: this.data.idImgUrlReverse,
          address: this.data.address,
          bank: this.data.bankCount,
          bankCode: this.data.bankCode,
          bankAddr: this.data.bankLocation,
          subBank: this.data.bankBranchName,
          agreed: isAgree
        }).catch((err) => {
          $Message({
            content: err.message,
            type: 'error'
          })
          this.setData({
            hintVisible: true
          })
          throw err
        })
        if (salerRegis.data.msg == 'success') {
          wx.hideLoading()
          let userInfo = await getUserInfo()
          console.log("TCL: userInfo", userInfo)
          app.isLogo = true
          app.isSaler = true

          wx.setStorage({
            key: 'loginData',
            data: userInfo.data.data
          })
          wx.reLaunch({
            url: '../Index/index'
          })
        }
        // wx.hideLoading()
      }
    }
  }

})