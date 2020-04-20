"use strict";

exports.__esModule = true;
exports.default = exports.listCountByColum = exports.listToMap = void 0;

/**
 * list根据colum转obj并去重
 * @param {*} list 【{},{}】obj的集合
 * @param {*} colum 作为map的key的obj的一个字段名  默认是id
 * @return map
 */
var listToMap = function listToMap(list, colum) {
  if (list === void 0) {
    list = [];
  }

  if (colum === void 0) {
    colum = 'id';
  }

  var map = {};
  (list || []).forEach(function (item) {
    map[item[colum]] = item;
  });
  return map;
};
/**
 * list根据colum计数
 * @param {*} list 【{},{}】obj的集合 比如[{id:'a'},{id:'b'},{id:'b'}]
 * @param {*} colum 作为map的key的obj的一个字段名  默认是id
 * @return map  比如{a:1,b:2}
 * [{id:'a',key:'xxx'},{id:'b'},{id:'b'}]经过listCountByColum后变成{a:1,b:2}
 */


exports.listToMap = listToMap;

var listCountByColum = function listCountByColum(list, colum) {
  if (list === void 0) {
    list = [];
  }

  if (colum === void 0) {
    colum = 'id';
  }

  var map = {};
  (list || []).forEach(function (item) {
    map[item === null || item === void 0 ? void 0 : item[colum]] = map[item === null || item === void 0 ? void 0 : item[colum]] ? map[item === null || item === void 0 ? void 0 : item[colum]] + 1 : 1;
  });
  return map;
};

exports.listCountByColum = listCountByColum;
var _default = {
  listToMap: listToMap,
  listCountByColum: listCountByColum
};
exports.default = _default;