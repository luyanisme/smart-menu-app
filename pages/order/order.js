var app = getApp();
var screen = require('../../utils/screenUtil.js')
var row = 0;
var index = 0;
var totalOrders = [];//点单内容
var totalOrderNums = 0;
var totalPrice = 0;//点单总价
var isShowDetail = false;//是否展示订单详情
var originalPrice = 0;//初始价格，用来储存多规格case
var categories = [{
	id: 1,
	name: '特色菜',
	selected: true,
	specials: [{
		id: 111,
		name: '红烧河豚',
		price: 123,
		img: 'hetun.jpg',
		orders: 1234,
		orderNum: 0,
		orderAllNum: 0,
		standards: [{
			id: 1,
			title: '规格',
			rules: [{
				id: 1,
				rule: '一条',
				price: 123
			}, {
				id: 2,
				rule: '二条',
				price: 246
			}]
		},
		{
			id: 2,
			title: '辣度',
			rules: [{
				id: 1,
				rule: '微微辣'
			}, {
				id: 2,
				rule: '微辣'
			}, {
				id: 3,
				rule: '中辣'
			}, {
				id: 4,
				rule: '超级辣'
			}, {
				id: 5,
				rule: '变态辣'
			}]
		}]
	},
	{
		id: 112,
		name: '清蒸鲈鱼',
		price: 85,
		img: 'luyu.jpg',
		orders: 1004,
		orderNum: 0,
		orderAllNum: 0,
		standards: []
	},
	{
		id: 113,
		name: '清蒸鸦片鱼',
		price: 90,
		img: 'yapianyu.jpg',
		orders: 998,
		orderNum: 0,
		orderAllNum: 0,
		standards: [{
			id: 1,
			title: '规格',
			rules: [{
				id: 1,
				rule: '一条',
				price: 90
			}, {
				id: 2,
				rule: '二条',
				price: 180
			}]
		},
		{
			id: 2,
			title: '辣度',
			rules: [{
				id: 1,
				rule: '微微辣'
			}, {
				id: 2,
				rule: '微辣'
			}, {
				id: 3,
				rule: '中辣'
			}, {
				id: 4,
				rule: '超级辣'
			}]
		}]
	},
	{
		id: 140,
		name: '清蒸刀鱼',
		price: 900,
		img: 'daoyu.jpg',
		orders: 1004,
		orderNum: 0,
		orderAllNum: 0,
		standards: []
	}]
},
{
	id: 2,
	name: '炒菜',
	specials: [{
		id: 114,
		name: '毛肚炒菜',
		price: 35,
		img: 'maodu.jpg',
		orders: 556,
		orderNum: 0,
		orderAllNum: 0,
		standards: []
	},
	{
		id: 115,
		name: '地三鲜',
		price: 25,
		img: 'disanxian.jpg',
		orders: 678,
		orderNum: 0,
		orderAllNum: 0,
		standards: []
	}]
},
{
	id: 3,
	name: '素菜',
	specials: [{
		id: 116,
		name: '芦蒿',
		price: 15,
		img: 'luhao.jpg',
		orders: 1002,
		orderNum: 0,
		orderAllNum: 0,
		standards: []
	}]
},
{
	id: 4,
	name: '煲汤',
	specials: [{
		id: 117,
		name: '瓦罐鸡',
		price: 85,
		img: 'waguanji.jpg',
		orders: 345,
		orderNum: 0,
		orderAllNum: 0,
		standards: []
	}]
}];

// var banners = [
// 			{
// 				id: 3,
// 				img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/index/banner_3.jpg',
// 				url: '',
// 				name: '百亿巨惠任你抢'
// 			},
// 			{
// 				id: 1,
// 				img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/index/banner_1.jpg',
// 				url: '',
// 				name: '告别午高峰'
// 			},
// 			{
// 				id: 2,
// 				img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/index/banner_2.jpg',
// 				url: '',
// 				name: '金牌好店'
// 			}
// 		];

Page({

	data: {
		list: categories,
		category: categories[row],
		// banners:banners,
		winHeight: screen.getScreenSize().height - 40 - 50,
		orderTotalNum: totalOrderNums,
		totalPrice: totalPrice,
		isShowDetail: isShowDetail
	},
	onLoad: function () {
		totalOrders.splice(0, totalOrders.length);//清空数组
		totalOrderNums = 0;
		totalPrice = 0;
		var page = this;
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
	},

	onTapLeftItem: function (e) {
		var id = e.currentTarget.id,
			list = this.data.list;
		if (id == categories[row].id) {
			return;
		}
		for (var i = 0, len = list.length; i < len; ++i) {
			if (list[i].id == id) {
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
		var caseItem = this.data.list[row].specials[index];
		originalPrice = caseItem.price;
		caseItem.row = row;
		caseItem.index = index;
		var ruleChoose = "";

		var orderCaseItem = this.ArrayFindId(totalOrders, caseItem);
		if (orderCaseItem != null) {
			var orderAllNum = caseItem.orderAllNum;
			caseItem = orderCaseItem;
			caseItem.orderAllNum = orderAllNum;
			for (var i = 0; i < caseItem.standards.length; i++) {
				for (var j = 0; j < caseItem.standards[i].rules.length; j++) {
					if (caseItem.standards[i].rules[j].isSelected) {
						ruleChoose += caseItem.standards[i].rules[j].rule + "+";
					}
				}
			}
		} else {
			caseItem.orderNum = 0;
			for (var i = 0; i < caseItem.standards.length; i++) {
				for (var j = 0; j < caseItem.standards[i].rules.length; j++) {
					if (j == 0) {
						caseItem.standards[i].rules[j].isSelected = true;
						ruleChoose += caseItem.standards[i].rules[j].rule + "+"
					} else {
						caseItem.standards[i].rules[j].isSelected = false;
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
			this.data.list[row].specials[index] = this.data.caseItem;
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

		for (var i = 0; i < this.data.caseItem.standards[tagRow].rules.length; i++) {
			this.data.caseItem.standards[tagRow].rules[i].isSelected = false;
		}
		this.data.caseItem.standards[tagRow].rules[tagIndex].isSelected = true;

		for (var i = 0; i < this.data.caseItem.standards.length; i++) {
			for (var j = 0; j < this.data.caseItem.standards[i].rules.length; j++) {
				if (this.data.caseItem.standards[i].rules[j].isSelected) {
					ruleChoose += this.data.caseItem.standards[i].rules[j].rule + "+";
					if (this.data.caseItem.standards[i].rules[j].price != null) {
						this.data.caseItem.price = this.data.caseItem.standards[i].rules[j].price;
					}
				}
			}
		}
		ruleChoose = ruleChoose.slice(0, ruleChoose.length - 1);
		var caseItem = this.ArrayFindSameProperty(totalOrders, ruleChoose, this.data.caseItem.id);
		if (caseItem == null) {
			this.data.caseItem.orderNum = 0;
		} else {
			if (caseItem.id != this.data.caseItem.id) {
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
		++totalOrderNums;
		totalPrice += caseItem.price;
		caseItem.properties = this.data.ruleChoose;
		totalOrders.push(JSON.parse(JSON.stringify(caseItem)));
		caseItem.price = originalPrice;
		this.data.category.specials[index] = caseItem;
		this.setData({
			orderNum: caseItem.orderNum,
			category: this.data.category,
			orderTotalNum: totalOrderNums,
			totalPrice: totalPrice
		});
	},

	onAddCaseNumTip: function (e) {
		var caseItem = this.ArrayFindSameProperty(totalOrders, this.data.ruleChoose, this.data.caseItem.id);
		++caseItem.orderNum;
		++totalOrderNums;
		totalPrice += caseItem.price;
		++this.data.caseItem.orderAllNum;
		this.data.category.specials[index] = this.data.caseItem;
		this.setData({
			orderNum: caseItem.orderNum,
			category: this.data.category,
			orderTotalNum: totalOrderNums,
			totalPrice: totalPrice
		});
	},

	onRemoveCaseNumTip: function (e) {
		var caseItem = this.ArrayFindSameProperty(totalOrders, this.data.ruleChoose, this.data.caseItem.id);
		--caseItem.orderNum;
		--totalOrderNums;
		totalPrice -= caseItem.price;
		--this.data.caseItem.orderAllNum;
		var ruleChoose = "";
		this.data.category.specials[index] = this.data.caseItem;

		if (caseItem.orderNum == 0) {
			this.ArrayRemove(totalOrders, caseItem);
			this.setData({
				orderNum: caseItem.orderNum,
				category: this.data.category,
				caseItem: this.data.caseItem,
				// ruleChoose: ruleChoose,
				orderTotalNum: totalOrderNums,
				totalPrice: totalPrice
			});
		} else {
			this.setData({
				orderNum: caseItem.orderNum,
				category: this.data.category,
				orderTotalNum: totalOrderNums,
				totalPrice: totalPrice
			});
		}

	},

	onAddCase: function (e) {
		index = e.target.dataset.index;
		var caseItem = this.data.list[row].specials[index];
		caseItem.row = row;
		caseItem.index = index;
		if (caseItem.orderNum == null) {
			caseItem.orderNum = 0;
		}
		++caseItem.orderNum;
		++totalOrderNums;
		totalPrice += caseItem.price;
		if (this.ArrayContain(totalOrders, caseItem) == false) {
			totalOrders.push(JSON.parse(JSON.stringify(caseItem)));
		} else {
			this.ArrayFindId(totalOrders, caseItem).orderNum++;
		}

		this.setData({
			category: this.data.list[row],
			orderTotalNum: totalOrderNums,
			totalPrice: totalPrice
		});
	},

	onRemoveCase: function (e) {
		index = e.target.dataset.index;
		var caseItem = this.data.list[row].specials[index];
		--caseItem.orderNum;
		--totalOrderNums;
		totalPrice -= caseItem.price;
		this.ArrayFindId(totalOrders, caseItem).orderNum--;
		if (caseItem.orderNum == 0) {
			this.ArrayRemove(totalOrders, caseItem);
		}

		this.setData({
			category: this.data.list[row],
			orderTotalNum: totalOrderNums,
			totalPrice: totalPrice
		});
	},

	onShowDetialOrders: function (e) {
		if (totalOrderNums == 0) {
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
		var cateItem = this.data.list[orderCateItem.row].specials[orderCateItem.index];
		if (cateItem.orderAllNum > 0) {
			++cateItem.orderAllNum;
			++orderCateItem.orderNum;
		} else {
			++orderCateItem.orderNum;
			++cateItem.orderNum;
		}

		++totalOrderNums;
		totalPrice += orderCateItem.price;
		this.setData({
			category: this.data.list[row],
			totalOrders: totalOrders,
			totalPrice: totalPrice,
			orderTotalNum: totalOrderNums
		});
	},

	onRemoveCaseNumOrder: function (e) {
		var index = e.target.dataset.index;
		var orderCateItem = totalOrders[index];
		var cateItem = this.data.list[orderCateItem.row].specials[orderCateItem.index];
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

		totalOrderNums--;
		totalPrice -= orderCateItem.price;
		if (totalOrderNums == 0) {
			isShowDetail = false;
			this.setData({
				category: this.data.list[row],
				isShowDetail: isShowDetail,
				orderTotalNum: totalOrderNums,
				totalPrice: totalPrice,
			});
			return;
		}
		this.setData({
			category: this.data.list[row],
			totalOrders: totalOrders,
			totalPrice: totalPrice,
			orderTotalNum: totalOrderNums
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
			if (array[i].id == val.id) {
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
			if (array[i].id == val.id) {
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
			if (array[i].id == val.id) {
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

	ArrayFindSameProperty: function (array, val, id) {
		var index = -1;
		for (var i = 0; i < array.length; i++) {
			if (array[i].id == id) {
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

	onShow: function () {
    console.log('1231');
  },

})