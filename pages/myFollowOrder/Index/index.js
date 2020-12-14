import regeneratorRuntime, {
  async
} from "../../../lib/httpServe/regeneration-runtime.js";
import {
  getFollow
} from "../../../resource/orderFollow.js";
import {
  orderGet
} from '../../../resource/order.js'


var app = getApp()
var pageNum = 1
var onLineLastPage = null
var offLineLastPage = null
Page({
  data: {
    current: 'teamEarnings',
    showModa: false,
    cusData: '',
    onLineData: '',
    offlineData: '',
    userid: '',
    showBackBtn: false,
    loadMoreTip: false,
    lastLoad: false //上拉加载到底提示 
  },
  //下拉刷新
  async refreshData(e){
    var that = this
    console.log(e)
    console.log(this.data.current)
    switch (this.data.current) {
      case 'teamEarnings':
      let freshOnData =  await orderGet({
        type:2,
        withConsume:1,
        withUser:1,
        page:1
      })
      if(freshOnData.data.msg == 'success'){
        that.setData({
          onLineData:freshOnData.data.data
        })
      }
        break;
      case 'myTeam':
        let freshOffData =  await getFollow({
          type:1,
          withConsume:1,
          withUser:1,
          page:1
        })
        if(freshOffData.data.msg == 'success'){
          that.setData({
            offLineData:freshOffData.data.data
          })
        }
      default:
        break;
    }
  },
  //上拉加载
  async loadMoreData(e) {
    console.log('滑动到底部')

    var that = this
    let currentType = that.data.current  
    switch (currentType) {
      case 'teamEarnings':
      if (e.detail.direction == 'bottom' && pageNum <= onLineLastPage) {
        console.log('略略略')
        pageNum++
        that.setData({
          loadMoreTip: true
        })
      }
        let onLineDataBefore = that.data.onLineData
        if (onLineDataBefore.length == 0) return
        if (pageNum <= onLineLastPage) {
          let onLineDataAfter = await orderGet({
            type: 2,
            withConsume: 1,
            withUser: 1,
            page: pageNum
          })
          if (onLineDataAfter.data.msg == 'success') {
            onLineDataAfter.data.data.forEach((item) => {
              onLineDataBefore.push(item)
            })
            that.setData({
              onLineData: onLineDataBefore,
              loadMoreTip: false
            })
          }
        } else {
          that.setData({
            lastLoad: true,
            loadMoreTip: false
          })
        }

        break;
      case 'myTeam':
      if (e.detail.direction == 'bottom' && pageNum <= offLineLastPage) {
        console.log('略略略')
        pageNum++
        that.setData({
          loadMoreTip: true
        })
      }
        let offlineDataBefore = that.data.offlineData
        if (offlineDataBefore.length == 0) return
        if (pageNum <= offLineLastPage) {
          let offlineDataAfter = await getFollow({
            type: 1,
            withConsume: 1,
            withUser: 1,
            page: pageNum
          })
          if (offlineDataAfter.data.msg == 'success') {
            offlineDataAfter.data.data.forEach((item) => {
              offlineDataBefore.push(item)
            })
            that.setData({
              offlineData: offlineDataBefore,
              loadMoreTip: false

            })
          }

        } else {
          that.setData({
            lastLoad: true,
            loadMoreTip: false
          })
        }

        break;
      default:
        break;
    }

  },

  handleChange({
    detail
  }) {
    this.setData({
      lastLoad: false,
      current: detail.key
    })
  },

  //查看详情
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/myFollowOrder/details/index?id=' + id + '&type=' + type
    })
  },
  //添加消费
  toAddPay: function (e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myFollowOrder/addConsumption/index?type=' + type + '&orderId=' + id
    })
  },
  //添加跟单
  addOrder: function () {
    wx.navigateTo({
      url: '/pages/myFollowOrder/inputInfo/index'
    })
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '/pages/main/homePage/index'
    })
  },
  onLoad: async function (options) {
    //回到首页
    if (JSON.stringify(options) != '{}') {
      this.setData({
        current: 'myTeam'
      })
    } else {
      this.setData({
        current: 'teamEarnings'
      })
    }
    var page = getCurrentPages();
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
  },
  onShow: async function () {
    pageNum = 1
    let resOnline = await orderGet({
      type: 2, //等会改2
      withConsume: 1,
      withUser: 1,
      page: pageNum
    })
    let resOffline = await getFollow({
      type: 1,
      withConsume: 1,
      withUser: 1,
      page: pageNum
    })
    if (resOffline.data.msg == 'success' && resOnline.data.msg == 'success') {
      onLineLastPage = resOnline.data.page.lastPage
      offLineLastPage = resOffline.data.page.lastPage
    }
    this.setData({
      onLineData: resOnline.data.data,
      offlineData: resOffline.data.data
    })
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})