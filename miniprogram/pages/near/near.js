// pages/near/near.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '', //经度
    latitude: '', //纬度
    markers: []
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          latitude,
          longitude
        });
        this.getNearUsers();
      }
    })
  },
  getNearUsers() {
    db.collection('Users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000
      }),
      isLocation: true
    }).field({
      longitude: true,
      latitude: true,
      Userimg: true
    }).get().then((res) => {
      let data = res.data;
      let result = [];
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Userimg.includes('cloud://')) {
            wx.cloud.getTempFileURL({
              fileList: [data[i].Userimg],
              success: res => {
                result.push({
                  iconPath: res.fileList[0].tempFileURL,
                  id: data[i]._id,
                  longitude: data[i].longitude,
                  latitude: data[i].latitude,
                  width: 30,
                  height: 30
                });
                this.setData({
                  markers: result
                })
              }
            })
          } else {
            result.push({
              iconPath: data[i].Userimg,
              id: data[i]._id,
              longitude: data[i].longitude,
              latitude: data[i].latitude,
              width: 30,
              height: 30
            });
          }
        }
        this.setData({
          markers: result
        })

      }
    });
  },
  markertap(ev){
    wx.navigateTo({
      url: '/pages/detail/detail?userId='+ev.markerId,
    })
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
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation();
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

  }
})