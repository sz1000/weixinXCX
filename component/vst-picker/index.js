Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    range:{
      type:Array||Object
    },
    value:{
      type:String
    },
    mode:{
      type:String,
      value:'selector'
    },
    placeholder:{
      type:String
    }  
  },

  /**
   * 组件的初始数据
   */
  data: {
    title:'',
    showArrow:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectInput:function(event){
        const value = event.detail.value
        this.setData({
          showArrow:false
        })
        this.triggerEvent('getValue',value, event);
    }
  }
})