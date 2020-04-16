"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _g = _interopRequireDefault(require("@antv/g6"));

var _antd = require("antd");

var _g6Utils = _interopRequireDefault(require("./g6Utils"));

require("./loadExcel.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Preview = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Preview, _React$Component);

  function Preview() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      dataSource: '',
      mark: ''
    };

    _this.save = function () {
      _this.props.save(_this.state);
    };

    return _this;
  }

  var _proto = Preview.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var dom = document.getElementById('preview-graph');
    this.graph = new _g.default.Graph(_objectSpread({
      container: 'preview-graph',
      width: dom.scrollWidth,
      height: dom.scrollHeight,
      layout: {
        type: 'grid',
        nodeSize: 48,
        preventOverlap: true,
        preventOverlapPadding: 100
      }
    }, _g6Utils.default.defaultConfig));
    var data = this.props.data;

    var graphData = _g6Utils.default.handleGraphData(data);

    this.graph.data(graphData);
    this.graph.render();
    this.graph.fitView(10);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.graph.destroy();
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$state = this.state,
        mark = _this$state.mark,
        dataSource = _this$state.dataSource;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      id: "preview-graph",
      style: {
        height: 600
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "mark"
    }, /*#__PURE__*/_react.default.createElement("span", null, "\u5982\u679C\u8981\u8FDB\u884C\u6570\u56FE\u8F6C\u6362\uFF0C\u5EFA\u8BAE\u586B\u5199"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", null, "\u6570\u636E\u6765\u6E90\uFF1A"), /*#__PURE__*/_react.default.createElement(_antd.Input, {
      value: dataSource,
      onChange: function onChange(e) {
        return _this2.setState({
          dataSource: e.target.value
        });
      }
    })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", null, "\u5907\u6CE8\uFF1A"), /*#__PURE__*/_react.default.createElement(_antd.Input.TextArea, {
      rows: 3,
      value: mark,
      onChange: function onChange(e) {
        return _this2.setState({
          mark: e.target.value
        });
      }
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "load-excel-btns",
      style: {
        textAlign: 'end'
      }
    }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
      onClick: this.props.onCancel
    }, "\u53D6\u6D88"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
      type: "primary",
      onClick: this.save
    }, "\u6570\u56FE\u8F6C\u6362")));
  };

  return Preview;
}(_react.default.Component);

var _default = Preview;
exports.default = _default;