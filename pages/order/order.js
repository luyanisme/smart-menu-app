var app = getApp();
var screen = require('../../utils/screenUtil.js')
var row = 0;
var index = 0;
var totalOrders = [];//点单内容 
var totalPrice = 0;//点单总价
var isShowDetail = false;//是否展示订单详情
var originalPrice = 0;//初始价格，用来储存多规格case
import { $wuxToptips } from '../../components/wux'

Page({

  data: {
    severIp: 'http://' + app.globalData.server + '8080/',
    winHeight: screen.getScreenSize().height - 50,
    orderTotalNum: app.globalData.totalOrderNums,
    totalPrice: app.globalData.totalPrice,
    isShowDetail: isShowDetail,
    isNothing:true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: 'XX餐厅' });
    if (app.globalData.isLoaded == true) {
      this.setData({
        specialCaseId: options.caseId
      });
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    totalOrders.splice(0, totalOrders.length);//清空数组
    app.globalData.totalOrderNums = 0;
    totalPrice = 0;
    var page = this;
    wx.request({
      url: 'http://' + app.globalData.server + '8080/Api/Wechat/getMenu?shopId=' + app.globalData.shopId,//上线的话必须是https，没有appId的本地请求貌似不受影响  
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
            specialCaseId: options.caseId,
          });
          app.globalData.isLoaded = true;
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
    // wx.getStorage({
    // 	key: 'data',
    // 	success: function (res) {
    // 		console.log(res.data)
    // 		page.setData({
    // 			list: res.data.list,
    // 			category: res.data.list[row],
    // 			orderTotalNum: res.data.orderTotalNum,
    // 			totalPrice: res.data.totalPrice,
    // 			isShowDetail: res.data.isShowDetail
    // 		});
    // 	}
    // })

    // wx.request({
    // 	url: 'http://localhost:8080/getMenu',//上线的话必须是https，没有appId的本地请求貌似不受影响  
    // 	data: {},
    // 	method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // 	// header: {}, // 设置请求的 header  
    // 	success: function (res) {
    // 		console.log(res.data)
    // 		page.setData({
    // 			list: res.data,
    // 			category: res.data[row],

    // 		});
    // 	},
    // 	fail: function () {
    // 		// fail  
    // 	},
    // 	complete: function () {
    // 		// complete  
    // 	}
    // })
  },
  onUnload: function () {
    // wx.setStorage({
    // 	key: "data",
    // 	data: this.data
    // })
    app.globalData.orders = totalOrders;
    app.globalData.totalPrice = totalPrice;
    app.globalData.selectRow = row;
  },

  onReady: function () {
    // this.setData({
    //   list: app.globalData.categories,
    //   category: app.globalData.categories[0],
    //   totalOrders: app.globalData.totalOrders,
    //   totalPrice: app.globalData.totalPrice,
    //   orderTotalNum: app.globalData.totalOrderNums
    // });
  },

  onShow: function () {
      this.setData({
        isNothing: (app.globalData.totalOrderNums == 0 ? true : false)
      });
    
    totalPrice = app.globalData.totalPrice;
    this.setData({
      list: app.globalData.categories,
      category: app.globalData.categories[app.globalData.selectRow],
      totalOrders: app.globalData.totalOrders,
      totalPrice: app.globalData.totalPrice,
      orderTotalNum: app.globalData.totalOrderNums
    });
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
        animation: animation.export(),
      })
    }.bind(this), 800);
  },

  onTapLeftItem: function (e) {
    var id = e.currentTarget.id,
      list = app.globalData.categories;
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
    this.RebackAnimation();
    index = e.target.dataset.index;
    var caseItem = app.globalData.categories[row].cases[index];
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
      app.globalData.categories[row].cases[index] = this.data.caseItem;
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
      totalPrice: totalPrice,
      isNothing: false
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

    if (app.globalData.totalOrderNums == 0) {
      this.setData({
        isNothing: true
      });
    }

  },

  onAddCase: function (e) {
    this.RebackAnimation();
    index = e.target.dataset.index;
    var caseItem = app.globalData.categories[row].cases[index];
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
      category: app.globalData.categories[row],
      orderTotalNum: app.globalData.totalOrderNums,
      totalPrice: totalPrice,
      isNothing: false
    });
  },

  onRemoveCase: function (e) {
    index = e.target.dataset.index;
    var caseItem = app.globalData.categories[row].cases[index];
    --caseItem.orderNum;
    --app.globalData.totalOrderNums;
    totalPrice -= caseItem.casePrice;
    this.ArrayFindId(totalOrders, caseItem).orderNum--;
    if (caseItem.orderNum == 0) {
      this.ArrayRemove(totalOrders, caseItem);
    }

    this.setData({
      category: app.globalData.categories[row],
      orderTotalNum: app.globalData.totalOrderNums,
      totalPrice: totalPrice
    });
    if (app.globalData.totalOrderNums == 0){
      this.setData({
        isNothing: true
      });
    }
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
    var cateItem = app.globalData.categories[orderCateItem.row].cases[orderCateItem.index];
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
      category: app.globalData.categories[row],
      totalOrders: totalOrders,
      totalPrice: totalPrice,
      orderTotalNum: app.globalData.totalOrderNums,
    });
  },

  onRemoveCaseNumOrder: function (e) {
    var index = e.target.dataset.index;
    var orderCateItem = totalOrders[index];
    var cateItem = app.globalData.categories[orderCateItem.row].cases[orderCateItem.index];
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
        category: app.globalData.categories[row],
        isShowDetail: isShowDetail,
        orderTotalNum: app.globalData.totalOrderNums,
        totalPrice: totalPrice,
      });
      return;
    }
    this.setData({
      category: app.globalData.categories[row],
      totalOrders: totalOrders,
      totalPrice: totalPrice,
      orderTotalNum: app.globalData.totalOrderNums
    });

    if (app.globalData.totalOrderNums == 0) {
      this.setData({
        isNothing: true
      });
    }
  },

  onTapComplete: function (e) {
    app.globalData.orders = totalOrders;
    app.globalData.totalPrice = this.data.totalPrice;
    app.globalData.selectRow = row;
    if (app.globalData.orders.length == 0){
      $wuxToptips.show({
        timer: 2000,
        text: '您还未选择任何商品',
        success: () => console.log('toptips', error)
      })
    } else{
      wx.navigateTo({
        url: '../pay/pay'
      })
    }
  },

  RebackAnimation: function () {
    //  移除定时器 
    this.timer && clearInterval(this.timer);
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "ease",
    })
    animation.opacity(1).step();
    this.setData({
      animation: animation.export()
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

})