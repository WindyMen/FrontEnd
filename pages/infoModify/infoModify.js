const app = getApp()

// pages/infoModify/infoModify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    email: '',
    ifPhoneTextChosen: false,
    ifEmailTextChosen: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      email: options.email
    })
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
  updateProfile : function() {
    var that = this;
    wx.showToast({
      title: '正在修改...',
      icon: 'loading'
    })
    wx.request({
      url: 'https://windymen.mynatapp.cc/user/' + app.globalData.openid +  '/',
      data: {
        openid: app.globalData.openid,
        phone: that.data.phone,
        email: that.data.email
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      success: function() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          phone: that.data.phone,
          email: that.data.email
        })
        wx.hideToast()
        wx.navigateBack({
          delta: 1
        })
        
      }
    })

    
  },
  focusPhone:function() {
    this.setData({
      ifPhoneTextChosen : true
    })
  },
  blurPhone: function () {
    this.setData({
      ifPhoneTextChosen: false
    })
  },
  focusEmail: function(){
    this.setData({
      ifEmailTextChosen: true
    })
  },
  blurEmail: function () {
    this.setData({
      ifEmailTextChosen: false
    })
  },
  phoneChange: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  emailChange: function (e) {
    this.setData({
      email: e.detail.value
    })
  }
})