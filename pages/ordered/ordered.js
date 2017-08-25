// ordered.js
var app = getApp();
import { $wuxToptips } from '../../components/wux'
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://' + app.globalData.server + '8080/Api/Wechat/getOrdered?shopId=' + app.globalData.shopId + '&deskId=' + app.globalData.deskId,//上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.statue == 0) {
          wx.hideLoading();
          if (res.data.data == null){
            $wuxToptips.success({
              hidden: !0,
              text: res.data.msg,
              success: () => wx.navigateBack()
            });
            that.setData({
              isNoData: true
            })
          } else{
            that.setData({
              isNoData: false,
              totalOrders: res.data.data.ordered,
              totalPrice: res.data.data.totalPrice,
            })
          }
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
  
  },

  payed:function(e){
    var notice = {
      clientType: 0,
      noticeType: 0,
      shopId: app.globalData.shopId,
      deskId: app.globalData.deskId,
      deskNum: '11号桌',
      noticeContent: '11号桌买单',
      noticeIsDealed: false
    };
    wx.sendSocketMessage({
      data: JSON.stringify(notice),
    });
    wx.onSocketMessage(function (data) {
      var result = JSON.parse(data.data);
      if (result.statue == 0) {
        wx.hideLoading();
        $wuxToptips.success({
          hidden: !0,
          text: result.msg,
          success: () => wx.navigateBack()
        })
      } else if (result.statue == 1) {
        wx.hideLoading();
        $wuxToptips.show({
          timer: 3000,
          text: result.msg,
          success: () => console.log('toptips', error)
        })
      }
    })
  }
})