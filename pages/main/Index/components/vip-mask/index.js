// pages/main/Index/components/vip-mask/index.js
import {
  getVipPrice
} from "../../../../../resource/user1";
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    member_price:''
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      getVipPrice().then(res=>{
      console.log("TCL: res", res)
        
        this.setData({
          member_price:res.data.data.member_price
        })
      })
     },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleChangeShow(){
      this.triggerEvent('show', false)
    },
    handleToVipDetails(){
      wx.navigateTo({
        url: '/pages/main/vipDetails/index'
      });
    },
    move(){

    }
  }
})
