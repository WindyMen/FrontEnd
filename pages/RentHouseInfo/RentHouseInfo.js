
const app = getApp()
var ownerUrl
var roomUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var id = options.id
    var orderUrl = 'https://windymen.mynatapp.cc/order/'+id+'/'
 
    wx.request({
      url: orderUrl,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        roomUrl=res.data.room
        console.log(roomUrl)
        ownerUrl=res.data.user

        var r1 = roomUrl.substr(0, 4)
        var r2 = roomUrl.substr(4, roomUrl.length)
        roomUrl = r1 + "s" + r2


        var o1 = ownerUrl.substr(0, 4)
        var o2 = ownerUrl.substr(4, ownerUrl.length)
        ownerUrl = o1 + "s" + o2
        wx.request({
          url: ownerUrl,
          data: {
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: function (res) {
            that.setData({
              house_renter_name: res.data.nickname,
              house_renter_photo: res.data.photo
            })
          }
        })
        wx.request({
          url: roomUrl,
          data: {
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: function (res) {
            //console.log(res.data)
            var home = res.data
            //console.log(home)
            var start_time = home.startTime
            start_time = start_time.substr(0, 10)
            var end_time = home.endTime
            end_time = end_time.substr(0, 10)


            that.setData({
              house_name: home.title,
              house_city: home.city,
              house_address: home.specificAddress,

              house_info: home.description,
              house_start_date: start_time,
              house_end_date: end_time,
              house_price: home.price
            })
            var roomid = home.id
            wx.request({
              url: 'https://windymen.mynatapp.cc/getRoomPhoto/',
              data: {
                room_id: roomid,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {

                var num = res.data.length
                if (num >= 3) {
                  num = 3
                }
                for (var flag = 0; flag < num; flag++) {
                  var hP = "house_pics[" + flag + "]"
                  var data = res.data[flag].photo
                  that.setData({
                    [hP]: data
                  })
                }
                if (num == 0) {
                  hP = "house_pics[" + 0 + "]"
                  that.setData({
                    [hP]: ""
                  })
                }

              }
            })


            var url = home.owner
            var s1 = url.substr(0, 4)
            var s2 = url.substr(4, url.length)
            url = s1 + "s" + s2
            wx.request({
              url: url,
              data: {
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'GET',
              success: function (res) {
                that.setData({
                  house_owner_photo: res.data.photo,
                  house_owner_name: res.data.nickname
                })
              }
            })
          }
        })
      }
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
  previewPic: function (e) {
    /*暂时用不了，因为需要绝对路径 */
    wx.previewImage({
      current: this.data.house_pics[e.currentTarget.dataset.index],
      urls: this.data.house_pics
    })
  }
})