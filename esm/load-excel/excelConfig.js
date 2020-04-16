import React from 'react';
import { Select, Input } from 'antd';
import './loadExcel.less';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }
var Option = Select.Option;

var ExcelConfig = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ExcelConfig, _React$Component);

  function ExcelConfig() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.configChange = function (e, item, isFormat) {
      var currentModel = _this.props.LoadExcel.currentModel;
      var id = currentModel.id;

      if (isFormat) {
        _this.props.LoadExcel.pushConfigNodes({
          id: id,
          properties: [_objectSpread({}, item, {
            dataFormat: e
          })]
        });
      } else {
        _this.props.LoadExcel.pushConfigNodes({
          id: id,
          properties: [_objectSpread({}, item, {
            columns: [e]
          })]
        });
      }
    };

    return _this;
  }

  var _proto = ExcelConfig.prototype;

  _proto.render = function render() {
    var _this2 = this;

    var _this$props$LoadExcel = this.props.LoadExcel,
        currentModel = _this$props$LoadExcel.currentModel,
        _this$props$LoadExcel2 = _this$props$LoadExcel.excelData,
        excelData = _this$props$LoadExcel2 === void 0 ? [[]] : _this$props$LoadExcel2,
        configNodes = _this$props$LoadExcel.configNodes;
    var nodeTypes = this.props.nodeTypes;
    var entId = currentModel.entId,
        id = currentModel.id;

    var _ref = nodeTypes[entId] || {},
        _ref$properties = _ref.properties,
        properties = _ref$properties === void 0 ? [] : _ref$properties;

    var config = configNodes.find(function (v) {
      return v.id === id;
    });
    var values = {};
    config && config.properties && config.properties.forEach(function (v) {
      values[v.localName] = v;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "demo-props"
    }, properties.map(function (v) {
      var dataType = v.dataType;
      var obj = values[v.localName] || {};
      return /*#__PURE__*/React.createElement("div", {
        key: v.localName
      }, /*#__PURE__*/React.createElement("label", null, v.displayName), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Select, {
        value: obj.columns && obj.columns[0] || '',
        style: {
          width: 200
        },
        onChange: function onChange(e) {
          return _this2.configChange(e, v);
        }
      }, excelData.length ? excelData[0].map(function (v) {
        return /*#__PURE__*/React.createElement(Option, {
          key: v
        }, v);
      }) : null)), (dataType === 'date' || dataType === 'datetime') && obj.columns && obj.columns[0] ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, v.displayName, "\u65F6\u95F4\u683C\u5F0F"), /*#__PURE__*/React.createElement(Input, {
        value: obj.dataFormat || '',
        onChange: function onChange(e) {
          return _this2.configChange(e.target.value, v, true);
        }
      })) : null);
    }));
  };

  return ExcelConfig;
}(React.Component);

export default ExcelConfig;