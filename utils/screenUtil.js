function getScreenSize(){
var size = {};
  //获取屏幕宽高  
  wx.getSystemInfo({  
      success: function (res) {  
      size.width = res.windowWidth;  
      size.height = res.windowHeight;  
      }
  })  
  console.log(size.height);
  return size;
}

module.exports = {  
  getScreenSize: getScreenSize  
}  