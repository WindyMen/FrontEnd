// pages/s.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openid: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    /*这些都需要ajax获取，因此每次进入这个页面就发出请求，所以从修改页面回来不用传值*/
    phone: '',
    email: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
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
    
    var that = this;
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
      if (app.globalData.hasOpenid) {
        if (app.globalData.isFirstTimeProfile) {
          that.getPhoneAndEmail();
          app.globalData.isFirstTimeProfile = false;
        }
      }
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
  getUserInfo: function (e) {
    //console.log(e)
    var that = this;
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //获取openid
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://windymen.mynatapp.cc/session/',
          data: {
            code: res.code,
            nickName: app.globalData.userInfo.nickName,
            photo: app.globalData.userInfo.avatarUrl
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*",
          },
          method: 'POST',
          success: function (res) {
            app.globalData.openid = JSON.parse(res.data.result).openid;
            app.globalData.hasOpenid = true;
            app.globalData.isAuth = true;
            console.log(app.globalData.openid);
            that.getPhoneAndEmail();
            app.globalData.isFirstTimeProfile = false;
          }
        })
      }
    })
    //this.login();
  },
  navigateToOrderlist: function() {
    wx.switchTab({
      url: '../orderlist/orderlist',
    })
  },
  navigateToPublishHouse: function() {
    wx.navigateTo({
      url: '../Publish/Publish'
    })
  },
  navigateToInfoModify: function() {
    wx.navigateTo({
      url: '../infoModify/infoModify?phone=' + this.data.phone + '&email=' + this.data.email,
    })
  },
  getPhoneAndEmail: function() {
    var that = this;
    wx.request({
      url: 'https://windymen.mynatapp.cc/user/' + app.globalData.openid + '/',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          phone: res.data.phone,
          email: res.data.email
        })
       // that.hideToast();
      }
    })
  }/*,
  showToast: function() {
    wx.showToast({
      title: '正在获取用户信息',
      icon: 'loading'
    })
  },
  hideToast: function() {
    wx.hideToast();
  }*/

})