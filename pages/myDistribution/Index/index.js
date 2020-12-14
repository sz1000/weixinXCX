import regeneratorRuntime, {
  async
} from "../../../lib/httpServe/regeneration-runtime.js";
import {
  teamEarnings,
  myTeam
} from "../../../resource/saler.js";

Page({
  data: {
    current: 'teamEarnings',
    earning: 0,
    teamNum: 0,
    myTeam:[],
    noDataContent:'暂无数据'
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    })
  },
  //邀请好友
  addFenXiao: function name(params) {
    wx.navigateTo({
      url: '/pages/myDistribution/addDistribution/index'
    })
  },
  onLoad: async function () {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    let earningData = await teamEarnings()
    let myTeamData = await myTeam()
    if (earningData.data.msg == 'success') {
      this.setData({
        teamEarnings: earningData.data.data.profit,
        teamNum: earningData.data.data.numOfTeam,
        myTeam:myTeamData.data.data
      })
    }
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})