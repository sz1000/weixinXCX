import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'

import {
  getOrderCount
} from "../../../resource/order.js";

import {
  myEarnings
} from "../../../resource/saler.js";

import {
  login
} from "../../../lib/utils"

import {
  getUserInfo
} from "../../../resource/user1"
var app = getApp().globalData


Page({
  data: {
    openCode: "",
    loginData: '',
    registerShow: false,
    current: 'account',
    isSaler: "",
    isLogined: false,
    avatarUrl: '',
    nickName: '',
    appointTitle: '预约',
    orderTitle: '订单',
    orderNumWaitPay: 0,
    orderNumHasOrdered: 0,
    refundNum: 0,
    orderNumFinished: 0,
    canWithDraw: 0,
    totalIncome: 0,
    todayAmount: 0,
    withDraw: 0,
    withDrawing: 0
  },
  switchToPage: function(e) {
    console.log(e.currentTarget.dataset.page)
    let page = e.currentTarget.dataset.page
    let url = page
    wx.navigateTo({
      url
    })
  },
  //会员中心页面
  handleToVipDetaile() {
    wx.navigateTo({
      url: '/pages/main/vipDetails/index'
    });
  },
   //会员等级
  tovipgrade(){
    wx.navigateTo({
      url: '/pages/distributionCenter/vipgrade/index',
    })
  },

  // 收益明细
  handleToearningsDetail() {
    wx.navigateTo({
      url: '/pages/myProfit/earningsdetail/index'
    });
  },
  //提现明细
  handleTomoneyDetail() {
    wx.navigateTo({
      url: '/pages/myProfit/withdrawdetail/index'
    });
  },
  handleLogin: function() {
    login().then(res => {
      console.log("TCL: res", res)
      if (res.isRegist) {
        this.setLoginData()
      } else {
        this.setData({
          openCode: res.openCode,
          registerShow: true
        })
      }
    }).catch(err => {
      console.log("TCL: err 没有登陆", err)
    })
  },
  handleRegister(e) {
    if (e.detail.isRegist) {
      this.setLoginData()
    }
  },
  //订单
  order: async function() {
    //判断是否登录
    wx.navigateTo({
      url: '/pages/order/index'
    })
  },
  //设置
  setup: async function() {
    wx.navigateTo({
      url: '/pages/setUp/index'
    })
  },
  update: async function() {
    var that = this
    wx.getStorage({
      key: 'loginData',
      success: function(res) {
        console.log(res)
        that.setData({
          isLogined: true,
          avatarUrl: res.data.avatar,
          nickName: res.data.nick_name
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  //查看所有订单
  showAllOrder: function() {
    wx.navigateTo({
      url: '/pages/order/Index/index'
    })
  },
  //分销奖励
  todistribuitionaward() {
    wx.navigateTo({
      url: '/pages/distributionCenter/distributionaward/index'

    })
  },
  //业务提成
  tocommission() {
    wx.navigateTo({
      url: '/pages/distributionCenter/commission/index',
    })
  },
  //管理奖
  tomanage() {
    wx.navigateTo({
      url: '/pages/distributionCenter/manage/index',
    })

  },
  // //去订单列表
  // toOrderList: function (e) {
  //   console.log(e)
  //   let current = e.currentTarget.dataset.current
  //   let state = e.currentTarget.dataset.state
  //   wx.navigateTo({
  //     url: '/pages/order/Index/index?current=' + current + '&state=' + state
  //   })
  // },
  onLoad: async function(option) {


  },
  onShow: async function() {
    let userInfo = await getUserInfo().catch((err) => {
      console.log('userInfo', err)
      app.isLogo = false
      app.userInfo = null,
        app.logoAuth = null,
        app.isSaler = false,
        app.egistSaler = false,
        wx.clearStorage()
      this.setLoginData()
    })
    console.log("TCL: userInfo", userInfo)
    if (userInfo.data.data) {
      app.isLogo = true
      app.isSaler = userInfo.data.data.isSaler
      wx.setStorageSync('loginData', userInfo.data.data);
    }

    this.setLoginData()
    var that = this
    let orderCuntData = await getOrderCount({
      type: 0
    })
    let res = await myEarnings()
    let data = res.data.data
    console.log(data)
    if (res.data.msg == 'success') {
      this.setData({
        canWithDraw: data.canWithDraw,
        todayAmount: data.todayAmount,
        withDraw: data.withDraw,
        withDrawing: data.withDrawing,

      })
    }
    if (orderCuntData.data.data.length != 0) {
      let item = orderCuntData.data.data
      console.log("TCL: item", item)

      this.setData({
        orderNumWaitPay: item.unpayNum,
        orderNumHasOrdered: item.paidNum,
        refundNum: item.refundNum,
        orderNumFinished: item.finishNum
      })
    }
  },
  setLoginData() {
    let _this = this
    wx.getStorage({
      key: 'loginData',
      success: function(res) {
        console.log(res)
        _this.setData({
          loginData: res.data,
          isLogined: true,
          isSaler: res.data.isSaler,
          avatarUrl: res.data.avatar,
          nickName: res.data.nick_name
        })
      },
      fail: function(err) {
        console.log('获取失败', err)
        _this.setData({
          isLogined: false,
          isSaler: '',
          avatarUrl: '',
          nickName: '',
        })
      }
    })

  }
})