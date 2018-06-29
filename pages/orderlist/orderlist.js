const app = getApp()
// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 'rent',
    book_records: [
    /*{
      id:"1",
      house_photo_src: '../../assets/decoration/1.jpg',
      house_name: '胡同民宿|四合院儿',
      nights: '3',
      price: '331'
    }*/],
    publish_records: [
    /*{
      id: "1",
      house_photo_src: '../../assets/decoration/3.jpg',
      house_name: '胡同民宿|四合院儿',
      info: '噢噢噢噢哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦',
      price: '331'
    }*/],
    hasOpenid: false,
    isAuth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
      hasOpenid: app.globalData.hasOpenid,
      isAuth: app.globalData.isAuth
    })

    var that = this
    var url = "https://windymen.mynatapp.cc/user/" + app.globalData.openid + "/"
    //console.log(app.globalData.openid)
    //console.log(url)
    wx.request({
      url: url,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        var book_records = res.data.user_order
        var publish_records = res.data.owner_rooms
        var i=0
        if (book_records.length>0) {
          that.getBookRecords(i, book_records)
        }
        //console.log(publish_records.length)
        var j=0
        if(publish_records.length>0) {
          that.getPublishRecords(j, publish_records)
        }

      }
    })

  },
  getPublishRecords: function (j, publish_records) {
    var that=this
    var url1 = publish_records[j]
    var s11 = url1.substr(0, 4)
    var s21 = url1.substr(4, url1.length)
    url1 = s11 + "s" + s21
  
    wx.request({
      url: url1,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {

        //console.log(res.data)
        var res_id1 = res.data.id
        var idt = "publish_records[" + j + "].id"
        var descrition1 = "publish_records[" + j + "].info"
        var price1 = "publish_records[" + j + "].price"
        var title1 = "publish_records[" + j + "].house_name"
        //console.log(res)

        var des1 = res.data.description
        var pri1 = res.data.price
        var ti1 = res.data.title
        that.setData({
          [idt]: res_id1,
          [descrition1]: des1,
          [price1]: pri1,
          [title1]: ti1
        })
        //console.log(id)
        wx.request({
          url: 'https://windymen.mynatapp.cc/getRoomPhoto/',
          data: {
            room_id: res_id1,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            var photo1 = "publish_records[" + j + "].house_photo_src"
            if (res.data.length > 0) {
              that.setData({
                [photo1]: res.data[0].photo
              })
            }
            j++
            if(j<publish_records.length) {
              that.getPublishRecords(j,publish_records)
            }
          }
        })
      }

    })
  },

  getBookRecords: function (i, book_records) {
    var that=this
  var url = book_records[i]
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

      //console.log(res.data)
      var id = "book_records[" + i + "].id"
      var data = "book_records[" + i + "].nights"
      //console.log(res)
      var id1 = res.data.id
      var des = res.data.arrivalData
      des = des.substr(0, 10)
      that.setData({
        [id]: id1,
        [data]: des,
      })

      //console.log(id)
      var urlRoom = res.data.room
      var ur1 = urlRoom.substr(0, 4)
      var ur2 = urlRoom.substr(4, urlRoom.length)
      urlRoom = ur1 + "s" + ur2
      var roomId

      wx.request({
        url: urlRoom,
        data: {
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          var title = "book_records[" + i + "].house_name"
          var price = "book_records[" + i + "].price"
          that.setData({
            [title]: res.data.title,
            [price]: res.data.price,
          })

          roomId = res.data.id

          wx.request({
            url: 'https://windymen.mynatapp.cc/getRoomPhoto/',
            data: {
              room_id: roomId,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              var photo = "book_records[" + i + "].house_photo_src"
              if (res.data.length > 0) {
                that.setData({
                  [photo]: res.data[0].photo
                })
              }

              i++
              if(i<book_records.length) {
                that.getBookRecords(i, book_records) 
              }

            }
          })
        }
      })
    }
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
  changeModeFromRent: function() {
      this.setData({
        mode : 'publish'
      })
  },
  changeModeFromPublish: function () {
    this.setData({
      mode: 'rent'
    }) 
  },
  returnToIndex : function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  navigateToPublishHouse: function () {
    wx.navigateTo({
      url: '../Publish/Publish'
    })
  },
  navigateToOrder: function (h) {
    wx.navigateTo({
      url: '../RentHouseInfo/RentHouseInfo?id=' + h.currentTarget.dataset.id,
    })
  },
  navigateToPublish: function (h) {
    wx.navigateTo({
      url: '../PublishHouseInfo/PublishHouseInfo?id=' + h.currentTarget.dataset.id,
    })
  }
})