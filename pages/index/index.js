
var screen = require('../../utils/screenUtil.js');
var config = require('../../utils/config.js')
import { $wuxDialog } from '../../components/wux'
import { $wuxToptips } from '../../components/wux'

var app = getApp();
var exitApp = false;

Page({

  data: {
    // severIp: 'http://' + app.globalData.server + '8080/',
    severIp: app.globalData.server + '/',
    winHeight: screen.getScreenSize().height,
  },

  onLoad: function (options) {
    
    var link;
    if (options.q == null) {
      try {
        var value = wx.getStorageSync('url')
        if (value) {
          link = value;
        } else {
          return;
        }
      } catch (e) {
        // Do something when catch error
      }
    } else {
      link = decodeURIComponent(options.q);
      wx.setStorage({
        key: "url",
        data: link
      })
    }

    var paramArr = link.split('=');
    if (paramArr.length == 2) {
      var params = paramArr[1].split('_');
      app.globalData.shopId = params[0];
      app.globalData.deskId = params[1];
    }

    // app.globalData.shopId = 1;
    // app.globalData.deskId = 1;

    if (app.globalData.shopId == null) {
      return;
    }

    var page = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      // url: 'http://' + app.globalData.server + '8080/Api/Wechat/getMainData?shopId=' + app.globalData.shopId,//上线的话必须是https，没有appId的本地请求貌似不受影响  
      url: app.globalData.server + app.globalData.suffix + 'getMainData?shopId=' + app.globalData.shopId + '&deskId=' + app.globalData.deskId,//上线的话必须是https，没有appId的本地请求貌似不受影响 
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) { 
        app.globalData.shopInfo = res.data.data.shopInfo;
        app.globalData.deskInfo = res.data.data.deskInfo;
        page.setData({
          funcs: res.data.data.funcs,
          posts: res.data.data.posts
        });
        wx.setNavigationBarTitle({ title: app.globalData.shopInfo.shopName });
        wx.hideLoading();
      },

      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })

    // 生命周期函数--监听页面加载
    // wx.connectSocket({
    //   url: 'ws://'+ app.globalData.server +'8181',
    // })

    wx.connectSocket({
      url: config.wss,
    })

    //连接成功
    wx.onSocketOpen(function (data) {
      // data
      console.log(data);
    })

    wx.onSocketClose(function () {
      if (exitApp) {
        return;
      }
      wx.connectSocket({
        url: config.wss,
      })
    });

    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })

  },

  onTapCate: function (e) {
    var index = e.currentTarget.dataset.index;
    var url = '../' + this.data.funcs[index].funcField + '/' + this.data.funcs[index].funcField;
    exitApp = false;
    wx.navigateTo({
      url: url
    })
  },

  tapPost: function (e) {
    var postName = this.data.posts[e.target.dataset.id].postName;
    var postContent = this.data.posts[e.target.dataset.id].postDesc;
    app.globalData.postHtml = postContent;
    exitApp = false;
    wx.navigateTo({
      url: '../post/post?postName=' + postName
    })
  },

  onShow: function () {
    app.globalData.isClear = false;
    this.setData({
      ordersNum: app.globalData.totalOrderNums
    });
  },

  /*关闭socket通信*/
  onUnload: function () {
    exitApp = true;
    // wx.closeSocket();
  },

  onTapCall: function (e) {
    const page = this;
    $wuxDialog.prompt({
      title: '呼叫服务员',
      content: '您最多可以输入8个字符',
      fieldtype: 'text',
      defaultText: '',
      placeholder: '请输入您需要的服务',
      maxlength: 8,
      onConfirm(e) {
        const value = page.data.$wux.dialog.prompt.response;
        if (value == "") {
          $wuxDialog.alert({
            title: '提示',
            content: '您还未输入内容',
          })
          return;
        }
        wx.showLoading({
          title: '呼叫中',
        })
        var notice = {
          clientType: 0,
          noticeType: 0,
          shopId: app.globalData.shopId,
          deskId: app.globalData.deskId,
          deskNum: app.globalData.deskNum,
          noticeContent: value,
          noticeIsDealed: false
        };
        wx.sendSocketMessage({
          data: JSON.stringify(notice),
        });
        wx.onSocketMessage(function (data) {
          var result = JSON.parse(data.data);
          if (result.status == 0) {
            wx.hideLoading();
            $wuxToptips.success({
              hidden: !0,
              text: result.msg,
            })
          } else if (result.status == 1) {
            wx.hideLoading();
            $wuxToptips.show({
              timer: 3000,
              text: result.msg,
              success: () => console.log('toptips', error)
            })
          }
        })
      },
      onCancel(e) {
      },
    })
  },

  onTapOrder: function (e) {
    if (app.globalData.orders.length == 0) {
      $wuxToptips.show({
        timer: 2000,
        text: '您的订单为空',
        success: () => console.log('toptips', error)
      })
    } else {
      exitApp = false;
      wx.navigateTo({
        url: '../orders/orders'
      })
      app.globalData.isFromMenu = true;
    }
  },

})