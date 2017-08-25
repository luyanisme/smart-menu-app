
var screen = require('../../utils/screenUtil.js');
import { $wuxDialog } from '../../components/wux'
import { $wuxToptips } from '../../components/wux'

var app = getApp();
var banners = [
  {
    id: 3,
    img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/index/banner_3.jpg',
    url: '',
    name: '百亿巨惠任你抢'
  },
  {
    id: 1,
    img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/index/banner_1.jpg',
    url: '',
    name: '告别午高峰'
  },
  {
    id: 2,
    img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/index/banner_2.jpg',
    url: '',
    name: '金牌好店'
  }
];

Page({

  data: {
    severIp: 'http://' + app.globalData.server + '8080/',
    winHeight: screen.getScreenSize().height,
  },

  onLoad: function () {
    var page = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://' + app.globalData.server + '8080/Api/Wechat/getMainData?shopId=' + app.globalData.shopId,//上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        // app.globalData.categories = res.data.data;
        page.setData({
          funcs: res.data.data.funcs,
          posts: res.data.data.posts
        });
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
    wx.connectSocket({
      url: "ws://localhost:8181",
    })

    //连接成功
    wx.onSocketOpen(function () {
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

  onTapCate: function (e) {
    var index = e.currentTarget.dataset.index;
    var url = '../' + this.data.funcs[index].funcField + '/' + this.data.funcs[index].funcField;
    wx.navigateTo({
      url: url
    })
  },

  tapPost: function (e) {
    var postName = this.data.posts[e.target.dataset.id].postName;
    var postContent = this.data.posts[e.target.dataset.id].postDesc;
    app.globalData.postHtml = postContent;
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
        if(value == ""){
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
          clientType:0,
          noticeType:0,
          shopId: app.globalData.shopId,
          deskId: app.globalData.deskId,
          deskNum: '11号桌',
          noticeContent: value,
          noticeIsDealed: false
        };
        wx.sendSocketMessage({
          data: JSON.stringify(notice),
        });
        wx.onSocketMessage(function (data) {
          var result = JSON.parse(data.data);
          if (result.statue == 0){
            wx.hideLoading();
            $wuxToptips.success({
              hidden: !0,
              text: result.msg,
            })
          } else if (result.statue == 1){
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
      wx.navigateTo({
        url: '../orders/orders'
      })
      app.globalData.isFromMenu = true;
    }
  },

})