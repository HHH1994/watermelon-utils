/**
 * 防抖
 * @param {*} fn 函数
 * @param {*} delay 延时
 */
export const debounce = (fn, delay) => {
    let timer = null;
    return () => {
        timer && clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
};

/**
 * 节流
 * @param {*} fn 函数
 * @param {*} delay  延时
 */
export const throttle = (fn, delay) => {
  let timer = new Date().getTime();
  return () => {
      let now = new Date().getTime();
      if ( now - timer > delay) {
          fn(); 
          timer = now;
      }
  }
};

export default { debounce, throttle };
