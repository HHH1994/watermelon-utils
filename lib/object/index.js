"use strict";

exports.__esModule = true;
exports.default = exports.isNullOrEmpty = void 0;

/**
 * 
 * @param {*} obj 
 */
var isNullOrEmpty = function isNullOrEmpty(obj) {
  if (!obj || obj.length === 0) {
    return true;
  }

  if (obj instanceof Object) {
    for (var k in obj) {
      if (obj[k]) {
        return false;
      }
    }

    return true;
  }

  return false;
};

exports.isNullOrEmpty = isNullOrEmpty;
var _default = {
  isNullOrEmpty: isNullOrEmpty
};
exports.default = _default;