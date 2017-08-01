// pay.js
import { $wuxToptips } from '../../components/wux'
var app = getApp();
var totalPrice = app.globalData.totalPrice;//点单总价
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
    this.setData({
      totalOrders: app.globalData.orders,
      totalPrice: app.globalData.totalPrice,
      totalOrderNums: app.globalData.totalOrderNums
    });
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

  onAddCaseNumOrder: function (e) {
    var index = e.target.dataset.index;
    var orderCateItem = app.globalData.orders[index];
    var cateItem = app.globalData.categories[orderCateItem.row].cases[orderCateItem.index];
    if (cateItem.orderAllNum > 0) {
      ++cateItem.orderAllNum;
      ++orderCateItem.orderNum;
    } else {
      ++orderCateItem.orderNum;
      ++cateItem.orderNum;
    }

    ++app.globalData.totalOrderNums;
    app.globalData.totalPrice += orderCateItem.casePrice;
    this.setData({
      totalOrders: app.globalData.orders,
      totalPrice: app.globalData.totalPrice,
    });
  },

  onRemoveCaseNumOrder: function (e) {
    var index = e.target.dataset.index;
    var orderCateItem = app.globalData.orders[index];
    var cateItem = app.globalData.categories[orderCateItem.row].cases[orderCateItem.index];
    if (cateItem.orderAllNum > 0) {
      --cateItem.orderAllNum;
      --orderCateItem.orderNum;
      if (orderCateItem.orderNum == 0) {
        this.ArrayRemoveSameProperty(app.globalData.orders, orderCateItem.properties);
      }
    } else {
      --cateItem.orderNum;
      --orderCateItem.orderNum;
      if (cateItem.orderNum == 0) {
        this.ArrayRemove(app.globalData.orders, cateItem);
      }
    }

    app.globalData.totalOrderNums--;
    app.globalData.totalPrice -= orderCateItem.casePrice;
    if (app.globalData.totalOrderNums == 0) {
      wx.navigateBack();
      return;
    }
    this.setData({
      totalOrders: app.globalData.orders,
      totalPrice: app.globalData.totalPrice,
    });
  },

  pay: function(e){
    wx.showLoading({
      title: '下单中',
    })
    /*订单*/
    var order = {
      clientType: 0,
      noticeType: 1,
      shopId: app.globalData.shopId,
      deskId: app.globalData.deskId,
      deskNum: '11号桌',
      orderPrice: app.globalData.totalPrice,
      orderContent: JSON.stringify(app.globalData.orders),
      noticeIsDealed: false,
      orderIsPayed:false,
      orderIsUsing:true
    };
    wx.sendSocketMessage({
      data: JSON.stringify(order),
    });
    wx.onSocketMessage(function (data) {
      var result = JSON.parse(data.data);
      if (result.statue == 0) {
        wx.hideLoading();
        app.reStore();
        $wuxToptips.success({
          hidden: !0,
          text: result.msg,
          success: () => wx.navigateBack(({
            delta: app.globalData.isFromMenu ? 1 : 2
          }))
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
  },

  ArrayRemove: function (array, val) {
    var index = -1;
    for (var i = 0; i < array.length; i++) {
      if (array[i].caseId == val.caseId) {
        index = i;
      }
    }

    if (index > -1) {
      array.splice(index, 1);
    }
  },
  ArrayRemoveSameProperty: function (array, val) {
    var index = -1;
    for (var i = 0; i < array.length; i++) {
      if (array[i].properties == val) {
        index = i;
      }
    }
    array.splice(index, 1);
  },
})