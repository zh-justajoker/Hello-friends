// components/search/search.js
const app = getApp()
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  options: { //组件共享
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList:[],
    inputValue:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {
      wx.getStorage({
        key: "searchHistory",
        success: (res) => {
          this.setData({
            historyList: res.data
          });
        }
      });
      this.setData({
        isFocus: true
      });
    },
    handleCancle() {
      this.setData({
        isFocus: false,
        inputValue:''
      })
    },
    handleConfirm(ev) {
      let value=ev.detail.value;
      let cloneHistoryList=[...this.data.historyList];
      cloneHistoryList.unshift(value);
      wx.setStorage({
        key: "searchHistory",
        data: [...new Set(cloneHistoryList)]
      })
      this.changeSearchList(value);
    },
    handleDelete(){
      wx.removeStorage({
        key: "searchHistory",
        success :(res)=> {
          this.setData({
            historyList:[]
          })
        }
      })
    },
    changeSearchList(value){
      db.collection('Users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i',
        })
      }).field({
        Userimg:true,
        nickName:true
      }).get().then((res)=>{
        this.setData({
          searchList:res.data
        });
      });
    },
    handleHistoryDel(ev){
      let value=ev.target.dataset.text;
      this.setData({
        inputValue:value
      })
      this.changeSearchList(value);
    }
  }
})