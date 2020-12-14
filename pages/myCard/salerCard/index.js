import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import { getUserInfo } from "../../../resource/user1.js";



Page({
  data: {
    animationData: '',
    userMs: '',
    cardImg: '',
    tipMakeCard:false,
    bgImg:"",
    spinShow: true,
    showBackBtn: false,
    salerInfo:{},
    id:''
  },
  toH5: async function () {
    wx.navigateTo({
      url: '/pages/main/h5Webview/index?salerId='+this.data.id+'&withShare='+true
    })
  },
  toMakeCard:function (params) {
    console.log("TCL: params", params)
    if(params.type == 'cancel'){
      this.setData({
        tipMakeCard:false
      })
    }else if(params.type == 'ok'){
      this.toCropper()
      this.setData({
        tipMakeCard:false
      })
    }
  },
  toImg: function (e) {
    if(this.data.cardImg !== ''){     
      wx.navigateTo({
        url: '/pages/myCard/shareToFriend/index?imgUrl='+this.data.cardImg
      })
    }else {
      this.setData({
        tipMakeCard:true
      })
    }
  },
  personInfomation: function () {
    wx.navigateTo({
      url: '/pages/myCard/salerInfo/index'
    })
  },
  toCropper: async function () {
    wx.navigateTo({
      url:'/pages/myCard/cropCardImg/index'
    })
  },
  toMyMaterial: function () {
    wx.navigateTo({
      url: '/pages/myCard/bindArticle/index'
    })
  },
  animationEnd: function () {

  },
  onLoad: async function () {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
   let userData =  await getUserInfo()
   console.log("TCL: userData", userData)
   if(userData.data.msg == 'success'){
     this.setData({
      spinShow:false,
      bgImg:userData.data.data.salerInfo.bg_img,
      cardImg:userData.data.data.salerInfo.card_img,
      id:userData.data.data.salerInfo.user_id,
     })
   }
  },
  // 回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})