// pages/main/inquiry/components/questions/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    optionsArr: [],
    current: '',
    currentCheckbox: [],
    text: ""
  },
  lifetimes: {
    attached: function() {
      let taget,value 
      switch (this.properties.value.type) {
        case '1':
            taget = "current"
            value = ''
          break;
        case '2':
            taget = 'currentCheckbox'
            value = []
          break;
        case '3':
            taget = 'text'
            value = ''
          break;
        default:
          console.error("出错了")
          break;
      }
      this.setData({
        [taget]:this.properties.value.answer || value
      })
    }
  },  
  /**
   * 组件的方法列表
   */
  methods: {
    handleRadioChange(e) {
      this.setData({
        current: e.detail.value
      })
    },
    handleCheckboxChange({ detail = {} }) {
      const index = this.data.currentCheckbox.indexOf(detail.value);
      index === -1 ? this.data.currentCheckbox.push(detail.value) : this.data.currentCheckbox.splice(index, 1);
      this.setData({
        currentCheckbox: this.data.currentCheckbox
      });
    },
    handInputTextarea({ detail = {} }) {
      this.setData({
        text: detail.value
      })
    },
    handConfirm(){
      let value 
      switch (this.properties.value.type) {
        case '1':
          value = this.data.current
          break;
        case '2':
          value = this.data.currentCheckbox
          break;
        case '3':
          value = this.data.text
          break;
        default:
          console.error("出错了")
          break;
      }
      this.triggerEvent("change",value)
    }
  }
})
