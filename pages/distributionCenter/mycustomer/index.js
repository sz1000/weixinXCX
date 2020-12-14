
Page({
  /** * 页面的初始数据 */
  data: {
    current: "tab1",
    isActive: null,
    listMain: [{
      id: "1",
      region: "A",
      items: [{
        id: "..",
        name: "阿明",
        revenue: "1888",
        src: ''
      }, {
        id: "..",
        name: "阿乐",
        revenue: "2008"
      }, {
        id: "..",
        name: "奥特曼",
        revenue: "18"
      }, {
        id: "..",
        name: "安庆"
      }]
    }, {
      id: "2",
      region: "B",
      items: [{
        id: "..",
        name: "巴拉",
        revenue: "1888"
      }, {
        id: "..",
        name: "八仔",
        revenue: "999"
      }]
    }, {
      id: "3",
      region: "C",
      items: [{
        id: "..",
        name: "车仔面",
        revenue: "0"
      }, {
        id: "..",
        name: "吃货"
      }, {
        id: "..",
        name: "蠢货"
      }]
    }, {
      id: "4",
      region: "D",
      items: [{
        id: "..",
        name: "担担面"
      }, {
        id: "..",
        name: "刀仔"
      }, {
        id: "..",
        name: "兑兑"
      }]
    }, {
      id: "5",
      region: "E",
      items: [{
        id: "..",
        name: "担担面"
      }, {
        id: "..",
        name: "刀"
      }, {
        id: "..",
        name: "对对"
      }]
    }, {
      id: "6",
      region: "F",
      items: [{
        id: "..",
        name: "冯洁"
      }, {
        id: "..",
        name: "峰仔"
      }, {
        id: "..",
        name: "凤姐"
      }]
    }, {
      id: "7",
      region: "G",
      items: [{
        id: "..",
        name: "个吧",
        revenue: "1888"
      }, {
        id: "..",
        name: "哥哥",
        revenue: "999"
      }]
    }, {
      id: "8",
      region: "H",
      items: [{
        id: "..",
        name: "华仔",
        revenue: "188"
      }, {
        id: "..",
        name: "花花",
        revenue: "999"
      }]
    }, {
      id: "9",
      region: "I",
      items: [{
        id: "..",
        name: "i",
        revenue: "6666"
      }]
    }, {
      id: "10",
      region: "J",
      items: [{
        id: "..",
        name: "杰伦",
        revenue: "6666"
      }, {
        id: "..",
        name: "杰克逊",
        revenue: "9999"
      }]
    }, {
      id: "11",
      region: "K",
      items: [{
        id: "..",
        name: "可可",
        revenue: "1988"
      }, {
        id: "..",
        name: "可乐",
        revenue: "999"
      }]
    }, {
      id: "12",
      region: "L",
      items: [{
        id: "..",
        name: "乐乐",
        revenue: "1888"
      }, {
        id: "..",
        name: "兰迪",
        revenue: "999"
      }]
    }, {
      id: "13",
      region: "M",
      items: [{
        id: "..",
        name: "喵咪",
        revenue: "1888"
      }, {
        id: "..",
        name: "毛毛",
        revenue: "999"
      }]
    }, {
      id: "14",
      region: "N",
      items: [{
        id: "..",
        name: "侬好",
        revenue: "1888"
      }, {
        id: "..",
        name: "呐尼",
        revenue: "999"
      }]
    }, {
      id: "15",
      region: "O",
      items: [{
        id: "..",
        name: "欧阳",
        revenue: "1888"
      }, {
        id: "..",
        name: "欧耶",
        revenue: "999"
      }]
    }, {
      id: "16",
      region: "P",
      items: [{
        id: "..",
        name: "皮球",
        revenue: "1888"
      }, {
        id: "..",
        name: "皮蛋",
        revenue: "999"
      }]
    }, {
      id: "17",
      region: "Q",
      items: [{
        id: "..",
        name: "巧巧",
        revenue: "1888"
      }, {
        id: "..",
        name: "恰恰",
        revenue: "999"
      }]
    }, {
      id: "18",
      region: "R",
      items: [{
        id: "..",
        name: "肉肉",
        revenue: "1888"
      }, {
        id: "..",
        name: "若若",
        revenue: "999"
      }]
    }, {
      id: "19",
      region: "S",
      items: [{
        id: "..",
        name: "四哥",
        revenue: "1888"
      }, {
        id: "..",
        name: "四叔",
        revenue: "999"
      }]
    }, {
      id: "20",
      region: "T",
      items: [{
        id: "..",
        name: "他妈",
        revenue: "1888"
      }, {
        id: "..",
        name: "唐唐",
        revenue: "999"
      }]
    }, {
      id: "21",
      region: "U",
      items: [{
        id: "..",
        name: "呕",
        revenue: "1888"
      }, {
        id: "..",
        name: "u",
        revenue: "999"
      }]
    }, {
      id: "22",
      region: "V",
      items: [{
        id: "..",
        name: "v",
        revenue: "1888"
      }, {
        id: "..",
        name: "vi",
        revenue: "999"
      }]
    }, {
      id: "23",
      region: "W",
      items: [{
        id: "..",
        name: "王先生",
        revenue: "1888"
      }, {
        id: "..",
        name: "王海",
        revenue: "999"
      }]
    }, {
      id: "24",
      region: "X",
      items: [{
        id: "..",
        name: "小马",
        revenue: "1888"
      }, {
        id: "..",
        name: "小明",
        revenue: "999"
      }]
    }, {
      id: "25",
      region: "Y",
      items: [{
        id: "..",
        name: "悠悠",
        revenue: "1888"
      }, {
        id: "..",
        name: "有你",
        revenue: "999"
      }]
    }, {
      id: "26",
      region: "Z",
      items: [{
        id: "..",
        name: "张三",
        revenue: "1888"
      }, {
        id: "..",
        name: "张妮",
        revenue: "999"
        },  ]
    }],
    fixedTitle: null,
    toView: 'inTo0',
    oHeight: [],
    scroolHeight: 0,
    fixedTop: 0
  },
  //tab栏自带的点击事件
      handleChange({ detail }) {
        this.setData({
          current: detail.key
        });
      },
  //我的一级客户详情
  handtoCustomerDetailone() {
    wx.navigateTo({
      url: '/pages/distributionCenter/CustomerDetailOne/index',
    })
  },
  //我的二级客户详情
  handtoCustomerDetailtwo() {
    wx.navigateTo({
      url: '/pages/distributionCenter/CustomerDetailTwo/index',
    })
  },
  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    var that = this;
    var _id = e.target.dataset.id;
    for (var i = 0; i < that.data.listMain.length; ++i) {
      if (that.data.listMain[i].id === _id) {
        that.setData({
          isActive: _id,
          toView: 'inTo' + _id,
          fixedTitle: that.data.listMain[i].region
        })
        break;
      }
    }
  },

  // 页面滑动时触发
  onPageScroll: function (e) {
    console.log(e.detail)
    this.setData({
      scroolHeight: e.detail.scrollTop
    });
    for (let i in this.data.oHeight) {
      if (e.detail.scrollTop < this.data.oHeight[i].height) {
        this.setData({
          isActive: this.data.oHeight[i].key,
          fixedTitle: this.data.oHeight[i].name
        });
        return false;
      }
    }
  },

  // 处理数据格式，及获取分组高度
  getBrands: function () {
    var that = this;
    var number = 0
    //计算分组高度,wx.createSelectotQuery()获取节点信息
    for (let i = 0; i < that.data.listMain.length; ++i) {
      wx.createSelectorQuery().select('#inTo' + that.data.listMain[i].id).boundingClientRect(function (rect) {
        number = rect.height + number;
        var newArry = [{
          'height': number,
          'key': rect.dataset.id,
          "name": that.data.listMain[i].region
        }]
        that.setData({
          oHeight: that.data.oHeight.concat(newArry)
        })
      }).exec();
    };
  },
  onLoad: function (options) {
    var that = this;
    that.getBrands();
  }
})