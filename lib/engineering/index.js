"use strict";

exports.__esModule = true;
exports.default = exports.debounce = void 0;

/**
 * 防抖
 * @param {*} fn 函数
 * @param {*} delay 延时
 */
var debounce = function debounce(fn, delay) {
  var timer = null;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

exports.debounce = debounce;
var _default = {
  debounce: debounce
};
exports.default = _default;