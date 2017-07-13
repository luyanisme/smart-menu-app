var screen = require('../../utils/screenUtil.js');
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
      url: 'http://' + app.globalData.server + '8080/Api/Wechat/getMainData?shopId=1',//上线的话必须是https，没有appId的本地请求貌似不受影响  
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

  onTapCall: function (e) {
    this.setData({
      isShowHelperPanel: true
    });
    var notice = {
      deskNum: '11号桌',
      noticeContent: '正在呼叫服务员...',
      isDealed: false,
    };
    wx.sendSocketMessage({
      data: JSON.stringify(notice),
    })
  },

  onTapOrder: function (e) {

  },

  onTapHelperPanelShadow: function (e) {
    if (this.data.isShowHelperPanel) {
      this.setData({
        isShowHelperPanel: false
      });
    } else {
      this.setData({
        isShowHelperPanel: true
      });
    }
  },
})