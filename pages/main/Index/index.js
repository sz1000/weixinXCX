import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'

import {
  getOneArticle,
  getIndexArticle
} from '../../../resource/material.js'
import {
  getIndexInfo
} from "../../../resource/indexInfo.js"
import {
  getSalerInfo
} from "../../../resource/saler.js";

import {
  login,
  registSalerHandle
} from "../../../lib/utils"



var app = getApp().globalData
var setLogoInfo = getApp().setLogoInfo

Page({
  data: {
    vipMaskShow:true, 
    becomeSaler: false, //显示成为销售框的提示
    current: 'homepage',
    project: '',
    name: '全部',
    src: "/static/project/quanbu2x.png",
    demoList: [],
    demoListd: [],
    noDataContent: '',
    blockOne: '',
    blockTwo: '',
    blockThree: [],
    blockFour: [],
    welcome: true,
    welText: false,
    userInfo: {},
    isSaler: false,
    salerInfo: {},
    parentInfo: {}, //悬浮头像信息
    showHeadImg: false, //是否显示悬浮头像
    member_price:"",
    testurl:''

  },
  onLoad: async function (option) {
    console.log("TCL: --主页 option", option)
    var that = this
    //获取首页数据
    that.getConfigIndex()
    
    //打开分享
    wx.showShareMenu({
      withShareTicket: true
    })
    //只有registSaler 为城市合伙人入口   都有为发展下级入口
    if (option.parentId || option.registSaler) {
      app.registSaler = option.registSaler
      app.parentId = option.parentId
    }

    if (app.registSaler && !app.isSaler) {
      this.setData({
        becomeSaler: true
      })
    }
  },
  onShow(){
    setTimeout(()=>{
      this.setData({
        testurl:'https://img.kodin.cn/ubjhUkqiumGTPAJLZ5OOjgskNmFgyrzp.png'
      })
    },2000)
    // const UpdateManager = wx.getUpdateManager()
    // UpdateManager.onUpdateReady((res)=>{
    //   console.log("TCL: onShow -> res", res)
    // })
    // UpdateManager.onUpdateReady(function () {
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success(res) {
    //       if (res.confirm) {
    //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //         UpdateManager.applyUpdate()
    //       }
    //     }
    //   })
    // })
    if(wx.getStorageSync('loginData').isSaler){
      this.handleCloseVipMask()
    }
  },
  handleCloseVipMask(data){
    this.setData({
      vipMaskShow:false
    })
  },
  //会员套餐区banner修改处
     handleTogroupbooking(){
    wx.navigateTo({
      url: '/pages/main/groupbooking/index'
    });
  },


  // handleToVipDetails(){
  //   wx.navigateTo({
  //     url: '/pages/main/vipDetails/index'
  //   });
  // },
  //去门店（查看全部医生和全部案例）
  toShop: function (e) {
    let id = e.currentTarget.dataset.id
    wx.reLaunch({
      url: '../../shop/Index/index?id=' + id
    })
  },
  //注册销售
  beSaler: async function () {
    await registSalerHandle()
  },
  //设置悬浮框状态
  welcomeTo: function () {
    this.setData({
      welcome: this.data.welcome ? false : true,
      welText: this.data.welcome ? true : false
    })
  },
  //跳转类目全部
  showAll: function (e) {
    wx.reLaunch({
      url: '/pages/project/projectList/index?name=' + 'all'
    })
  },
  //去商品列表
  goToProject: function (e) {
    let item = e.currentTarget.dataset.item
    wx.reLaunch({
      url: '/pages/project/projectList/index?id=' + item.id + '&name=' + item.name + '&level=' + item.level + '&parentId=' + item.parentId
    })
  },

  //去案例详情
  goDemo: async function (e) {
    let articleId = e.currentTarget.dataset.article.id
    if (app.isLogo) {
      await getOneArticle(articleId)
    }
    wx.navigateTo({
      url: '/pages/material/materialDetail/index?articleId=' + articleId
    })
  },
  //可配置模块跳转
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    if (item.type) {
      switch (item.type) {
        case 2:
          wx.navigateTo({
            url: '/pages/shop/doctorDetail/index?doctorId=' + item.bindId
          })
          break;
        case 1:
          wx.navigateTo({
            url: '/pages/material/materialDetail/index?articleId=' + item.bindId
          })
          break;
        case 3:
          wx.navigateTo({
            url: '/pages/project/projectDetail/index?productId=' + item.bindId
          })
          break;
        default:
          break;
      }
    } else {
      wx.navigateTo({
        url: '/pages/shop/doctorDetail/index?doctorId=' + item.id
      })
    }
  },
  handleToAppointment() {
    wx.navigateTo({
      url: '/pages/main/inquiry/index'
    })
  },
  //获取首页配置信息
  async getConfigIndex() {
    let indexInfo = await getIndexInfo()
    console.log("TCL: getConfigIndex -> indexInfo--==", indexInfo)
    
    if (indexInfo.data.msg == 'success') {
      indexInfo.data.data.location4.forEach((item) => {
        if (item.id != null) {
          this.data.blockFour.push(item)
        }
      })
      this.setData({
        blockOne: indexInfo.data.data.location1,
        blockTwo: indexInfo.data.data.location2,
        blockThree: indexInfo.data.data.location3,
        blockFour: this.data.blockFour,
        demoList:indexInfo.data.data.location5,
      })
    }
  },
  //去商品详情
  goProductDetail: function (e) {
    console.log(e)
    let productId = e.currentTarget.dataset.product
    console.log(productId)

    wx.navigateTo({
      url: '/pages/project/projectDetail/index?productId=' + productId
    })
  },
  handleToInquiry(){
    wx.navigateTo({
      url: '/pages/main/inquiry/index',
    });
  },
  handleToGroupBuying(){
    wx.navigateTo({
      url: '/pages/project/groupBuyingList/index',
    });
  },
  //拉取首页案例列表
  async getArticleList() {
    let demoList = await getIndexArticle({
      recommend: 1
    })
    console.log("TCL: getArticleList -> demoList", demoList)
    if (demoList.data.msg == 'success') {
      this.setData({
        demoList: demoList.data.data,
      })
    }
  },
})