Page({
  data: {
    num: 0,
    question: [{
      id: 1,
      name: '双击编辑文本',
    }, {
      id: 2,
      name: '支付问题'
    }, {
      id: 3,
      name: '售后问题，客服系统'
    }, {
      id: 4,
      name: '会员系统',
    }, {
      id: 5,
      name: '其他',

    }],
    current: [''],
    position: 'right',
    showBackBtn: false
  },
  onLoad: function () {
    var page = getCurrentPages();
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
  },
  //多选
  handleFruitChange({
    detail = {}
  }) {
    const index = this.data.current.indexOf(detail.value);
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
  },
  //字数
  num: function (e) {
    this.setData({
      num: e.detail.cursor
    })
  },
  //提交
  switchTo: function () {
    wx.redirectTo({
      url: '/pages/main/submitFinish.js'
    })
  },
 //回到首页
 goToHomePage: function () {
  wx.reLaunch({
    url: '../../main/Index/index'
  })
}
});