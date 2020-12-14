import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import {
  categoryGet,
  porjectListGet,
} from '../../../resource/product.js'

var pageNum = 1 //设置初始页码为1
var lastPage = null //定义页面的最大数
var isRecommend, name, cateId, cateSubId, sort //拉取商品列表的参数

Page({
  data: {
    showMask: false,
    currentId: null,
    currentLevelTwo: null,
    parentId: 0,
    categoryLevelOne: [],
    categoryLevelTwo: [],
    template: 'projectList',
    projectData: '',
    noDataContent: '暂无数据',
    titleContentLeft: null,
    titleContentRight: null,
    titleSaler: false,
    levelOneAll: {},
    levelTwoAll: {},
    inputValue: '',
    screenHeight: null,
    loadMoreTip: false, //上拉加载中提示
    lastLoad: false, //上拉加载到底提示 
    paramsGetProjectList: ''
  },
  // 上拉加载更多
  async loadMoreData(e) {
    console.log(e)
    var that = this
    let projectDataBefore = that.data.projectData
    if (projectDataBefore.length == 0) return
    if (e.detail.direction == 'bottom' && pageNum <= lastPage) {
      pageNum++
      that.setData({
        loadMoreTip: true
      })
      let data = that.data.paramsGetProjectList
      data["page"] = pageNum
      console.log(data)
      if (pageNum <= lastPage) {
        let res = await porjectListGet(data)
        res.data.data.forEach((item) => {
          projectDataBefore.push(item)
        })
        that.setData({
          projectData: projectDataBefore,
          loadMoreTip: false,
        })
      }
    } else {
      that.setData({
        lastLoad: true,
        loadMoreTip: false
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: async function (e) {

    pageNum = 1
    var that = this
    console.log(e)

    let productArr = []
    let data = that.data.paramsGetProjectList
    data["page"] = 1
    let res = await porjectListGet(data)
    console.log(res)
    res.data.data.forEach((item) => {
      productArr.push(item)
    })
    that.setData({
      projectData: productArr,
    })
    wx.stopPullDownRefresh()
  },

  //上拉加载
  async onReachBottom() {
    console.log('上拉加载')
    var that = this
    let projectDataBefore = that.data.projectData
    if (projectDataBefore.length == 0) return
    if (e.detail.direction == 'bottom' && pageNum <= lastPage) {
      pageNum++
      that.setData({
        loadMoreTip: true
      })
      let data = that.data.paramsGetProjectList
      data["page"] = pageNum
      console.log(data)
      if (pageNum <= lastPage) {
        let res = await porjectListGet(data)
        res.data.data.forEach((item) => {
          projectDataBefore.push(item)
        })
        that.setData({
          projectData: projectDataBefore,
          loadMoreTip: false,
        })
      }
    } else {
      that.setData({
        lastLoad: true,
        loadMoreTip: false
      })
    }
  },

  //商家精选
  showSelectProjects: async function () {
    pageNum = 1
    isRecommend = 1
    this.setData({
      showMask: false,
      titleSaler: true,
      titleContentLeft: null,
    })
    this.getProjectListData({
      sort,
      isRecommend: 1,
      page: pageNum
    })

  },
  //智能推荐模块排序
  projectOrder: async function (e) {
    console.log(e)
    let that = this
    let type = e.currentTarget.dataset.type
    console.log(type)
    switch (type) {
      case '智能推荐':
        pageNum = 1
        that.setData({
          lastLoad: false,
          titleContentLeft: null,
          titleSaler: false,
          projectData: that.getProjectListData({
            page: pageNum
          })
        })
        break;
      case '价格最高':
        pageNum = 1
        sort = 1
        that.setData({
          lastLoad: false,
          projectData: that.getProjectListData({
            isRecommend: isRecommend,
            name,
            cateId,
            cateSubId,
            sort: 1,
            page: pageNum
          })
        })
        break;
      case '价格最低':
        pageNum = 1
        sort = 2
        that.setData({
          lastLoad: false,
          projectData: that.getProjectListData({
            isRecommend,
            name,
            cateId,
            cateSubId,
            sort: 2,
            page: pageNum
          })
        })
        break;
      case '销量最高':
        pageNum = 1
        sort = 3
        that.setData({
          lastLoad: false,
          projectData: that.getProjectListData({
            isRecommend,
            name,
            cateId,
            cateSubId,
            sort: 3,
            page: pageNum
          })
        })
        break;
      default:
        break;
    }
    this.setData({
      titleContentRight: type,
      // titleContentLeft:null,
      // titleSaler:false
    })
  },
  //获取输入值
  getInputValue: function (e) {
    console.log(e)
    pageNum = 1
    let value = e.detail.value
    this.setData({
      lastLoad: false,
      inputValue: value,
      showMask: false
    })
    console.log(value)
    name = value
    this.getProjectListData({
      sort,
      name: value,
      page: pageNum
    })

  },
  //删除输入框值
  cancelInput: function () {
    this.setData({
      inputValue: ''
    })
  },
  //改变类目tab选项 
  changeTab: async function (e) {
    console.log("TCL: e", e)
    var that = this
    let item = e.currentTarget.dataset.project
    console.log("TCL: item", item)
    if (item.name == '全部项目' && item.level != 2) {
      console.log("TCL: 全部项目")
      this.getProjectListData({
        page: pageNum
      })
      this.setData({
        currentId: ''
      })
      return
    }
    switch (item.level) {
      case 1:
        console.log('一级类目')
        console.log(item.name)
        that.setPara(item)
        that.setData({
          ['levelTwoAll.namedata']: item.name,
          currentId: item.name == '全部项目' ? '' : item.id,
          projectData: item.name == '全部项目' ? that.getProjectListData({
            // isCustomer: 1,
            // onSale: 1,
            page: pageNum
          }) : that.getProjectListData({
            sort,
            cateId: item.id,
            page: pageNum
          })
        })
        break;
      case 2:
        console.log('二级类目')
        that.setPara(item)
        that.setData({
          currentLevelTwo: item.name == '全部项目' ? '' : item.id,
          projectData: item.name == '全部项目' ? that.getProjectListData({
            cateId: that.data.currentId,
            page: pageNum
          }) : that.getProjectListData({
            sort,
            cateSubId: item.id,
            page: pageNum
          })
        })
        break;
      default:
        break;
    }

  },
  //整理setdata赋值
  setPara: function (item) {
    console.log("TCL: item", item)
    pageNum = 1
    cateId = item.level == 1 ? item.id : null
    cateSubId = item.level == 2 ? item.id : null
    isRecommend = null
    name = null
    this.setData({
      lastLoad: false,
      titleContentLeft: item.id === '' ? item.namedata : item.name,
      titleSaler: false,
      parentId: item.name == '全部项目' ? '' : item.parentId,

    })
  },
  //渲染数据
  getProjectListData: async function (data) {
    console.log(data)
    for (var index in data) {
      if (data[index] == undefined) {
        delete data[index]
      }
    }
    if (JSON.stringify(data) !== '{}') {
      this.setData({
        paramsGetProjectList: data
      })
      data.isCustomer = 1
      data.onSale = 1
      let res = await porjectListGet(data)
      console.log("TCL: res", res)


      
      lastPage = res.data.page.lastPage
      if (res.data.msg == 'success') {
        this.setData({
          projectData: res.data.data
        })
      }
    }
  },
  //去项目详情
  toProjectDetail: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../project/projectDetail/index?projectId=' + id
    })
  },
  //拉出项目列表
  showProject: function () {
    this.setData({
      showMask: this.data.showMask ? false : true,
      template: this.data.showMask ? 'projectList' : 'category',
    })
  },
  //拉出推荐列表
  showRecommd: function () {
    this.setData({
      showMask: this.data.showMask ? false : true,
      template: this.data.showMask ? 'projectList' : 'recommd',
      titleContentRight: this.data.titleContentRight
    })
  },
  closeModal: function () {
    this.setData({
      showMask: this.data.showMask ? false : true,
      template: 'projectList'
    })
  },
  onHide: function () {
    pageNum = 1
    this.getProjectListData({
      // isCustomer: 1,
      // onSale: 1,
      page: pageNum
    })
    this.setData({
      lastLoad: false,
      titleSaler: false,
      titleContentLeft: null,
      titleContentRight: null,
    })

  },
  onShow: function () {
    this.setData({
      showMask: false,
      template: 'projectList'
    })
  },
  onLoad: async function (option) {
    pageNum = 1
    const mobileInfo = wx.getSystemInfoSync()
    let windowHeight = mobileInfo.windowHeight //屏幕可使用高度
    this.setData({
      lastLoad: false,
      screenHeight: windowHeight
    })
    var that = this
    if (option.id) {
      let level = option.level == 1 ? 'cateId' : 'cateSubId'
      if (option.level == 1) {
        that.setData({
          currentId: option.id,
        })
        console.log(that.data.currentId)
      } else if (option.level == 2) {
        that.setData({
          currentId: option.parentId,
          currentLevelTwo: option.id
        })
      }
      // [level] = option.id
      that.getProjectListData({
        [level]: option.id,
        page: pageNum,

      })
      console.log('商品')
      that.setData({
        titleContentLeft: option.name
      })
    } else {
      //首页点全部项目
      if (option.name == 'all') {
        that.getProjectListData({
          // isCustomer: 1,
          // onSale: 1,
          page: pageNum
        })
        that.setData({
          titleContentLeft: '全部项目',
        })
      } else {
        console.log('默认拉取')
        //默认拉跳转商品
        that.getProjectListData({
          // isCustomer: 1,
          // onSale: 1,
          page: pageNum
        })
      }
    }
    that.getCategoriesList()
  },
  //获取类目列表
  getCategoriesList: async function (params) {
    //一级全部和二级全部
    let levelOneAll = {
      name: '全部项目',
      id: '',
      level: 1,
    }
    let levelTwoAll = {
      name: '全部项目',
      id: '',
      level: 2
    }
    let category = await categoryGet()
    console.log("TCL: category", category)
    category.data.data.forEach((item) => {
      let categoryLevel = {
        icoImg: item.ico_img,
        name: item.name,
        level: item.level,
        parentId: item.parent_id,
        id: item.id
      }
      if (categoryLevel.level == 1) {
        this.data.categoryLevelOne.push(categoryLevel)
      } else if (categoryLevel.level == 2) {
        this.data.categoryLevelTwo.push(categoryLevel)
      }
    });
    this.setData({
      categoryLevelOne: this.data.categoryLevelOne,
      categoryLevelTwo: this.data.categoryLevelTwo,
      levelOneAll,
      levelTwoAll
    })
  }
})