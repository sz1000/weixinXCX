import qiniuUploader from '../qiniuUploader.js'
import regeneratorRuntime, {
  async
} from '../../utils/regeneration-runtime'
import appConfig from "../httpServe/config.js";

class serveQiniu {
  constructor() {
    wx.request({
      // url: 'https://beta-vstcom1.vstsa.xyz/api/v1/qiniu/token',
      url: appConfig.apiHost + 'api/v1/qiniu/token',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var options = {
          region: 'NCN', // 华北区
          uptoken: res.data.data.token,
          // domain: 'https://vst.67zu.com', //设置域名
          domain: 'https://img.kodin.cn', //设置域名
          shouldUseQiniuFileName: false
        };
        qiniuUploader.init(options);
      },
      fail: function (err) {
        console.error(err)
      }
    })
  }
  async uploaderImg(options) {
    return new Promise((resData, rej) => {

      wx.chooseImage({
        count: 1,
        sizeType: options.sizeType || ['original', 'compressed'],
        sourceType: options.sourceType || ['album', 'camera'],
        success: function (res) {
          wx.showLoading({
            title: '上传中...',
            mask: true
          })
          var filePath = res.tempFilePaths[0];
          qiniuUploader.upload(filePath, (res) => {
            wx.hideLoading()
            let imageUrl = res.imageURL
            resData(imageUrl)
          }, (error) => {
            console.log("出错了")
            console.log('error: ' + error);
            rej(error)
          }, {
            region: 'ECN',
            // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
            // key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
            // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
            // uptoken: pp, // 由其他程序生成七牛 uptoken
            // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
            // uptokenFunc: function() {
            // }
          }, (res) => {
            // console.log('上传进度', res.progress)
            // console.log('已经上传的数据长度', res.totalBytesSent)
            // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          }, () => {
            // 取消上传
          }, () => {
            // `before` 上传前执行的操作
          }, (err) => {
            // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
          });
        },
        fail: function (errInfo) {
          console.log("获取图片失败")
          rej(errInfo)
          wx.hideLoading()
          console.error("上传失败！！！")
        }
      })
    })
  }

  async uploaderUrl(url) {
    return new Promise((resData, rej) => {
      qiniuUploader.upload(url, (res) => {
        resData(res.imageURL)
      }, (error) => {
        console.log("出错了")
        console.log('error: ' + error);
        rej(error)
      }, {
        region: 'ECN',
        // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
        // key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
        // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
        // uptoken: pp, // 由其他程序生成七牛 uptoken
        // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
        // uptokenFunc: function() {
        // }
      }, (res) => {
        // console.log('上传进度', res.progress)
        // console.log('已经上传的数据长度', res.totalBytesSent)
        // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      }, () => {
        // 取消上传
      }, () => {
        // `before` 上传前执行的操作
      }, (err) => {
        // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
      });
    })
  }

}

export default new serveQiniu()