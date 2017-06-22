//app.js
var categories = [{
	id: 1,
	name: '特色菜',
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

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    orders: [],
    totalPrice: 0,
    categories:[],
		server:'127.0.0.1:'
  }
})