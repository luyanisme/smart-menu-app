var app = getApp();
var screen = require('../../utils/screenUtil.js')
var row = 0;
var index = 0;
var totalOrders = [];//点单内容 
var totalPrice = 0;//点单总价
var isShowDetail = false;//是否展示订单详情
var originalPrice = 0;//初始价格，用来储存多规格case
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
        // tab切换    
        currentTab: 0,  
        winHeight: screen.getScreenSize().height - 40 - 50,
        orderTotalNum: app.globalData.totalOrderNums,
        totalPrice: totalPrice,
        isShowDetail: isShowDetail,
        banners: banners,
    },  
    swichNav: function (e) {  
        console.log(e);  
        var that = this;  
        if (this.data.currentTab === e.target.dataset.current) {  
            return false;  
        } else {  
            that.setData({  
                currentTab: e.target.dataset.current,  
            })  
        }  
    },  
    swiperChange: function (e) {  
        console.log(e);  
        this.setData({  
            currentTab: e.detail.current,  
        })  
    },  
    onLoad: function (options) {  
      totalOrders.splice(0, totalOrders.length);//清空数组
      app.globalData.totalOrderNums = 0;
      totalPrice = 0;
      var page = this;
      wx.request({
        url: 'http://' + app.globalData.server + '8080/Api/Wechat/getMenu?shopId=1',//上线的话必须是https，没有appId的本地请求貌似不受影响  
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        // header: {}, // 设置请求的 header  
        success: function (res) {
          if (res.data.statue == 0) {
            app.globalData.categories = res.data.data;
            app.globalData.categories[0].selected = true;
            page.setData({
              list: app.globalData.categories,
              category: app.globalData.categories[row],
              categories: app.globalData.categories,
            });
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
    /**********************店铺*************************/
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

  /**********************菜谱*************************/
    onUnload: function () {
      // wx.setStorage({
      // 	key: "data",
      // 	data: this.data
      // })
      app.globalData.orders = totalOrders;
    },

    onTapLeftItem: function (e) {
      var id = e.currentTarget.id,
        list = this.data.list;
      if (id == app.globalData.categories[row].caseTypeId) {
        return;
      }
      for (var i = 0, len = list.length; i < len; ++i) {
        if (list[i].caseTypeId == id) {
          list[i].selected = !list[i].selected;
          row = i;
        } else {
          list[i].selected = false;
        }
      }
      this.setData({
        list: list,
        category: list[row],
        scrollTop: 0
      });
    },

    tapBanner: function (e) {
      var name = this.data.banners[e.target.dataset.id].name;
      wx.showModal({
        title: '提示',
        content: '您点击了“' + name + '”活动链接，活动页面暂未完成！',
        showCancel: false
      });
    },

    onGoodsScroll: function (e) {
      // 	if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      // 		this.setData({
      // 			scrollDown: true,
      // 						});
      // 	} else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      // 		this.setData({
      // 			scrollDown: false,
      // 		});
      // 	}
    },

    onTapChoose: function (e) {
      index = e.target.dataset.index;
      var caseItem = this.data.list[row].cases[index];
      originalPrice = caseItem.casePrice;
      caseItem.row = row;
      caseItem.index = index;
      var ruleChoose = "";

      var orderCaseItem = this.ArrayFindId(totalOrders, caseItem);
      if (orderCaseItem != null) {
        var orderAllNum = caseItem.orderAllNum;
        caseItem = orderCaseItem;
        caseItem.orderAllNum = orderAllNum;
        for (var i = 0; i < caseItem.standards.length; i++) {
          for (var j = 0; j < caseItem.standards[i].length; j++) {
            if (caseItem.standards[i][j].isSelected) {
              ruleChoose += caseItem.standards[i][j].value + "+";
            }
          }
        }
      } else {
        caseItem.orderNum = 0;
        for (var i = 0; i < caseItem.standards.length; i++) {
          for (var j = 0; j < caseItem.standards[i].length; j++) {
            if (j == 0) {
              caseItem.standards[i][j].isSelected = true;
              ruleChoose += caseItem.standards[i][j].value + "+"
            } else {
              caseItem.standards[i][j].isSelected = false;
            }
          }
        }
      }

      ruleChoose = ruleChoose.slice(0, ruleChoose.length - 1);
      caseItem.properties = ruleChoose;
      if (this.data.isStandardTips) {
        this.setData({
          isStandardTips: false,
        });
      } else {
        this.setData({
          isStandardTips: true,
          caseItem: caseItem,
          ruleChoose: ruleChoose,
          orderNum: caseItem.orderNum
        });
      }
    },

    onTapChooseShadow: function (e) {
      if (this.data.isStandardTips) {
        this.data.list[row].cases[index] = this.data.caseItem;
        this.setData({
          isStandardTips: false
        });
      } else {
        this.setData({
          isStandardTips: true
        });
      }
    },

    onPreventTap: function (e) {

    },

    onStandTagTap: function (e) {
      var tagIndex = e.target.dataset.index;
      var tagRow = e.target.dataset.row;
      var ruleChoose = "";

      for (var i = 0; i < this.data.caseItem.standards[tagRow].length; i++) {
        this.data.caseItem.standards[tagRow][i].isSelected = false;
      }
      this.data.caseItem.standards[tagRow][tagIndex].isSelected = true;

      for (var i = 0; i < this.data.caseItem.standards.length; i++) {
        for (var j = 0; j < this.data.caseItem.standards[i].length; j++) {
          if (this.data.caseItem.standards[i][j].isSelected) {
            ruleChoose += this.data.caseItem.standards[i][j].value + "+";
            if (this.data.caseItem.standards[i][j].casePrice != null) {
              this.data.caseItem.casePrice = this.data.caseItem.standards[i][j].casePrice;
            }
          }
        }
      }
      ruleChoose = ruleChoose.slice(0, ruleChoose.length - 1);
      var caseItem = this.ArrayFindSameProperty(totalOrders, ruleChoose, this.data.caseItem.caseId);
      if (caseItem == null) {
        this.data.caseItem.orderNum = 0;
      } else {
        if (caseItem.caseId != this.data.caseItem.caseId) {
          this.data.caseItem.orderNum = 0;
        } else {
          this.data.caseItem.orderNum = caseItem.orderNum;
        }
      }
      this.setData({
        caseItem: this.data.caseItem,
        ruleChoose: ruleChoose,
        orderNum: this.data.caseItem.orderNum
      });

    },

    onAddToTipCart: function (e) {
      var num = 0;
      num = num + 1;
      var caseItem = this.data.caseItem;
      caseItem.orderNum = num;
      ++caseItem.orderAllNum;
      ++app.globalData.totalOrderNums;
      totalPrice += caseItem.casePrice;
      caseItem.properties = this.data.ruleChoose;
      totalOrders.push(JSON.parse(JSON.stringify(caseItem)));
      caseItem.casePrice = originalPrice;
      this.data.category.cases[index] = caseItem;
      this.setData({
        orderNum: caseItem.orderNum,
        category: this.data.category,
        orderTotalNum: app.globalData.totalOrderNums,
        totalPrice: totalPrice
      });
    },

    onAddCaseNumTip: function (e) {
      var caseItem = this.ArrayFindSameProperty(totalOrders, this.data.ruleChoose, this.data.caseItem.caseId);
      ++caseItem.orderNum;
      ++app.globalData.totalOrderNums;
      totalPrice += caseItem.casePrice;
      ++this.data.caseItem.orderAllNum;
      this.data.category.cases[index] = this.data.caseItem;
      this.setData({
        orderNum: caseItem.orderNum,
        category: this.data.category,
        orderTotalNum: app.globalData.totalOrderNums,
        totalPrice: totalPrice
      });
    },

    onRemoveCaseNumTip: function (e) {
      var caseItem = this.ArrayFindSameProperty(totalOrders, this.data.ruleChoose, this.data.caseItem.caseId);
      --caseItem.orderNum;
      --app.globalData.totalOrderNums;
      totalPrice -= caseItem.casePrice;
      --this.data.caseItem.orderAllNum;
      var ruleChoose = "";
      this.data.category.cases[index] = this.data.caseItem;

      if (caseItem.orderNum == 0) {
        this.ArrayRemove(totalOrders, caseItem);
        this.setData({
          orderNum: caseItem.orderNum,
          category: this.data.category,
          caseItem: this.data.caseItem,
          // ruleChoose: ruleChoose,
          orderTotalNum: app.globalData.totalOrderNums,
          totalPrice: totalPrice
        });
      } else {
        this.setData({
          orderNum: caseItem.orderNum,
          category: this.data.category,
          orderTotalNum: app.globalData.totalOrderNums,
          totalPrice: totalPrice
        });
      }

    },

    onAddCase: function (e) {
      index = e.target.dataset.index;
      var caseItem = this.data.list[row].cases[index];
      caseItem.row = row;
      caseItem.index = index;
      if (caseItem.orderNum == null) {
        caseItem.orderNum = 0;
      }
      ++caseItem.orderNum;
      ++app.globalData.totalOrderNums;
      totalPrice += caseItem.casePrice;
      if (this.ArrayContain(totalOrders, caseItem) == false) {
        totalOrders.push(JSON.parse(JSON.stringify(caseItem)));
      } else {
        this.ArrayFindId(totalOrders, caseItem).orderNum++;
      }

      this.setData({
        category: this.data.list[row],
        orderTotalNum: app.globalData.totalOrderNums,
        totalPrice: totalPrice
      });
    },

    onRemoveCase: function (e) {
      index = e.target.dataset.index;
      var caseItem = this.data.list[row].cases[index];
      --caseItem.orderNum;
      --app.globalData.totalOrderNums;
      totalPrice -= caseItem.casePrice;
      this.ArrayFindId(totalOrders, caseItem).orderNum--;
      if (caseItem.orderNum == 0) {
        this.ArrayRemove(totalOrders, caseItem);
      }

      this.setData({
        category: this.data.list[row],
        orderTotalNum: app.globalData.totalOrderNums,
        totalPrice: totalPrice
      });
    },

    onShowDetialOrders: function (e) {
      if (app.globalData.totalOrderNums == 0) {
        return;
      }
      if (isShowDetail) {
        isShowDetail = false;
        this.setData({
          isShowDetail: isShowDetail
        });
      } else {
        isShowDetail = true;
        this.setData({
          isShowDetail: isShowDetail,
          totalOrders: totalOrders
        });
      }

    },

    onAddCaseNumOrder: function (e) {
      var index = e.target.dataset.index;
      var orderCateItem = totalOrders[index];
      var cateItem = this.data.list[orderCateItem.row].cases[orderCateItem.index];
      if (cateItem.orderAllNum > 0) {
        ++cateItem.orderAllNum;
        ++orderCateItem.orderNum;
      } else {
        ++orderCateItem.orderNum;
        ++cateItem.orderNum;
      }

      ++app.globalData.totalOrderNums;
      totalPrice += orderCateItem.casePrice;
      this.setData({
        category: this.data.list[row],
        totalOrders: totalOrders,
        totalPrice: totalPrice,
        orderTotalNum: app.globalData.totalOrderNums
      });
    },

    onRemoveCaseNumOrder: function (e) {
      var index = e.target.dataset.index;
      var orderCateItem = totalOrders[index];
      var cateItem = this.data.list[orderCateItem.row].cases[orderCateItem.index];
      if (cateItem.orderAllNum > 0) {
        --cateItem.orderAllNum;
        --orderCateItem.orderNum;
        if (orderCateItem.orderNum == 0) {
          this.ArrayRemoveSameProperty(totalOrders, orderCateItem.properties);
        }
      } else {
        --cateItem.orderNum;
        --orderCateItem.orderNum;
        if (cateItem.orderNum == 0) {
          this.ArrayRemove(totalOrders, cateItem);
        }
      }

      app.globalData.totalOrderNums--;
      totalPrice -= orderCateItem.casePrice;
      if (app.globalData.totalOrderNums == 0) {
        isShowDetail = false;
        this.setData({
          category: this.data.list[row],
          isShowDetail: isShowDetail,
          orderTotalNum: app.globalData.totalOrderNums,
          totalPrice: totalPrice,
        });
        return;
      }
      this.setData({
        category: this.data.list[row],
        totalOrders: totalOrders,
        totalPrice: totalPrice,
        orderTotalNum: app.globalData.totalOrderNums
      });

    },

    onTapComplete: function (e) {
      app.globalData.orders = totalOrders;
      app.globalData.totalPrice = this.data.totalPrice;
      wx.navigateTo({
        url: '../waiting/waiting'
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

    ArrayContain: function (array, val) {
      var index = -1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].caseId == val.caseId) {
          index = i;
        }
      }

      if (index != -1) {
        return true;
      } else {
        return false;
      }
    },

    ArrayFindId: function (array, val) {
      var index = -1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].caseId == val.caseId) {
          index = i;
        }
      }

      if (index != -1) {
        return array[index];
      } else {
        return null;
      }
    },

    ArrayContainSameProperty: function (array, val) {
      var index = -1;
      for (var i = 0; i < array.length; i++) {

        if (array[i].properties == val) {
          index = i;
        }

      }

      if (index != -1) {
        return true;
      } else {
        return false;
      }
    },

    ArrayFindSameProperty: function (array, val, caseId) {
      var index = -1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].caseId == caseId) {
          if (array[i].properties == val) {
            index = i;
          }
        }
      }

      if (index != -1) {
        return array[index];
      } else {
        return null;
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
  
    onReady: function () {  
        // 生命周期函数--监听页面初次渲染完成  
    },  
    onShow: function () {  
        // 生命周期函数--监听页面显示  
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
    onShareAppMessage: function () {  
        // 用户点击右上角分享  
        return {  
            title: 'title', // 分享标题  
            desc: 'desc', // 分享描述  
            path: 'path' // 分享路径  
        }  
    }  
})  