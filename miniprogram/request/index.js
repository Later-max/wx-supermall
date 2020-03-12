
// 同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
  ajaxTimes++;
  // 显示加载效果
  wx:wx.showLoading({
    title: '加载中',
    mask: true,
  })

  return new Promise((resolve,reject)=>{
    // 定义公共的Url
    const baseUrl = "https://api.zbztb.cn/api/public/v1"
    wx:wx.request({
      ...params,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        if (ajaxTimes===0){
        // 关闭加载中图标
            wx:wx.hideLoading()
        }
      }
    });
  })
}