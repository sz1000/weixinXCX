//图册新增
import regeneratorRuntime from '../../../lib/httpServe/regeneration-runtime.js'
import materialServe from '../../../resource/material.js'
import qiniuServe from '../../../lib/httpServe/serveQiniu.js'
import {
  articlesAdd,
  articlePreview,
  articlesEdit,
  getOneArticle
} from '../../../resource/material.js'
import appConfig from '../../../lib/appConfig.js'

var app = getApp()
var authorId

Page({
  data: {
    title: '', //标题
    content: '', //内容
    files: [], //图片
    show: true,
    showDeleteImg: false, //删除图标
    clicked: false,
    showBackBtn: false,
    userInfo: '',
    imgFiles: [],
    imgPreFiles: [],
    imgHead: '',
    options:''
  },
  onLoad: async function (options) {
    console.log(options)
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    if (options.articleId) {
      let result = await getOneArticle(options.articleId)
      result = result.data.data
      authorId = result.author_id
      console.log(result)
      let imgArray = []
      result.content.forEach((item) => {
        console.log(item)
        if (item.type == 'img')
          imgArray.push(item.content.imgUrl)
      })
      console.log()
      this.setData({
        title: result.title,
        content: result.head_text,
        files: [result.head_img].concat(
          imgArray
        )
      })
    }
    const userInfo = wx.getStorageSync('loginData')
    this.setData({
      userInfo,
      options
    })
  },
  //获取标题
  getTitle: function (event) {
    let value = event.detail.value;
    this.setData({
      title: value
    })
  },
  //获取内容
  bindTextAreaBlur: function (event) {
    let value = event.detail.value;
    this.setData({
      content: value
    })
  },
  //添加图片
  chooseImage: async function (e) {
    var that = this;
    let files = this.data.files
    // wx.showLoading({
    //   title: '上传中...',
    //   mask: true
    // })
    if (files.length < 9) {
      let uploaded = await qiniuServe.uploaderImg({
        count: 1,
        sizeType: '',
        sourceType: ''
      }).catch((e) => {
        console.log(e)
        return []
      })
      console.log(uploaded)
      if(uploaded.length == 0) return
      files.push(uploaded)
      this.setData({
        files: files
      })
      console.log(files)
    }
    // wx.hideLoading()
    // }


  },
  //预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
    })
  },

  //编辑图片
  edit: function () {
    var that = this;
    if (that.data.files.length != 0) {
      if (that.data.clicked) {
        that.setData({
          clicked: false,
          showDeleteImg: false
        })
      } else if (that.data.files.length != 0) {
        that.setData({
          showDeleteImg: true,
          clicked: true
        })
      }
    } else {
      wx.showToast({
        title: '暂无图片可编辑哦',
        icon: 'none',
        mask: true
      })
    }
  },
  //删除图片
  deleteImg: function (e) {
    if (this.data.files.length == 1) {
      this.setData({
        clicked: false
      })
    }
    var imgs = this.data.files;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      files: imgs
    });
  },
  //预览
  preview: async function () {
    console.log('预览页')
    console.log(this.data.files)
    const Authorization = wx.getStorageSync('token')
    // let contentData = []
    // this.data.optionsListData.map((item, index) => {
    //   contentData.push(Object.assign({}, {
    //     content: item.content,
    //   }, {
    //     type: item.type
    //   }))

    // })
    console.log(this.data.files)
    this.data.files.forEach((item, index) => {
      console.log(item)
      let data = {
        type: 'img',
        content: {
          imgUrl: item
        }
      }
      console.log(index)
      if (index == 0) {
        this.data.imgHead = item
      }

      this.data.imgPreFiles.push(data)
    });
    console.log("this.data.imgPreFiles")
    console.log(this.data.imgPreFiles)
    this.data.imgPreFiles.splice(0, 1)
    let preview = await articlePreview({
      avatar: this.data.userInfo.avatar,
      id: this.data.userInfo.id,
      authorName: this.data.userInfo.nick_name,
      orgId: appConfig.orgId,
      title: this.data.title,
      headText: this.data.content,
      content: this.data.imgPreFiles,
      type: 1,
      headImg: this.data.imgHead || ''
    })
    let token = preview.data.data.token
    if (token) {
      wx.navigateTo({
        url: '/pages/main/h5Webview/index?id=' + 'preview' + '&token=' + token
      })
    }
    this.data.imgPreFiles = []
  },
  //保存
  save: async function () {

    if (this.data.title == '') {
      wx.showToast({
        title: '还没有标题哦',
        icon: 'none'
      })
    } else if (this.data.content == '') {
      wx.showToast({
        title: '还没有朋友圈文字哦',
        icon: 'none'
      })
    } else if (this.data.files.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
    } else if(!this.data.options.articleId){
      //新建图册素材
      this.data.files.forEach((item) => {
        console.log(item)
        let data = {
          type: 'img',
          content: {
            imgUrl: item
          }
        }
        this.data.imgFiles.push(data)
      });
      this.data.imgFiles.splice(0, 1)
      console.log(this.data.imgFiles)
      let newData = await articlesAdd({
        avatar: this.data.userInfo.avatar,
        authorName: this.data.userInfo.nick_name,
        orgId: 1,
        title: this.data.title,
        headText: this.data.content,
        headImg: this.data.files[0],
        content: this.data.imgFiles,
        type: 1
      })
      console.log(newData)
      if (newData.data.msg == 'success') {
        wx.showToast({
          title: '图册素材新建成功',
          icon: 'success',
          duration: 1500
        })
        wx.navigateTo({
          url: '/pages/project/bindSameProject/index?articleId='+newData.data.data.id
        })
      }
      // let materialData = await materialServe.articles.get()
      // console.log(materialData)
    }else {
      //文章编辑
      this.data.files.forEach((item) =>{
        let data = {
          type:'img',
          content:{
            imgUrl:item
          }
        }
        this.data.imgFiles.push(data)
      })
      this.data.imgFiles.splice(0,1)
      if(authorId == this.data.userInfo.id){
        let result = await articlesEdit(this.data.options.articleId,
          {
            avatar:this.data.userInfo.avatar,
            authorName:this.data.userInfo.nick_name,
            orgId:1,
            title:this.data.title,
            headText:this.data.content,
            headImg:this.data.files[0],
            content:this.data.imgFiles,
            type:1
          })
          console.log(result)

          if(result.data.msg == 'success'){
            wx.showToast({
              title:'素材编辑成功',
              icon:'success'
            })
            wx.navigateTo({
              url:'/pages/project/bindSameProject/index?articleId='+this.data.options.articleId
            })
          }
      }else{

        let result = await articlesAdd(
          {
            avatar:this.data.userInfo.avatar,
            authorName:this.data.userInfo.nick_name,
            orgId:1,
            title:this.data.title,
            headText:this.data.content,
            headImg:this.data.files[0],
            content:this.data.imgFiles,
            type:1
          })
          console.log(result)
          if(result.data.msg == 'success'){
            wx.showToast({
              title:'素材编辑成功',
              icon:'success'
            })
            wx.navigateTo({
              url:'/pages/project/bindSameProject/index?articleId='+result.data.data.id
            })
          }
      }
      
    }

  },
 //回到首页
 goToHomePage: function () {
  wx.reLaunch({
    url: '../../main/Index/index'
  })
}
});