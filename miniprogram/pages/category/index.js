// 引入用来发送请求的方法
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    //左侧内容滚动条到顶部的距离
    scrollTop:0
  },
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 0.web中的本地存储 和微信小程序本地存储的区别
      // 0.1.写代码的方式不一样
    // web: localStorage.setItem("key", "value") localStorage.getItem("key")
      // 微信小程序：wx.setStorageSync(key, data);wx.getStorageSync(key)
      // 0.2.存的时候 有没有做类型转换
      // web:不管存入什么类型的数据，最终都会先调用以下toString(),把数据变成了字符串 再存入进去
      // 小程序：不存在数据类型转换 存什么类型数据，获取就是什么类型数据
    // 1.先判断一下本地存储中有没有旧的数据
    // 2.没有旧的数据  直接发送新请求
    // 3.没有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
    
    // 1. 获取本地存储中的数据（小程序也是存在本地存储技术）
    const Cates = wx.getStorageSync("cates")
    // 判断
    if(!Cates){
      // 不存在，发送新的数据请求
      this.getCates();
    }else{
      // 有旧的数据 同时判断是否过期
      if(Date.now()-Cates.time>1000*10){
        this.getCates();
      }else{
        // 可以使用旧的数据
        console.log("可以使用");
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }
  },
  // 获取分类数据
  async getCates(){
    // request({
    //   url: '/categories'
    // })
    // .then(res =>{
    //    console.log(res);
    //   this.Cates=res.data.message;

    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

    //   console.log(this.Cates);
    //   // 构造左侧大菜单数据
    //   let leftMenuList=this.Cates.map(v => v.cat_name);
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   });
    // })

    // 1.使用es7的async await发送异步请求
    const res = await request({url:"/categories"});
      this.Cates=res;

      // 把接口的数据存入到本地存储中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

      console.log(this.Cates);
      // 构造左侧大菜单数据
      let leftMenuList=this.Cates.map(v => v.cat_name);
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      });
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 1.获取被点击 的标题身上的索引
    // 2.给data中的currentIndex赋值就可以了 
    // 3.根据不同的索引来渲染右侧的商品内容
    console.log(e);
    const {index}=e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }



})