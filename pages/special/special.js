// special.js
var specialCases = [
  {
    caseId: 1,
    caseName: '红烧河豚',
    caseImagePath: '../../image/hongshaohetun.jpg',
    casePrice: '123.00'
  },
  {
    caseId: 4,
    caseName: '清蒸鸦片鱼',
    caseImagePath: '../../image/qingzhengyapianyu.jpg',
    casePrice: '85.00'
  },
  {
    caseId: 6,
    caseName: '麻辣小龙虾',
    caseImagePath: '../../image/xiaolongxia.jpg',
    casePrice: '65.00'
  },
  {
    caseId: 7,
    caseName: '红烧河豚',
    caseImagePath: '../../image/hongshaohetun.jpg',
    casePrice: '123.00'
  },
  {
    caseId: 7,
    caseName: '红烧河豚',
    caseImagePath: '../../image/hongshaohetun.jpg',
    casePrice: '123.00'
  },
];

import { $wuxToptips } from '../../components/wux'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // cases: specialCases
    severIp: app.globalData.server + '/',
  },

  onTapChooseBuy: function (e) {
    var index = e.target.dataset.index;
    wx.navigateTo({
      url: '../order/order?caseId=' + this.data.cases[index].caseId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: app.globalData.shopInfo.shopName });
    wx.showLoading({
      title: '加载中',
    })
    var page = this;
    wx.request({
      url: app.globalData.server + app.globalData.suffix + 'getSpecialCases?shopId=' + app.globalData.shopId,//上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.status == 0) {
          var cases = res.data.data[0].cases;
          page.setData({
            cases: cases,
          });
          wx.hideLoading();
        }
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})