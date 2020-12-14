// component/global-share/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    path:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    shareFriends(){
      wx.navigateTo({
        url:`/pages/myCard/shareToFriend/index?imgUrl=${this.properties.path}`
      })
    },
    shareFriend(){
      console.log("fengxia")
    },
    cancel(){
      this.triggerEvent('showchange', false)
    }
  }
})
