//index.js
//获取应用实例
const app = getApp()
var locationR

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

var dateTools = require('../../tools/dateTools.js');

Page({
  data: {
    currentLocation: '位置', //初始化自动定位
    checkInDate: '',  //自动获取当天日期
    checkOutDate: '',  //自动获取当天日期
    startDate: ''  //
  },
  checkInDateChange: function(e) {
    this.setData({
      checkInDate: e.detail.value,
      checkOutDate: dateTools.dateToStr(dateTools.addDate(dateTools.strToDate(e.detail.value)))
    })
  },
  checkOutDateChange: function (e) {
    this.setData({
      checkOutDate: e.detail.value
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
  onLoad: function() {
    app.globalData.isFirstShow = false
    qqmapsdk = new QQMapWX({
      key: 'YK5BZ-KV7CG-JQFQM-IDNJR-HCUB7-HCB6V'
    });
  },

  onReady: function() {
    var that = this;
    /*获取坐标 */
    this.showGpsLoading();
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
          var city = res.result.address_component.city
          city = city.substr(0, length - 1)
          var str = "assssssss"
          str = str.substr(0, 2)
          that.setData({ currentLocation: (res.result.address_component.city[length - 1] == '市' ? city : res.result.address_component.city) });
          app.globalData.city = that.data.currentLocation;
          locationR = that.data.currentLocation
          app.globalData.isFirstShow = false
          that.getFirstHouse(that.data.currentLocation)
          //that.cancelGpsLoading();
        },
        fail: function (res) {
          console.log(res)
        }
      })
    })
    this.setData({
      startDate: dateTools.dateToStr(new Date()),
      checkInDate: dateTools.dateToStr(new Date()),
      checkOutDate: dateTools.dateToStr(dateTools.addDate(new Date()))
    })
  },

  getHousePhoto:function (hs,j,three,length) {
    var that=this
    var id=hs[j].id
      wx.request({
        url: 'https://windymen.mynatapp.cc/getRoomPhoto/',
        data: {
          room_id: id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          var parm1 = "houses[" + j + "].photo1"
          if (res.data.length > 0) {
            that.setData({
              [parm1]: res.data[0].photo
            })
            if (three < 3) {
              var ima = "imgUrls[" + three + "]"
              that.setData({
                [ima]: res.data[0].photo
              })
              three++
            }
          }
          else {
            that.setData({
              [parm1]: ""
            })
          }
          j = j + 1
          if(j<length) {
            that.getHousePhoto(hs,j,three,length)
          }
        }
      })
  },
  getUserPhoto:function(hs,k,length) {
    var url = hs[k].owner
    var s1 = url.substr(0, 4)
    var s2 = url.substr(4, url.length)
    url = s1 + "s" + s2
    var that=this
    wx.request({
      url: url,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        var parm = "houses[" + k + "].owner_src"
        that.setData({
          [parm]: res.data.photo
        })
        k = k + 1
        if(k<length) {
          that.getUserPhoto(hs, k, length)
        }
      }
    })

  },

  getFirstHouse:function(location) {
    console.log(location)
      var that = this
      wx.request({
        url: 'https://windymen.mynatapp.cc/searchRoomByCity/',
        data: {
          cityname: location,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            houses: res.data
          })
          var j = 0
          console.log(res)
          var hs = that.data.houses
          console.log(hs)
          if (hs.length > 0) {
            that.getHouseCityhPhoto(hs, j, 0,hs.length)
          }
        }

      })
  },

  onShow:function() {
    var location = app.globalData.city
    console.log(app.globalData.isFirstShow)
    if (app.globalData.isFirstShow) {
      var that = this
      wx.request({
        url: 'https://windymen.mynatapp.cc/searchRoomByCity/',
        data: {
          cityname: location,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            houses: res.data
          })
          var j = 0
          console.log(res)
          var hs = that.data.houses
          console.log(hs)
          if (hs.length > 0) {
            that.getHouseCityhPhoto(hs, j, 0,hs.length)
          }
        }

      })

    }
    app.globalData.isFirstShow=false
  },
  navigateToCitySelect: function() {
    wx.navigateTo({
      url: '../citySelect/citySelect?currentLocation=' + this.data.currentLocation,
    })
  },
  navigateToHouseInfo: function(h) {
    console.log(h.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../houseInfo/houseInfo?id=' + h.currentTarget.dataset.id,
    })
  },
  getHouseCityhPhoto: function (hs, j,three, length) {
    var that = this
    var id = hs[j].id

    wx.request({
      url: 'https://windymen.mynatapp.cc/getRoomPhoto/',
      data: {
        room_id: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        var parm1 = "houses[" + j + "].photo1"
        if (res.data.length > 0) {
          that.setData({
            [parm1]: res.data[0].photo
          })
          if (three < 3) {
            var ima = "imgUrls[" + three + "]"
            that.setData({
              [ima]: res.data[0].photo
            })
            three++
          }
        }
        else {
          that.setData({
            [parm1]: ""
          })
        }
      }
    })

    var url = 'https://windymen.mynatapp.cc/room/' + id + '/'
    wx.request({
      url: url,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        var ownerUrl = res.data.owner
        var s1 = ownerUrl.substr(0, 4)
        var s2 = ownerUrl.substr(4, ownerUrl.length)
        ownerUrl = s1 + "s" + s2
        wx.request({
          url: ownerUrl,
          data: {
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: function (res) {
            var parm = "houses[" + j + "].owner_src"
            that.setData({
              [parm]: res.data.photo
            })
            j = j + 1
            if (j < length) {
              that.getHouseCityhPhoto(hs, j,three, length)
            }
          }
        })

      }
    })

  },
  getHouseSearchPhoto: function (hs, j, length) {
    var that = this
    var id = hs[j].id

    wx.request({
      url: 'https://windymen.mynatapp.cc/getRoomPhoto/',
      data: {
        room_id: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        var parm1 = "houses[" + j + "].photo1"
        if (res.data.length > 0) {
          that.setData({
            [parm1]: res.data[0].photo
          })
        }
        else {
          that.setData({
            [parm1]: ""
          })
        }
      }
    })

    var url = 'https://windymen.mynatapp.cc/room/'+id+'/'
    wx.request({
      url: url,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        var ownerUrl=res.data.owner
        var s1 = ownerUrl.substr(0, 4)
        var s2 = ownerUrl.substr(4, ownerUrl.length)
        ownerUrl = s1 + "s" + s2
        wx.request({
          url: ownerUrl,
          data: {
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: function (res) {
            var parm = "houses[" + j + "].owner_src"
            that.setData({
              [parm]: res.data.photo
            })
            j = j + 1
            if (j < length) {
              that.getHouseSearchPhoto(hs, j, length)
            }
          }
        })

      }
    })

  },
  search: function () {
    var that = this
    var location = this.data.currentLocation
    console.log(location)
    var fromDate = this.data.checkInDate
    var toDate = this.data.checkOutDate
    var date_from_year = parseInt(fromDate.substr(0, 4))
    var date_from_month = parseInt(fromDate.substr(5, 7))
    var date_from_day = parseInt(fromDate.substr(8, 10))
    var date_to_year = parseInt(toDate.substr(0, 4))
    var date_to_month = parseInt(toDate.substr(5, 7))
    var date_to_day = parseInt(toDate.substr(8, 10))

    wx.request({
      url: 'https://windymen.mynatapp.cc/searchRoom/',
      data: {
        cityname: location,
        date_from_year: date_from_year,
        date_from_month: date_from_month,
        date_from_day: date_from_day,
        date_to_year: date_to_year,
        date_to_month: date_to_month,
        date_to_day: date_to_day
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          houses: res.data
        })
        var j = 0
        var hs = that.data.houses
        console.log(hs)
        if (hs.length > 0) {
          that.getHouseSearchPhoto(hs, j, hs.length)
        }
      }

    })

   
  }
})