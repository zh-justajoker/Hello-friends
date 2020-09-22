// miniprogram/pages/index/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsw: [
      "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597668271639&di=15be4ac8a951f9bf2a226b9e03ebb559&imgtype=0&src=http%3A%2F%2Ffile05.16sucai.com%2F2015%2F0627%2Faacec0155eb2493b0996dfa932300028.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597668271638&di=f8767252754863311018af4063c05d32&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fd%2F513e98bf9a847.jpg",
      "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2310890073,3469009192&fm=26&gp=0.jpg"
    ],
    listData: [],
    current: 'links'
  },
  handleLinks(ev) {
    let id = ev.target.dataset.id;
    wx.cloud.callFunction({ //调用云函数update
      name: 'update',
      data: {
        collection: 'Users',
        doc: id,
        data: "{links: _.inc(1)}"
      }
    }).then((res) => { //页面同步更新操作
      let updated = res.result.stats.updated;
      if (updated) {
        let cloneListData = [...this.data.listData];
        for (let i = 0; i < cloneListData.length; i++) {
          if (cloneListData[i]._id == id) {
            cloneListData[i].links++;
          }
        }
        this.setData({
          listData: cloneListData
        });
      }
    });
  },
  handleCurrent(ev) { //切换推荐和最新
    let current = ev.target.dataset.current;
    if (current == this.data.current) {
      return false;
    }
    this.setData({
      current
    },()=>{
      this.getListData();
    });
  },
  handleDetail(ev){
    let id = ev.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId='+id
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
    this.getListData();
  },
  getListData() {
    db.collection('Users').field({
      Userimg: true,
      nickName: true,
      links: true
    }).orderBy(this.data.current, 'desc')
    .get().then((res) => {
      this.setData({
        listData: res.data
      });
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