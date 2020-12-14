// pages/main/userInfo/userAddress/Index/index.js
import {
  getUserAddressList,
  deleteUserAddress
} from '../../../../../resource/user1'

import {
  postUserAddress,
  putUserAddress,
  getUserAddress
} from '../../../../../resource/user1'


Page({
  data: {
    addressList: []
  },
  onLoad: function(options) {

  },
  onShow: function() {
    this.initData()
  },
  handleDeleteItem(e) {
    console.log("TCL: handleDeleteItem -> e", e.currentTarget.id)
    let _this = this
    wx.showModal({
      title: "是否确认删除",
      confirmColor: '#C9A880',
      success: function(evl) {
        if (evl.confirm) {
          deleteUserAddress(e.currentTarget.id).then(() => {
            _this.initData()
          })
        }
      }
    })
  },
  handleItem(e) {
    // console.log("TCL: handleItem -> e", e.currentTarget.id)
    let that = this
    // wx.navigateTo({
    //   url: '/pages/order/orderCreat/index?id=' + e.currentTarget.id
    // });
    let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
    console.log(pages);
    let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
    /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */

    let para = {
      address: "",
      detail_address: "",
      reciver: "",
      status: false,
      tel: ""
    }
    for (var i = 0; i < that.data.addressList.length; i++) {
      if (e.currentTarget.id == that.data.addressList[i].id) {
        para.address = that.data.addressList[i].address
        para.detail_address = that.data.addressList[i].detail_address
        para.reciver = that.data.addressList[i].reciver
        para.status = that.data.addressList[i].status
        para.tel = that.data.addressList[i].tel
      }
    }
    var arr = []
    arr.push(para)
    prevPage.setData({
      addressList: arr,
      noAddress: false
    })
    console.log(that.data.addressList)
    console.log(arr)
    putUserAddress(e.currentTarget.id, para).then(res => {

      wx.navigateBack({
        delta: 1
      })

    }).catch(err => {
      console.log("TCL: handleSubmit -> err", err)
    })
  },
  noAddress(e) { //点击不需要地址
    let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
    let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西

    prevPage.setData({
      noAddress: true
    })
    wx.navigateBack({
      delta: 1
    })
  },
  handlePutAddress(e) {
    wx.navigateTo({
      url: '/pages/main/userInfo/userAddress/addAddress/index?id=' + e.currentTarget.id
    });
  },
  handleToAddAddress() {
    wx.navigateTo({
      url: '/pages/main/userInfo/userAddress/addAddress/index'
    });
  },
  initData() {
    getUserAddressList().then(res => {
      console.log("TCL: initData -> res", res)
      this.setData({
        addressList: res.data.data
      })
    }).catch(err => {
      console.log("TCL: initData -> err", err)
    })
  }
})