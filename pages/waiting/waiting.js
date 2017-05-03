var app = getApp();
Page({
  data: {
    totalOrders: [],
    totalPrice:0
  },
  onLoad: function (options) {

    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        totalOrders: app.globalData.orders,
        totalPrice: app.globalData.totalPrice
      })
    })

    // 生命周期函数--监听页面加载
    wx.connectSocket({
      url: "ws://localhost:8181",
    })

    //连接成功
    wx.onSocketOpen(function () {
      wx.sendSocketMessage({
        data: 'stock',
      })
    })

    wx.onSocketMessage(function (data) {
      // data
      console.log(data);
    })

    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })


  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "ease",
    })

    var isShow = true;
    this.timer = setInterval(function () {
      if (isShow == true) {
        animation.opacity(0).step();
        isShow = false;
      } else {
        animation.opacity(1).step();
        isShow = true;
      }
      this.setData({
        animation: animation.export()
      })
    }.bind(this), 800)
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

  onTapContinueOrder: function (e) {
    //  移除定时器 
    this.timer && clearInterval(this.timer);
  },

onPreventTap: function (e) {

	},

  onTapChooseShadow: function (e) {
    if (this.data.isStandardTips) {
      this.setData({
        isStandardTips: false
      });
    } else {
      this.setData({
        isStandardTips: true
      });
    }
  },

  onTapChoose: function (e) {
    if (this.data.isStandardTips) {
      this.setData({
        isStandardTips: false,
      });
    } else {
      this.setData({
        isStandardTips: true,
      });
    }
  },
  
})