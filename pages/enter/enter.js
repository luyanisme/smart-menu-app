// enter.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },

  onTapScanQR: function(){
    wx.scanCode({

      success: function (res) {
        console.log(res);
        //json格式
        // {
        //   "shopId": "1",
        //     "deskId": "1"
        // }
        var result = JSON.parse(res.result);
        app.globalData.shopId = result.shopId;
        app.globalData.deskId = result.deskId;
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.server + '/Api/Wechat/getShopInfo?shopId=' + app.globalData.shopId,//上线的话必须是https，没有appId的本地请求貌似不受影响 
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
          // header: {}, // 设置请求的 header  
          success: function (res) {
            app.globalData.shopInfo = res.data.data,
            wx.hideLoading();
            var url = '../menu/menu';
            wx.navigateTo({
              url: url
            })
          },
          fail: function () {
            // fail  
          },
          complete: function () {
            // complete  
          }
        })
      },

      fail: function () {

        // fail

      },

      complete: function () {

        // complete

      }

    })
  }
})