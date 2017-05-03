var app = getApp();
var screen = require('../../utils/screenUtil.js');

Page({

    onLoad: function (options) {
        console.log(options);
        wx.setNavigationBarTitle({ title: app.globalData.categories[options.index].caseTypeName });
        this.setData({
            winHeight: screen.getScreenSize().height,
            cases: app.globalData.categories[options.index].cases,
        });
    }
})