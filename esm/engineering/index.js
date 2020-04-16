/**
 * 防抖
 * @param {*} fn 函数
 * @param {*} delay 延时
 */
export var debounce = function debounce(fn, delay) {
  var timer = null;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};
export default {
  debounce: debounce
};