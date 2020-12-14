import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import callback from '../../../lib/callback.js'
import utils from '../../../lib/utils.js'
import appConfig from '../../../lib/appConfig.js'
import qiniuServe from '../../../lib/httpServe/serveQiniu.js'
import {
  articlesAdd,
  articlePreview,
  articlesEdit,
  getOneArticle
} from '../../../resource/material.js'

var windowHeight = wx.getSystemInfoSync().windowHeight
var compositorData = 0
var scrollEnd = '' //卷轴到底部
var scrollStart = '' //卷轴开始
var vArticleId;
var startPoint //获取初始点击点
var reverse = 0
var scrollTop = 0
var compare = function (obj1, obj2) {

  var val1 = obj1.id;
  var val2 = obj2.id;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}

var btnshow = 0
var lookBtnShow = 0
var authorId = null
Page({
  data: {
    scrollH: '800',
    scrolly: true, //滚动条方向
    scrollTop: 0, //滚动条顶部位置
    startPoint: NaN,
    animation: true,
    direction: 'all', //滑动设置
    floatViewShow: false, //遮罩层显示
    floatViewW: '100%', //遮罩层的宽
    moveH: '', //滑动层的高
    moveData: '', //移动的数据
    moveIngY: 0, //跟随移动
    moveShow: false, //移动图层显示控制
    touchViewShow: "",
    openID: "",
    // titleContent: "",
    titleContent:{
      id: 'title',
      articleId: '',
      num: 0,
      titleText: '',
      type: '',
      content: {
        text: '请输入图片简介',
        img: '/static/img/addNew.png'
      }
    },
    imgTitle: '请输入图片简介',
    showTaxis: '',
    showModal: '',
    disabled: false, //添加按禁止选项
    isCompositor:true, //设置排序按钮禁止
    orderBtnActive: '', //设置排序按钮样式
    optionsListData: [], //内容数据
    showBackBtn: false,
    contentData: [],
    contentData: "",
    userInfo: ''

  },

  //设置滚动条的高
  bindscroll: function (e) {
    scrollTop = e.detail.scrollTop; //获取设置滑动轴高
    this.setData({
      scrollTop
    })
  },
  fatherTitleInput: function (e) {
    console.log(e)
    let value = e.detail.value
    this.setData({
      "titleContent.titleText": value
    })
  },
  //上传图片
  addImg: async function (e) {
    //添加图片
    console.log(e)
    let index = e.currentTarget.dataset.id
    // wx.showLoading({
    //   title: '上传中...',
    //   mask: true
    // })
    console.log("看是上传")
    let uploaded = await qiniuServe.uploaderImg({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType:['album', 'camera']
    }).catch((e) => {
      console.log(e)
      console.error(e)
      // if (e.errMsg == 'chooseImage:fail cancel') {
      //   return false
      // }
      return []
    })
    console.log(uploaded)
    wx.hideLoading();
    if (uploaded.length == 0) return
    if (uploaded != null) {
      console.log('进来了')
      var imgUrl = uploaded;
      let img = index == 'title' ? 'titleContent.content.img' : 'optionsListData[' + e.currentTarget.dataset.seccode + '].content.imgUrl'
      this.setData({
        [img]: imgUrl
      })
      console.log([img])
    } else {
      wx.showToast({
        icon: 'none',
        title: '图片上传失败，请重试'
      })
    }
    console.log(uploaded)
  },
  inputPage: function (e) {
    var type = e.currentTarget.dataset.type //类型
    var seccode = e.currentTarget.dataset.seccode //排序id

    if (type == "title") {
      console.log(this.data.titleContent)
      var id = e.currentTarget.dataset.id
      var contentText = this.data.titleContent.content.text
    } else if (type == 'img' || type == 'text') {
      var id = seccode
      var contentText = this.data.optionsListData[id].content.text
    }

    this.setData({
      
      optionsListData: this.data.optionsListData
    })

    let callbackId = callback.regist((textData) => {
      if (type == 'title') {
        this.setData({
          'titleContent.content.text': textData.text,
          'titleContent.num': textData.num

        })
      } else {
        let inputText = 'optionsListData[' + id + '].content.text';
        let inputNum = 'optionsListData[' + id + '].num';
        this.setData({
          [inputText]: textData.text,
          [inputNum]: textData.num
        })
      }
    })
    console.log(callbackId)
    wx.navigateTo({
      // url: "/pages/material/textEdit/index?id=" + id + "&contentText=" + contentText
      url: "/pages/material/textEdit/index" + utils.formatQuery({
        callback: callbackId,
        contentText: contentText
      })
    })
  },
  //滑动开始
  moveStart: function (e) {
    startPoint = Math.floor((e.changedTouches[0].pageY + scrollTop - 153) / 90) //获取触摸点
    if (startPoint < this.data.optionsListData.length) {
      this.data.moveData = this.data.optionsListData[startPoint] //获取对应的数据给移动的盒子
      this.setData({
        startPoint: startPoint,
        scrolly: false,
        animation: true,
        moveIngY: e.changedTouches[0].pageY + scrollTop - 153 - 45,
        moveData: this.data.moveData,
        moveShow: true
      })
    }
  },
  //滑动Ing
  moveIng: function (e) {
    var scrollEnd = windowHeight - 80
    var moveScroll = e.changedTouches[0].pageY
    if (moveScroll > scrollEnd) {
      this.data.scrollTop += 12
      this.setData({
        scrolly: true,
        scrollTop: this.data.scrollTop
      })
    } else if (moveScroll < 153) {
      this.data.scrollTop -= 12
      this.setData({
        scrolly: true,
        scrollTop: this.data.scrollTop
      })
    }
    //拖拽移动 scrollTop
    var moveIngY = e.changedTouches[0].pageY + scrollTop - 153 - 40 // 跟随移动
    if (moveIngY < 0) {
      moveIngY = 0
    }
    var moveToData = Math.round(moveIngY / 90) //移动到什么位置
    var currentedPoint = this.data.moveIngY
    var currentedYData = Math.round(currentedPoint / 90)
    if (moveToData > (this.data.optionsListData.length - 1)) {
      moveToData = this.data.optionsListData.length - 1
    }
    if (moveToData != currentedYData) {
      if (currentedYData < moveToData) {
        var selectIndex = this.data.optionsListData.findIndex(function (value) {
          return value.id == moveToData
        })
        this.data.optionsListData[selectIndex].y -= 90
        this.data.optionsListData[selectIndex].id -= 1

        this.data.optionsListData[startPoint].y += 90
        this.data.optionsListData[startPoint].id += 1
        this.setData({
          optionsListData: this.data.optionsListData
        })
      } else if (currentedYData > moveToData) {
        var selectIndex = this.data.optionsListData.findIndex(function (value) {
          return value.id == moveToData
        })
        this.data.optionsListData[selectIndex].y += 90
        this.data.optionsListData[selectIndex].id += 1

        this.data.optionsListData[startPoint].y -= 90
        this.data.optionsListData[startPoint].id -= 1
        this.setData({
          optionsListData: this.data.optionsListData
        })
      }
    }
    this.setData({
      moveIngY: moveIngY
    })
  },
  //滑动结束
  moveEnd: function (e) {
    var compareData = this.data.optionsListData
    compareData.sort(compare)
    this.setData({
      startPoint: NaN,
      scrolly: true,
      animation: false,
      optionsListData: compareData,
      moveIngY: 0,
      moveData: '',
      moveShow: false
    })
  },
  choose: function () {
    this.setData({
      showModal: true,
    })
  },
  //排序
  compositor: function () {
    if (compositorData == 0) {
      this.setData({
        floatViewShow: true,
        animation: true,
        direction: 'all',
        floatViewW: '92%',
        showTaxis: true,
        orderBtnActive: 'orderBtnActive',
        disabled: true,
        touchViewShow: true,
      })
      compositorData = 1
    } else if (compositorData == 1) {
      this.setData({
        floatViewShow: false,
        direction: 'none',
        floatViewW: '100%',
        showTaxis: '',
        orderBtnActive: '',
        disabled: false,
        touchViewShow: '',
      })
      compositorData = 0
    }
  },
  //添加组件方法
  addView: function (type) {
    console.log(this.data.optionsListData)
    var that = this
    let list = this.data.optionsListData
    let id = this.data.optionsListData.length;
    console.log(id)
    let selectIndex = this.data.optionsListData.length
    if (type == 'img') {
      list.push({
        type: type,
        y: id * 90,
        id: id,
        num: 0,
        selectIndex: selectIndex,
        content: {
          text: "请输入本文信息",
          imgUrl: "/static/img/addNew.png"
        }
      });
    } else if (type == 'text') {
      list.push({
        type: type,
        id: id,
        y: id * 90,
        num: 0,
        selectIndex: selectIndex,
        content: {
          text: "请输入本文信息"
        }
      });
    }
    this.setData({
      optionsListData: list
    }, function () {
      that.setMoveH()
    })
  },
  go: function (e) {
    var viewDataSet = e.target.dataset;
    var viewText = viewDataSet.text;
    var that = this;
    switch (viewText) {
      case "文字":
        that.addView("text");
        break;
      case "图片":
        that.addView("img");
        break;
    }
    this.setData({
      showModal: false,
      isCompositor:false
    })
  },
  //预览
  lookBtnNow: async function () {
    console.log('预览')
    let contentData = []
    console.log(this.data.optionsListData)
    this.data.optionsListData.map((item, index) => {
     
      contentData.push(Object.assign({}, {
        content: item.content,
      }, {
        type: item.type
      }))
    })
    console.log(contentData)
    let preview = await articlePreview({
      avatar: this.data.userInfo.avatar,
      id: this.data.userInfo.id,
      authorName: this.data.userInfo.nick_name,
      orgId: appConfig.orgId,
      title: this.data.titleContent.titleText,
      headText: this.data.titleContent.content.text,
      content: contentData,
      type: 0,
      headImg: this.data.titleContent.content.img || ''
    })
    console.log(preview)
    let token = preview.data.data.token
    console.log(token)
    if (token) {
      wx.navigateTo({
        url: '/pages/main/h5Webview/index?id=' + 'preview' + '&token=' + token
      })
    }
  },
  //保存
  lookBtn: async function () {
    var that = this
    console.log(that.data.option.type)
    if (JSON.stringify(that.data.option) == '{}') {
      console.log('保存')
      if (btnshow == 0) {
        wx.showToast({
          title: "正在保存中...",
          icon: 'loading',
          mask: true,
        })

        btnshow = 1
        var isCheck = true;
        //保存
        
        var titleHead = that.data.titleContent
        var optionsListData = that.data.optionsListData
        if(titleHead.titleText == ""){
          wx.showToast({
            title: '请输入标题',
            mask: true,
            icon: "none"

          })
          isCheck = false;
          btnshow = 0
        }else if("/static/img/addNew.png" == titleHead.content.img ){
          wx.showToast({
            title: '封面图片为空',
            mask: true,
            icon: "none"

          })
          isCheck = false;
          btnshow = 0
        }

        optionsListData.forEach(function (item) {
          if ("img" == item.type) {
            if ("/static/img/addNew.png" == item.content.img) {
              wx.showToast({
                title: '图片为空',
                mask: true,
                icon: 'none'

              })
              isCheck = false;
              btnshow = 0
            } else {
              if (!titleHead.img1) {
                titleHead.img1 = item.content.img;
              } else if (!titleHead.img2) {
                titleHead.img2 = item.content.img;
              }
            };
          }
        });
        var contentData = []
        console.log(optionsListData)
        // if(optionsListData.length!=0){
          optionsListData.map((item, index) => {
          console.log(item)
          if(item.type == 'text'){
          console.log(item.content.text)
            if(item.content.text!= "请输入本文信息"){
              contentData.push(Object.assign({}, {
                content: item.content,
              }, {
                type: item.type
              }))
            }
            
          }else if(item.type == 'img') {
            if(item.content.imgUrl != '/static/img/addNew.png' ){
              contentData.push(Object.assign({}, {
                content: item.content,
              }, {
                type: item.type
              }))
            }
          }
        })
        // }
        
        that.setData({
          contentData
        })
        if (isCheck) {
          console.log(this.data.userInfo)
          if (that.data.titleContent.titleText !== '') {
            let materialData = await articlesAdd({
              orgId: appConfig.orgId,
              title: that.data.titleContent.content.text,
              headText: that.data.titleContent.titleText,
              content: contentData,
              type: 0, //记得换0
              headImg: that.data.titleContent.content.img,
              avatar: that.data.userInfo.avatar,
              authorName: that.data.userInfo.nick_name
            })
            console.log(contentData)
            if (materialData.data.msg == 'success') {
              wx.showToast({
                title: '素材添加成功',
                icon: 'success',
                mask: true
              })
            }
            wx.navigateTo({
              url: '/pages/project/bindSameProject/index?articleId='+materialData.data.data.id
            })
          }
        }
      }
    } else {
      //文章编辑
      console.log('编辑保存')
      let contentData = []
      // if(that.data.optionsListData.length!=0){
         that.data.optionsListData.map((item, index) => {
        console.log(item)
        contentData.push(Object.assign({}, {
          content: item.content,
        }, {
          type: item.type
        }))
  
      })
      // }
     
      console.log(contentData)
      if(authorId == that.data.userInfo.id){
        let materialData = await articlesEdit(
          that.data.option.articleId, {
            orgId: appConfig.orgId,
            title: that.data.titleContent.content.text,
            headText: that.data.titleContent.titleText,
            content: contentData,
            type: 0, //记得换0
            headImg: that.data.titleContent.content.img,
            avatar: that.data.userInfo.avatar,
            authorName: that.data.userInfo.nick_name
          }
        )
        if(materialData.data.msg == 'success'){
          console.log('素材编辑成功')
          wx.showToast({
            title:'素材编辑成功',
            icon:'success'
          })
          console.log(that.data.option.articleId)
          wx.navigateTo({
            url: '../../project/bindSameProject/index?articleId=' + that.data.option.articleId
          })
        }
      }else {
        let materialData = await articlesAdd(
          {
            orgId: appConfig.orgId,
            title: that.data.titleContent.content.text,
            headText: that.data.titleContent.titleText,
            content: contentData,
            type: 0, //记得换0
            headImg: that.data.titleContent.content.img,
            avatar: that.data.userInfo.avatar,
            authorName: that.data.userInfo.nick_name,
            coverImg:[]
          }
        )
        if(materialData.data.msg == 'success'){
          console.log('素材编辑成功')
          wx.showToast({
            title:'素材编辑成功',
            icon:'success'
          })
          console.log(that.data.option.articleId)
          wx.navigateTo({
            url: '../../project/bindSameProject/index?articleId=' + materialData.data.data.id
          })
        }
      }      
    }
  },
  //删除
  deleteOption: function (e) {
    //删除
    var that = this
    var seccode = e.currentTarget.dataset.seccode
    var deleteData = this.data.optionsListData.splice(seccode, 1)
    var deleteList = this.data.optionsListData
    for (let i = 0; i < deleteList.length; i++) {
      deleteList[i].id = i;
      deleteList[i].y = i * 90;
    }
    this.setData({
      optionsListData: this.data.optionsListData,
    }, function () {
      that.setMoveH()
    });
  },
  //设置滑动区域的值
  setMoveH: function () {
    var dataLength = this.data.optionsListData.length * 90
    this.setData({
      moveH: dataLength
    })
  },
  preventTouchMove:function () {
    this.setData({
      showModal:false
    })
  },
  onShow: function (options) {
    btnshow = 0
  },
  onLoad: async function (option) {
    var that =this
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    that.setData({
      option
    })
    if (option.articleId) {
      let result = await getOneArticle(option.articleId)
      result = result.data.data
      authorId = result.author_id
      let titleContent = {
        titleText: result.head_text,
        content: {
          img: result.head_img,
          text: result.title
        },
        num:result.title.length
      }
      if(result.content.length != 0){
        var optionsListBeforeData = []
        result.content.forEach((item,index) => {
          let content = {
            id:index,
            selectIndex:index,
            type:item.type,
            y:index*90,
            content:item.content,
            num:item.content.text == null ? 0 : item.content.text.length,
          }
          optionsListBeforeData.push(content)
          if(item.type == 'img'){
            that.addView('img')
          }else if(item.type == 'text'){
            that.addView('text')
          }
        });
        that.setData({
          isCompositor:false,
          optionsListData:optionsListBeforeData
        })
      }
      that.setData({
        titleContent,
      })
    }
    const userInfo = wx.getStorageSync('loginData')
    that.setData({
      userInfo,
    })


    var page = getCurrentPages();
    if (page.length == 1) {
      that.setData({
        showBackBtn: true
      })
    }
  },
   //回到首页
   goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
});