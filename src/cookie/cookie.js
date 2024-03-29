/**
    * 设置cookie
    * @param name cookie的名称
    * @param value cookie的值
    * @param day cookie的过期时间
**/
export function setCookie(name , value , day){
    if(day != 0){ //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
        var expires = day * 24 * 60 * 60 * 1000;
        var date = new Date(+new Date()+expires);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
    }else{
        document.cookie = name + "=" + escape(value);
    }
}
/**
    * 获取对应名称的cookie
    * @param name cookie的名称
    * @returns {null} 不存在时，返回null
**/
  export function  getCookie(name) {
      var arr;
      var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
       if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
         else
           return null;
       };
/**
    * 删除cookie
    * @param name cookie的名称 设置要删除的cookie的expires为过去的时间即可
**/    
    export function delCookie (name) {
       setCookie(name, ' ', -1);
     };