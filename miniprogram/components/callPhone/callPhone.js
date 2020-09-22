// components/callPhone/callPhone.js
Component({
  /**
   * 组件的属性列表
   */
  options: {//组件共享
    styleIsolation: 'apply-shared'
  },
  properties: {
    phoneNumber:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCallPhone(){
      wx.makePhoneCall({
        phoneNumber: this.data.phoneNumber
      })
    }
  }
})
