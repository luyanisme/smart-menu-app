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
        banners: banners,
        winHeight: screen.getScreenSize().height
    },

    onLoad: function () {
        var page = this;
        wx.request({
            url: 'http://localhost:8080/getMenu',//上线的话必须是https，没有appId的本地请求貌似不受影响  
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
            // header: {}, // 设置请求的 header  
            success: function (res) {
                app.globalData.categories = res.data;
                page.setData({
                    categories: app.globalData.categories,
                });
            },
            fail: function () {
                // fail  
            },
            complete: function () {
                // complete  
            }
        })
    },
    onTapCate: function (e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../case/case?index=' + index
        })
    },

    tapBanner: function (e) {
        var name = this.data.banners[e.target.dataset.id].name;
        wx.showModal({
            title: '提示',
            content: '您点击了“' + name + '”活动链接，活动页面暂未完成！',
            showCancel: false
        });
    },
})