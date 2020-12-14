// component/global-img-load/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:String,
    mode:String,
    lazyLoad:Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    active:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLoad(e){
      console.log("TCL: handleLoad -> e", e) 
      this.setData({
        active:true
      })
    }
  }
})
