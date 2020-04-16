"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

require("./loadExcel.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Option = _antd.Select.Option;

var ExcelEdgeConfig = function ExcelEdgeConfig(props) {
  var _props$LoadExcel = props.LoadExcel,
      currentModel = _props$LoadExcel.currentModel,
      _props$LoadExcel$exce = _props$LoadExcel.excelData,
      excelData = _props$LoadExcel$exce === void 0 ? [[]] : _props$LoadExcel$exce,
      configEdges = _props$LoadExcel.configEdges;
  var edgeTypes = props.edgeTypes;
  var _currentModel$relId = currentModel.relId,
      relId = _currentModel$relId === void 0 ? {} : _currentModel$relId,
      id = currentModel.id;

  var _ref = edgeTypes[relId] || {},
      _ref$properties = _ref.properties,
      properties = _ref$properties === void 0 ? [] : _ref$properties,
      relName = _ref.relName;

  var configChange = function configChange(e, item, isFormat) {
    if (isFormat) {
      props.LoadExcel.pushConfigEdges({
        id: id,
        properties: [_objectSpread({}, item, {
          dataFormat: e
        })]
      });
    } else {
      props.LoadExcel.pushConfigEdges({
        id: id,
        properties: [_objectSpread({}, item, {
          columns: [e]
        })]
      });
    }
  };

  var configChangeType = function configChangeType(e) {
    props.LoadExcel.pushConfigEdges({
      id: id
    }, e);
  };

  var config = configEdges.find(function (v) {
    return v.id === id;
  });
  var values = {};
  config && config.properties && config.properties.forEach(function (v) {
    values[v.localName] = v;
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "demo-props"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", null, "\u8FB9\u7C7B\u578B"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Select, {
    value: relName || '',
    style: {
      width: 200
    },
    onChange: function onChange(e) {
      return configChangeType(e);
    }
  }, Object.values(edgeTypes).map(function (v) {
    return /*#__PURE__*/_react.default.createElement(Option, {
      key: v.relId
    }, v.relName);
  })))), properties.map(function (v) {
    var dataType = v.dataType;
    var obj = values[v.localName] || {};
    return /*#__PURE__*/_react.default.createElement("div", {
      key: v.localName
    }, /*#__PURE__*/_react.default.createElement("label", null, v.displayName), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Select, {
      value: obj.columns && obj.columns[0] || '',
      style: {
        width: 200
      },
      onChange: function onChange(e) {
        return configChange(e, v);
      }
    }, excelData.length ? excelData[0].map(function (v) {
      return /*#__PURE__*/_react.default.createElement(Option, {
        key: v
      }, v);
    }) : null)), (dataType === 'date' || dataType === 'datetime') && obj.columns && obj.columns[0] ? /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", null, v.displayName, "\u65F6\u95F4\u683C\u5F0F"), /*#__PURE__*/_react.default.createElement(_antd.Input, {
      value: obj.dataFormat || '',
      onChange: function onChange(e) {
        return configChange(e.target.value, v, true);
      }
    })) : null);
  }));
};

var _default = ExcelEdgeConfig;
exports.default = _default;