import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import payConsts from '../../../lib/const/pay.js'
import {
  orderGet,
  orderCancel,
  payOrder,
  deleteOrder,
  orderRefund
} from "../../../resource/order.js";
import {
  productDetailGet
} from "../../../resource/product.js";



var app = getApp()

Page({
  data: {
    rangeRefund: ['后悔了，不想去了', '我想换个时间', '去过了，不满意效果', '去商家达成一致，取消订单', '其他'],
    listData: [],
    currentTabs: "all",
    test: 0
  },
  onLoad(options) {
    if (options.current) {
      this.setData({
        currentTabs: options.current
      })
    }
  },
  onShow() {
    this.initData()
  },
  initData() {
    let status = this.data.currentTabs === 'all' ? {} : {
      status: this.data.currentTabs
    }
    //没有数据限制请求接口
    // if(status.status=="0"){
    //   return
    // }
    orderGet(Object.assign({}, {
        type: 1,
        withProduct: 1
      }, status))
      .then(res => {
        console.log(res)
        this.setData({
          listData: res.data.data
        })
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  handleToDetail(e) {
    console.log("TCL: handleToDetail -> e", e)
    wx.navigateTo({
      url: '/pages/order/orderDetail/index?type=join&orderId=' + e.currentTarget.id
    });
  },
  handleChangeRefund(e) {
    this.handleOrderRefund({
      id: e.target.id,
      cause: this.data.rangeRefund[e.detail.value]
    })
  },
  handleOrderRefund({
    id,
    cause
  }) {
    orderRefund({
        id,
        cause
      })
      .then(res => {
        console.log(res)
        this.initData()
      })
      .catch(err => {
        console.log(err)
      })
  },
  handleOrderPay(e) {
    let _this = this
    payOrder(e.target.id)
      .then(res => {
        console.log("TCL: handleOrderPay -> res", res)
        wx.requestPayment({
          timeStamp: res.data.data.timestamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success(res) {
            console.log("TCL: success -> res", res)
            _this.initData()
          },
          fail(res) {}
        })
      })
      .catch(err => {
        console.log("TCL: handleOrderPay -> err", err)
      })
  },
  handleChangeTabs(e) {
    console.log("TCL: handleChangeTabs -> e", e)
    this.setData({
      currentTabs: e.detail.key
    })
    this.initData()
  },
  handleOrderCancel(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '是否确认取消订单？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#5194FC',
      success: (result) => {
        if (result.confirm) {
          orderCancel(e.target.id)
            .then((res => {
              console.log("TCL: handleOrderCancel -> res", res)
              _this.initData()
            })).catch(err => {
              console.log("TCL: handleOrderCancel -> err", err)
            })
        }
      },
      fail: () => {},
      complete: () => {}
    });

  },
  handleDeleteOrder(e) {
    console.log(e)
    let _this = this
    wx.showModal({
      title: '提示',
      content: '删除后无法恢复，是否确认删除？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#5194FC',
      success: (result) => {
        if (result.confirm) {
          deleteOrder(e.target.id)
            .then(res => {
              console.log(res)
              _this.initData()
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      fail: () => {},
      complete: () => {}
    });

  },
  onShareAppMessage: function (e) {
    console.log("TCL: e", e.target.dataset.shareImg)
    console.log(e.target.id)
    let name = wx.getStorageSync('loginData').name;
    // // 页面被用户分享时执行
    return {
      title: `爱美丽,爱拼团 | ${name}发起拼团，邀请您加入！`,
      path: '/pages/project/groupBuyingDtaile/index?type=join&groupId=' + e.target.id,
      imageUrl: e.target.dataset.shareImg
    }
  },
  onPullDownRefresh() {
    console.log("下啦刷新中")
  },
  onReachBottom() {
    // console.log("上啦触底了")
    // this.setData({
    //   test: ++this.data.test
    // })
    // wx.setBackgroundColor({
    //   backgroundColor: '#F3F4F5', // 窗口的背景色为白色
    // })
  }
})