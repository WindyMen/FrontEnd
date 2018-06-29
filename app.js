//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.globalData.isAuth = true;
          wx.showToast({
            title: '正在登陆',
            icon: 'loading'
          })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              //获取openid
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  wx.request({
                    url: 'https://windymen.mynatapp.cc/session/',
                    data: {
                      code: res.code,
                      nickName: that.globalData.userInfo.nickName,
                      photo: that.globalData.userInfo.avatarUrl
                    },
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      "Access-Control-Allow-Origin": "*",
                    },
                    method: 'POST',
                    success: function (res) {
                      that.globalData.openid = JSON.parse(res.data.result).openid;
                      that.globalData.hasOpenid = true;
                      wx.hideToast();
                    }
                  })
                }
              })
            }
          })
        }
      }
    })    
  },
  globalData: {
    userInfo: null,
    city: '',
    isFirstPublish: true,
    publishItem: {
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
    openid: '',
    isFirstShow:true,
    hasOpenid: false,
    isAuth: false,
    isFirstTimeProfile: true
  }
})