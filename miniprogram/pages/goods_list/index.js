// pages/goods_list/index.js

// 1.用户上滑页面 滚动条触底 开始加载下一页
  // 1.1找到滚动条的触底位置  微信小程序官方开发文档中有内容
  // 1.2判断还有没有下一页数据
  // 1.3假设没有下一页数据 弹出一个提示
  // 1.4假设还有下一页数据 来加载下一页数据
  // 2.下拉页面刷新
    // 2.1触发下拉刷新
    // 2.2重置数据  数组
    // 2.3重置页面 设置为1

// 引入用来发送请求的方法
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:"",
    pagesize:10
  },

  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();

    
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({ url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    
    this.setData({
      // 拼接数组 添加下一页
      goodsList: [...this.data.goodsList,...res.goods]
    })

    // 关闭下拉刷新的窗口 
    wx:wx.stopPullDownRefresh();
  },

  // 标题的点击事件 从子组件传递过来
  handletabsItemChange(e){
    console.log(e);
    //1. 获取被点击的标题索引
    const {index}=e.detail;
    // 2.修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom: function () {
    // 1.判断还有没有 下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      // 没有下一页数据
      wx-wx.showToast({
        title: '没有下一页数据',
       
      })
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
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
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1;
    // 发送请求
    this.getGoodsList();
  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})