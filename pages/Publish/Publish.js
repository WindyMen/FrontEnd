const app = getApp()
var dateTools = require('../../tools/dateTools.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentLocation: '',
    house_name: '',
    house_info: '',
    house_address: '',
    house_city: '',
    house_price: '',
    BeginDate: '',
    EndDate: '',
    house_pics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   
    /*第一次加载用首页的城市、真实时间*/
    if (app.globalData.isFirstPublish) {
      this.setData({
        currentLocation: app.globalData.city,
        BeginDate: dateTools.dateToStr(new Date()),
        EndDate: dateTools.dateToStr(dateTools.addDate(new Date()))
      })
      app.globalData.isFirstPublish = false;
    }
    else {
      this.setData({
        house_name: app.globalData.publishItem.house_name,
        house_info: app.globalData.publishItem.house_info,
        house_city: app.globalData.publishItem.house_city,
        house_price: app.globalData.publishItem.house_price,
        house_address: app.globalData.publishItem.house_address,
        BeginDate: app.globalData.publishItem.BeginDate,
        EndDate: app.globalData.publishItem.EndDate,
        house_pics: app.globalData.publishItem.house_pics,
        currentLocation: app.globalData.publishItem.house_city /*一举两得，使citySelect页面可以有值，onshow那里也不用判断是否为空 */
      })
    }
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
    this.setData({
      house_city: this.data.currentLocation
    })
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
    app.globalData.publishItem.house_name = this.data.house_name;
    app.globalData.publishItem.house_info = this.data.house_info;
    app.globalData.publishItem.house_address = this.data.house_address;
    app.globalData.publishItem.house_price = this.data.house_price;
    app.globalData.publishItem.house_city = this.data.house_city;
    app.globalData.publishItem.BeginDate = this.data.BeginDate;
    app.globalData.publishItem.EndDate = this.data.EndDate;
    app.globalData.publishItem.house_pics = this.data.house_pics;
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
  navigateToCitySelect: function () {
    wx.navigateTo({
      url: '../citySelect/citySelect?currentLocation=' + this.data.currentLocation,
    })
  },
  BeginDateChange: function (e) {
    this.setData({
      BeginDate: e.detail.value,
      EndDate: dateTools.dateToStr(dateTools.addDate(dateTools.strToDate(e.detail.value)))
    })
  },
  EndDateChange: function (e) {
    this.setData({
      EndDate: e.detail.value
    })
    app.globalData.EndDate = this.data.EndDate;
  },
  houseNameChange: function(e) {
    this.setData({
      house_name: e.detail.value
    })
  },
  houseInfoChange: function (e) {
    this.setData({
      house_info: e.detail.value
    })
  },
  houseAddressChange: function (e) {
    this.setData({
      house_address: e.detail.value
    })
  },
  housePriceChange: function (e) {
    this.setData({
      house_price: e.detail.value
    })
  },
  addPics: function() {
    var that = this
    wx.chooseImage({
      count: 9 - this.data.house_pics.length,
      success: function(res) {
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          that.data.house_pics.push(res.tempFilePaths[i]);
        }
        that.setData({
          house_pics: that.data.house_pics    
        })    
      }
    })
  },
  previewPic: function(e) {
    wx.previewImage({
      current: this.data.house_pics[e.currentTarget.dataset.index],
      urls: this.data.house_pics
    })
  },
  publish: function() {
    var that = this;
    var start = that.data.BeginDate
    start += "T00:00:00Z"
    var end = that.data.EndDate
    end += "T00:00:00Z"
    wx.request({
      url: "https://windymen.mynatapp.cc/room/",
      data: {
        owner: app.globalData.openid,
        price: parseFloat(that.data.house_price),
        description: that.data.house_info,
        startTime: start,
        endTime: end,
        city: that.data.house_city,
        specificAddress: that.data.house_address,
        title: that.data.house_name,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        var id = res.data.id
         var tempFilePaths = that.data.house_pics
         var num = tempFilePaths.length
         for(var i=0;i<num;i++) {
           var path = tempFilePaths[i]
           wx.uploadFile({
             url: "https://windymen.mynatapp.cc/saveRoomPhoto/",
             filePath: path,
             name: 'file',
             formData: {
               room_id: id

             },
             success: function (res) {
               //do something
             }
           })
         }
         app.globalData.isFirstShow =true
        wx.showToast({
          title: '成功',
          icon: 'succes',
          duration: 600,
          mask: true
        }),
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 600) 
      },
    })
  }
})