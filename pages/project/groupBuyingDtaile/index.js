  // pages/project/groupBuyingDtaile/index.js
  import regeneratorRuntime, {
    async
  } from '../../../lib/httpServe/regeneration-runtime.js'
  import {
    getBuyingGroupsInfo,
    getBuyingGroupsOpen,
    postBuyingGroupsJoin,
    getOrderIdtoGroupInfo
  } from '../../../resource/groupBuying'

  import {
    payOrder
  } from '../../../resource/order'

  var app = getApp().globalData;

  Page({

    /**
     * 页面的初始数据
     */
    data: {
      returnIndexShow: false,
      loginShow: false,
      serveData: {},
      type: '',
      timeEnd: false,
      registerShow: "",
      openCode: ""
    },

    /**
     * 生命周期函数--监听页面加载
     * @param {string} type  - 类型 start | details | join
     * start 发起拼团
     * details 拼团详情
     * join  参与拼团
     * @param {string} id 商品id 
     * 
     * @param {string} orderId 订单Id 用于支付
     * 
     * @param {string} groupId 用于获取订单 
     */
    onLoad: function ({
      type = '',
      id = '',
      orderId = '',
      groupId = ''
    }) {
      console.log('TCL: groupId"', groupId)
      console.log("TCL: orderId", orderId)
      if (type === 'start' || type === 'details' || type === 'join') {

        if (type === 'start') {
          wx.setNavigationBarTitle({
            title: '发起拼团'
          })
          this.orderId = orderId
          this.setData({
            serveData: wx.getStorageSync('tempGroupInfo')
          })
        }

        if (type === 'join' || type === "details") {
          this.initData(groupId)
        }

        if (type === 'join') {
          wx.setNavigationBarTitle({
            title: '爱美丽 | 爱拼团'
          })
        }

        this.setData({
          type: type
        })

      } else {
        console.error("onLoad type : 类型错误")
      }

    },
    async initData(groupId) {
      let serveData = await getBuyingGroupsInfo(groupId)
      console.log("TCL: initData -> serveData--拼团信息", serveData.data.data.time_to_close < 0)
      let timeEnd = serveData.data.data.time_to_close < 0
      console.log("TCL: initData -> timeEnd", timeEnd)

      this.setData({
        serveData: serveData.data.data,
        timeEnd
      })
    },
    hangdleJoinGroupPay() {
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
      console.log(app.isLogo)
      if (!app.isLogo) {
        this.setData({
          loginShow: true
        })
        wx.hideLoading();
        return
      }

      postBuyingGroupsJoin(this.data.serveData.id, this.data.serveData.act_id).then((res) => {
        console.log("TCL: hangdleJoinGroupPay -> 参团成功", res)
        wx.hideLoading()
        this.wxPay(res.data.data.id)
      }).catch((err) => {
        console.error(err)
        wx.showToast({
          title: err.data.msg,
          icon: "none",
          duration: 1500,
          mask: true,
        });
      })
    },
    hangdlePay() {
      this.wxPay(this.orderId)
    },
    handleRegister(e) {
      console.log("TCL: handleRegister -> e", e)
      if (e.detail.isRegist) {
        wx.showToast({
          title: '注册成功 ',
          duration: 1500,
          mask: false
        });
      }
    },
    wxPay(orderId) {
      if (!app.isLogo) {
        this.setData({
          loginShow: true
        })
        return
      }
      let _this = this
      payOrder(orderId).then((res) => {
        wx.requestPayment(Object.assign({}, res.data.data, {
          timeStamp: res.data.data.timestamp
        }, {
          async success(suc) {
            console.log("TCL: success -> suc-支付成功", suc)
            if (!_this.data.serveData.id) {
              let groupInfoData = await getOrderIdtoGroupInfo(orderId).catch((err) => {
                console.error('获取团信息出错', err)
              })

              console.log("TCL: success -> groupInfoData", groupInfoData)
              wx.redirectTo({
                url: `/pages/project/groupBuyingSuccess/index?groupId=${groupInfoData.data.data.id}`
              })
            } else {
              wx.redirectTo({
                url: `/pages/project/groupBuyingSuccess/index?groupId=${_this.data.serveData.id}`
              })
            }

          },
          fail(err) {
            console.error("支付失败", err)
          }
        }))
      }).catch((error) => {
        console.log("TCL: hangdlePay -> error", error)
      })
    },
    handleToOrder() {
      wx.navigateTo({
        url: '/pages/order/orderDetail/index?orderId=' + this.data.serveData.my_order.id
      });
    },
    handleLoginChange(e) {
      console.log("TCL: handleLoginChange -> e", e)
      if (!e.detail.isRegist) {
        this.setData({
          openCode: e.detail.openCode,
          registerShow: true
        })
      }
      this.setData({
        loginShow: e.detail.show
      })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let pagesArr = getCurrentPages()
      if (pagesArr.length <= 1) {
        this.setData({
          returnIndexShow: true
        })
      }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      let name = wx.getStorageSync("loginData").nick_name
      return {
        title: `爱美丽，爱拼团 | ${name}发起拼团，邀请您加入! -- ${this.data.serveData.id}`,
        path: '/pages/project/groupBuyingDtaile/index?type=join&groupId=' + this.data.serveData.id
      }
    }
  })