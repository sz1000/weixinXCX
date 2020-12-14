Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputData:Object
  },
  /**
   * 组件的初始数据
   */
  data: {
    input:''
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let input = this.properties.inputData
      this.setData({
        input,
      })
     },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      console.log('组建显示了')
    },
    hide: function () { },
    resize: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function() {
      console.log("组建加载了")
    },
    dataInit:function(){
        console.log("asdasd")
    }
  }
})