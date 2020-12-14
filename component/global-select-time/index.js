// component/global-select-time/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    value:"",
    months:[],
    days:[],
    hours:[],
    minutes:["10","20","30","40","50"]
  },
  observers:{
    "properties.value":function(){

    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
        this.value = [0,0,0]
        let dateArr = this.getDateArr()
        let hours = []
        for (let index = 1; index < 24; index++) {
          if(index < 10){
            hours.push(`0${index}`)
          }else{
            hours.push(index)
          }
        }
        this.setData({
          days:dateArr,
          hours
        })
     },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //显示
    hangshow(){
      this.setData({
        show:true
      })
    },
    handHide(){
      this.setData({
        show:false
      })
    },
    //确定后整理格式换
    confirmChange(){      
      let nowTime = new Date()
      let year = nowTime.getFullYear()
      let month = nowTime.getMonth() + 1 
      let nowDate = nowTime.getDate()
      if(this.data.days[this.value[0]] <  nowDate){
        month += 1
      }
      let day = this.data.days[this.value[0]]
      let hours = this.data.hours[this.value[1]]
      let minutes = this.data.minutes[this.value[2]]
      
      let time =  `${year}-${month < 10 ? '0'+month : month}-${day < 10 ? '0'+day : day} ${hours}:${minutes}:00`

      this.setData({
        show:false,
        value:time
      })
      this.triggerEvent('change',time)
    },
    bindChange(e){
      console.log(e)
      this.value =  e.detail.value
    },
    isLeapYear(year){
      if(year % 100 === 0){
        if(year % 400 === 0){
          return true
        }
      }else{
        if(year % 4 === 0){
          return true
        }
      }
      return false
    },
    getDateArr(){
      let dataArr = []
      let nowTime = new Date()
      let month = nowTime.getMonth() + 1
      let nowDate = nowTime.getDate()
      nowTime.setDate(0)
      let Remaining = nowTime.getDate() -  nowDate
      console.log("TCL: getDateArr -> Remaining", Remaining)
      for (let item = nowDate ; item <= nowTime.getDate(); item++) {
        dataArr.push(item)
      }
      for (let item = 1 ; item < nowDate; item++) {
        dataArr.push(item)
      }
      return dataArr
    }
  }
})
