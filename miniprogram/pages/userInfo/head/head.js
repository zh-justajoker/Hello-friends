// miniprogram/pages/userInfo/head/head.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Userimg: ''
  },
  bindGetUserInfo(ev) { //获取微信头像并设置
    let userInfo = ev.detail.userInfo;
    if (userInfo) {
      this.setData({
        Userimg: userInfo.avatarUrl
      }, () => {
        wx.showLoading({
          title: '上传中',
        })
        db.collection('Users').doc(app.userInfo._id).update({
          data: {
            Userimg: userInfo.avatarUrl
          }
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功'
          });
          app.userInfo.Userimg = this.data.Userimg
        });
      });
    }
  },
  handleBtn() { //自定义头像并上传至数据库
    wx.showLoading({
      title: '上传中',
    })
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + ".jpg"
    wx.cloud.uploadFile({
      cloudPath,
      filePath: this.data.Userimg
    }).then((res) => {
      let fileID = res.fileID;
      if (fileID) {
        db.collection('Users').doc(app.userInfo._id).update({
          data: {
            Userimg: fileID
          }
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功'
          });
          app.userInfo.Userimg = this.data.Userimg
        });
      }
    })
  },
  handleImg() { //选择要更新的头像
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths[0]
        this.setData({
          Userimg: tempFilePaths
        });
      }
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
    this.setData({
      Userimg: app.userInfo.Userimg
    })
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

  }
})