// pages/project/projectDetail/components/group-buying/index.js

import regeneratorRuntime, {
  async
} from '../../../../../lib/httpServe/regeneration-runtime.js'

import {
  getBuyingGroups
} from '../../../../../resource/groupBuying'
import { hideArticle } from '../../../../../resource/material.js';


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productId: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userId:null,
    opacity: 0,
    animationName: true,
    translateY: "100px",
    animationData: '',
    listData: [],
    endTime: "",
    format: ['天', ':', ':', ' ']
  },
  lifetimes: {
    attached() {
      let userId =  wx.getStorageSync("loginData").id;
      this.initData()
      this.setData({
        userId,
        endTime: 66
      })
    },
    detached() {

    }
  },
  pageLifetimes:{
    hide(){
      console.log("页面隐藏了")
      clearTimeout(this.timeout)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async initData(data) {
      let serveData = await getBuyingGroups(this.data.productId, data).catch((err) => {
        console.error('getBuyingGroups', err)
      })     
           
      if (serveData) {
        this.setData({
          animationName: !this.data.animationName,
          listData: serveData.data.data
        })
      }
    },
    toGroupBuyingDtaile(e) {
      if (!e.currentTarget.dataset.valid) return
      let id = e.currentTarget.id
      wx.navigateTo({
        url: '/pages/project/groupBuyingDtaile/index?type=join&groupId=' + id
      });
    },
    animationEnd(e) {
      if (this.data.animationName) {
        this.timeout = setTimeout(() => {
          this.setData({
            animationName: !this.data.animationName
          })
        }, 3000)
      } else {
        let prevId = this.data.listData.groups.length - 1
        this.initData(prevId)
      }
    },
    handleToRule(){
      console.log('this.data.productId',this.data.productId)
      wx.navigateTo({
        url: '/pages/project/groupBuyingRule/index?productId=' + this.data.productId
      });
    }
  }
})