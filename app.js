//app.js

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  reStore: function () {
    this.globalData.orders = [];
    this.globalData.totalOrderNums = 0;
    this.globalData.totalPrice = 0;
    this.globalData.categories = JSON.parse(this.globalData.originalCategories);
    this.globalData.selectRow = 0;
    this.globalData.categories[0].selected = true;
    this.globalData.isClear = true;
  },

  globalData: {
    userInfo: null,
    shopId: 1,
    deskId: 11,
    orders: [],
    totalOrderNums: 0,
    totalPrice: 0,
    categories: [],
    originalCategories: null,
    selectRow: 0,
    server: '127.0.0.1:',
    postHtml: '',
    isLoaded: false,
    ordered: [],
    isClear: false,
    isFromMenu: true
  }
})