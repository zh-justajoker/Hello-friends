// miniprogram/pages/userInfo/phone/phone.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: ''
  },
  headText(ev) { //获取输入框中的手机号
    let value = ev.detail.value;
    this.setData({
      phoneNumber: value
    });
  },
  handleBtn() { //设置按钮
    this.setPhoneNumber();
  },
  setPhoneNumber() {//验证手机号，并更新数据库
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.phoneNumber.length == 0) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (this.data.phoneNumber.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.phoneNumber)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else {
      wx.showLoading({
        title: '更新中',
      })
      db.collection('Users').doc(app.userInfo._id).update({
        data: {
          phoneNumber: this.data.phoneNumber
        }
      }).then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: '更新成功',
        });
        app.userInfo.phoneNumber = this.data.phoneNumber
      });
    }
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
      phoneNumber: app.userInfo.phoneNumber
    });
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