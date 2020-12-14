// component/global.returnIndex/index.js
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
    show:false
  },
  lifetimes: {
    attached() {
      if(getCurrentPages().length <= 1){
          this.setData({
            show:true
          })
      }
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    returnIndex(){
      console.log("返回首页")
      wx.switchTab({
        url:"/pages/main/Index/index"
      })
    }
  }
})
