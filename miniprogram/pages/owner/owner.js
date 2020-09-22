// pages/owner/owner.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ownerPhoto: "../../images/weidenglu.png",
    nickName: '小明',
    logged: false,
    disabled: 'true',
    id: ''
  },

  bindGetUserInfo(ev) { //点击登录
    // console.log(ev)
    let userInfo = ev.detail.userInfo;
    if (!this.data.logged && userInfo) {
      db.collection('Users').add({
        data: {
          Userimg: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          Signature: '',
          PhoneNumber: '',
          WxNumber: '',
          links: 0,
          time: new Date(),
          isLocation: false,
          longitude: this.longitude,
          latitude: this.latitude,
          location:db.Geo.Point(this.longitude,this.latitude),
          friendList: []

        }
      }).then((res) => {
        //console.log(res);
        db.collection('Users').doc(res._id).get().then((res) => {
          console.log(res.data);
          app.userInfo = Object.assign(app.userInfo, res.data);
          this.setData({
            ownerPhoto: app.userInfo.Userimg,
            nickName: app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          });
        });
      });
    }
  },

  getMessage() {
    db.collection('Message').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function (snapshot) {
        if (snapshot.docChanges.length) {
          let list = snapshot.docChanges[0].doc.list;
          if (list.length) {
            wx.showTabBarRedDot({
              index: 2,
            });
            app.userMessage = list
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.userMessage = [];
          }
        }
      },
      onError: function (err) {
        console.error(err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { //验证数据库，实现直接登录
    this.getLocation();
    wx.cloud.callFunction({
      name: 'login', //调用云函数login
      data: {}
    }).then((res) => {
      //console.log(res);
      db.collection('Users').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            ownerPhoto: app.userInfo.Userimg,
            nickName: app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          });
          this.getMessage();
        } else {
          this.setData({
            disabled: false
          });

        }

      });
    });
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.latitude = res.latitude
        this.longitude = res.longitude
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      ownerPhoto: app.userInfo.Userimg,
      nickName: app.userInfo.nickName,
      id: app.userInfo._id
    });
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