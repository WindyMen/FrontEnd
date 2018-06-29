
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

//先引用城市数据文件
var city = require('../../utils/city.js')
var lineHeight = 0;
var endWords = "";
var isNum;
Page({
  data: {
    "hidden": true,
    cityName: "", //获取选中的城市名
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({cityName: options.currentLocation});
    qqmapsdk = new QQMapWX({
      key: 'YK5BZ-KV7CG-JQFQM-IDNJR-HCUB7-HCB6V'
    });
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var cityChild = city.City[0];
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        lineHeight = (res.windowHeight - 100) / 22;
        console.log(res.windowHeight - 100)
        that.setData({
          city: cityChild,
          winHeight: res.windowHeight - 40,
          lineHeight: lineHeight
        })
      }
    })
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
  //触发全部开始选择
  chStart: function () {
    this.setData({
      trans: ".3",
      hidden: false
    })
  },
  //触发结束选择
  chEnd: function () {
    this.setData({
      trans: "0",
      hidden: true,
      scrollTopId: this.endWords
    })
  },
  //获取文字信息
  getWords: function (e) {
    var id = e.target.id;
    this.endWords = id;
    isNum = id;
    this.setData({
      showwords: this.endWords
    })
  },
  //设置文字信息
  setWords: function (e) {
    var id = e.target.id;
    this.setData({
      scrollTopId: id
    })
  },
  // 滑动选择城市
  chMove: function (e) {
    var y = e.touches[0].clientY;
    var offsettop = e.currentTarget.offsetTop;
    var height = 0;
    var that = this;
    ;
    var cityarr = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"]
    // 获取y轴最大值
    wx.getSystemInfo({
      success: function (res) {
        height = res.windowHeight - 10;
      }
    });
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop && y < height) {
      // console.log((y-offsettop)/lineHeight)
      var num = parseInt((y - offsettop) / lineHeight);
      endWords = cityarr[num];
      // 这里 把endWords 绑定到this 上，是为了手指离开事件获取值
      that.endWords = endWords;
    };
    //去除重复，为了防止每次移动都赋值 ,这里限制值有变化后才会有赋值操作，
    //DOTO 这里暂时还有问题，还是比较卡，待优化
    if (isNum != num) {
      // console.log(isNum);
      isNum = num;
      that.setData({
        showwords: that.endWords
      })
    }
  },
  //选择城市，并让选中的值显示在文本框里
  bindCity: function (e) {
    console.log(e);
    var cityName = e.currentTarget.dataset.city;
    this.setData({ cityName: cityName })
  },
  navigateBack: function() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      currentLocation: this.data.cityName
    })
    wx.navigateBack({
      delta: 1
    })
  },
  showGpsLoading: function () {
    wx.showToast({
      title: '定位中',
      icon: 'loading'
    })
  },
  cancelGpsLoading: function () {
    wx.hideToast()
  },
  cxgps: function() {
    /*用that来使promise能访问到Page对象*/
    var that = this;
    this.showGpsLoading();
    /*获取坐标 */
    new Promise(function (resolve) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      });
    }).then(function (location) {
      /*通过坐标逆地址解析*/
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        success: function (res) {
          //为了与citySelect的名称对应
          var length = res.result.address_component.city.length;
          that.setData({ cityName: (res.result.address_component.city[length - 1] == '市' ? res.result.address_component.city.substr(0, length - 1) : res.result.address_component.city) });
          that.cancelGpsLoading();
        },
        fail: function (res) {
          /*错误提示后期再加*/
          console.log(res)
        }
      })
    })
  }
})