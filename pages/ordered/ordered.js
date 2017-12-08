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
      url: app.globalData.server + app.globalData.suffix + 'getOrdered?shopId=' + app.globalData.shopId + '&deskId=' + app.globalData.deskId,//上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.status == 0) {
          wx.hideLoading();
          if (res.data.data == null) {
            $wuxToptips.success({
              hidden: !0,
              text: res.data.msg,
              success: () => wx.navigateBack()
            });
            that.setData({
              isNoData: true
            })
          } else {
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

  payed: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: function (res) {
        console.log(res.code);
        wx.request({
          url: app.globalData.server + app.globalData.suffix + 'payAll',
          data: {
            code: res.code,
            totalPrice: that.data.totalPrice * 100
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
          // header: {}, // 设置请求的 header  
          success: function (res) {
            if (res.data.status == 0) {
              var payModel = JSON.parse(res.data.data);
              wx.requestPayment({
                'timeStamp': payModel.timestamp,
                'nonceStr': payModel.nonceStr,
                'package': payModel.package,
                'signType': 'MD5',
                'paySign': payModel.paySign,
                'success': function (res) {
                  wx.clearStorage();
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                      wx.request({
                        url: app.globalData.server + '/Api/changeDeskStatue',
                        data: {
                          deskId: app.globalData.deskId,
                          deskStatue: 0
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                        // header: {}, // 设置请求的 header  
                        success: function (res) {
                          wx.navigateBack();
                        },
                        fail: function (res) {
                        },
                        complete: function () {
                          // complete  
                        }
                      })
                    }
                  })
                },
                'fail': function (res) {
                }
              })
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
      }
    });
  }
})