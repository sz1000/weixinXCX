// pages/project/groupBuyingDtaile/components/group-buying-peopel/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:String,
    value:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    headimgArr:[0,1,2,3,4,5,6,7,8],
    groupBuyingData:{}
  },
  observers:{
    value:function(data){
    console.log("TCL: data", data)
      
      this.setData({
        groupBuyingData:data
      })
    }
  },
  lifetimes:{
    attached(){
      console.log(this.data.value)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleAdd(){
      this.data.headimgArr.push(1)
      this.setData({
        headimgArr:this.data.headimgArr
      })
    },
    handleCut(){
      this.data.headimgArr.pop()
      this.setData({
        headimgArr:this.data.headimgArr
      })
    }
  }
})
