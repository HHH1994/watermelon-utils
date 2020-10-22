
/** 
 * 1. 下列方法只能获取到httpOnly为false的cookie 
 * 2. 下列方法在以localhost为主机名时，Google浏览器下无法使用
 * 3. 下列方法在file://协议下的调试无法起作用，需要在http服务环境下才能生效
 * */

let isValidDataInputParam = (param) => {
  if (param instanceof Date) {
    return true;
  }
  if (['string', 'number'].includes(typeof param)) {
    return true;
  }

  return false;
};

/**
 *  设置cookie
 * @param {*} key
 * @param {*} val 
 * @param {*} expireDate
 */
export const setCookie = (key, val, expireDate) => {
  document.cookie += `${key}=${val};`
  if (isValidDataInputParam(expireDate)) {
    const expireString = new Date(expireDate);
    document.cookie += `expire=${expireString}`;
  }
};



/**
 * cookie取值
 * @param {*} key 
 */
export const getCookie = (key) => {
  const { cookie } = document;
  if (cookie && cookie !== '') {
   let arr = cookie.split(';'),
       dataArr;
   for(let i = 0, len = arr.length; i < len; i++) {
     dataArr = arr[i].split('=');
     if (dataArr[0] === key) {
       return dataArr[1];
     }
   }
  }
  return '';
};

/**
 * 移除cookie
 * @param {*} key 
 */
export const removeCookie = (key) => {
  document.cookie =  `${key}=''&expireDate=-1`;
}

export default {
  setCookie,
  getCookie,
  removeCookie
}