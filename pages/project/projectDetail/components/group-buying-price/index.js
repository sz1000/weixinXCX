// pages/project/projectDetail/components/group-buying-price/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    target:1000000,
    format:['天','时','分','秒']
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      console.log("12312",this.data.value)
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
