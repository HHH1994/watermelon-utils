"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _lodash = _interopRequireDefault(require("lodash"));

var _excelConfig = _interopRequireDefault(require("./excelConfig"));

var _excelEdgeConfig = _interopRequireDefault(require("./excelEdgeConfig"));

var _g6Utils = _interopRequireDefault(require("./g6Utils"));

var _g = _interopRequireDefault(require("@antv/g6"));

require("./addEdge");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var TreeNode = _antd.Tree.TreeNode;

var ExcelGraph = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ExcelGraph, _React$Component);

  function ExcelGraph() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      config: 'node'
    };

    _this.addNode = function (event) {
      var _this$state = _this.state,
          isDrag = _this$state.isDrag,
          currentNodeType = _this$state.currentNodeType;

      if (isDrag) {
        var model = {
          id: new Date().getTime() + '',
          x: event.x,
          y: event.y,
          entId: currentNodeType.entId,
          // shape: 'image',
          icon: {
            show: true,
            img: "/api/graph/previewIcon/" + currentNodeType.iconId,
            width: 36,
            height: 36
          },
          label: currentNodeType.entName + _this.graph.getNodes().length
        };

        _this.graph.addItem('node', model);
      }

      _this.setState({
        isDrag: false
      });
    };

    _this.reSetSelected = function (item) {
      var selectedNodes = _this.graph.findAllByState('node', 'selected');

      selectedNodes.forEach(function (node) {
        _this.graph.setItemState(node, 'selected', false);
      });

      var selectedEdges = _this.graph.findAllByState('edge', 'selected');

      selectedEdges.forEach(function (node) {
        _this.graph.setItemState(node, 'selected', false);
      });
      item && _this.graph.setItemState(item, 'selected', true);
    };

    _this.setConfig = function (event) {
      var item = event.item;
      var model = item.getModel();

      _this.props.LoadExcel.setCurrentModel(model);

      _this.props.LoadExcel.setConfigNodes(model);

      _this.reSetSelected(item);

      _this.setState({
        config: 'node'
      });
    };

    _this.setConfigByEdge = function (event) {
      var item = event.item;
      var model = item.getModel();

      _this.props.LoadExcel.setCurrentModel(model);

      _this.props.LoadExcel.setConfigEdges(model);

      _this.reSetSelected(item);

      _this.setState({
        config: 'edge'
      });
    };

    _this.onMouseDown = function (e, type) {
      _this.setState({
        isDrag: true,
        currentNodeType: type
      });
    };

    _this.del = function () {
      var selectedNodes = _this.graph.findAllByState('node', 'selected');

      if (selectedNodes.length) {
        var item = selectedNodes[0];
        var model = item.getModel();

        _this.props.LoadExcel.delConfigNodes({
          id: model.id
        });

        var arr = item.getEdges();
        arr.forEach(function (v) {
          return _this.graph.removeItem(v);
        });

        _this.graph.removeItem(item);
      } else {
        var selectedEdge = _this.graph.findAllByState('edge', 'selected');

        var _item = selectedEdge[0];

        var _model = _item.getModel();

        _this.props.LoadExcel.delConfigEdges({
          id: _model.id
        });

        _this.graph.removeItem(_item);
      }
    };

    _this.link = function () {
      if (_this.graph.getCurrentMode() !== 'clickAddEdge') {
        _this.graph.setMode('clickAddEdge');
      }
    };

    _this.changeNode = function (id, label) {
      _this.updateItem(id, {
        label: label
      });
    };

    return _this;
  }

  var _proto = ExcelGraph.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var dom = document.getElementById('demo-graph');
    this.graph = new _g.default.Graph(_objectSpread({
      container: 'demo-graph',
      width: dom.scrollWidth,
      height: dom.scrollHeight
    }, _g6Utils.default.defaultConfig, {
      modes: {
        default: ['drag-canvas', 'drag-node'],
        clickAddEdge: ['click-add-edge'],
        select: ['drag-node', 'drag-canvas']
      }
    })); // 拖拽生成node

    this.graph.on('canvas:mouseup', this.addNode); // 选中node 展示node属性提供选择

    this.graph.on('node:click', this.setConfig); // 选中edge 展示edge属性提供选择

    this.graph.on('edge:click', this.setConfigByEdge); // 重置模式

    this.graph.on('canvas:click', function () {
      _this2.graph.setMode('select');
    }); // 鼠标经过时edge变粗

    this.graph.on('edge:mouseenter', function (evt) {
      var edge = evt.item;

      _this2.graph.updateItem(edge, _objectSpread({}, edge._cfg.model, {
        style: {
          lineWidth: 3
        }
      }));
    }); // 鼠标离开时edge恢复

    this.graph.on('edge:mouseleave', function (evt) {
      var edge = evt.item;

      _this2.graph.updateItem(edge, _objectSpread({}, edge._cfg.model, {
        style: {
          lineWidth: 1
        }
      }));
    });
  };

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(next) {
    // 接受导入的配置 生成graph
    if (!_lodash.default.isEqual(next.graphData, this.props.graphData)) {
      var _next$graphData = next.graphData,
          nodes = _next$graphData.configNodes,
          edges = _next$graphData.configEdges;
      this.graph.changeData(_g6Utils.default.handleGraphData({
        nodes: nodes,
        edges: edges
      }));
      this.graph.refresh();
    }
  } // 拖拽生成node
  ;

  _proto.render = function render() {
    var _this3 = this;

    var entTree = this.props.entTree;
    return /*#__PURE__*/_react.default.createElement(_antd.Row, {
      className: "excel-config"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "demo-graph"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "node-type"
    }, entTree && /*#__PURE__*/_react.default.createElement(_antd.Tree, {
      showIcon: true,
      onDragStart: function onDragStart() {
        return false;
      }
    }, entTree.children.map(function (child) {
      return /*#__PURE__*/_react.default.createElement(TreeNode, {
        icon: child.iconId ? /*#__PURE__*/_react.default.createElement("img", {
          alt: "",
          width: "20",
          height: "20",
          src: "/api/graph/previewIcon/" + child.iconId
        }) : null,
        key: child.entId,
        title: child.entName
      }, child.children.map(function (v) {
        return /*#__PURE__*/_react.default.createElement(TreeNode, {
          icon: v.iconId ? /*#__PURE__*/_react.default.createElement("img", {
            alt: "",
            width: "20",
            height: "20",
            src: "/api/graph/previewIcon/" + v.iconId,
            onMouseDown: function onMouseDown(e) {
              return _this3.onMouseDown(e, v);
            },
            onSelectStart: function onSelectStart() {
              return false;
            }
          }) : null,
          key: v.entId,
          title: /*#__PURE__*/_react.default.createElement("span", {
            className: "tree-title",
            onMouseDown: function onMouseDown(e) {
              return _this3.onMouseDown(e, v);
            },
            onSelectStart: function onSelectStart() {
              return false;
            }
          }, v.entName)
        });
      }));
    }))), /*#__PURE__*/_react.default.createElement("div", {
      id: "demo-graph"
    }), this.state.config === 'node' ? /*#__PURE__*/_react.default.createElement(_excelConfig.default, {
      onChange: this.changeNode,
      nodeTypes: this.props.nodeTypes,
      LoadExcel: this.props.LoadExcel
    }) : /*#__PURE__*/_react.default.createElement(_excelEdgeConfig.default, {
      edgeTypes: this.props.edgesTypes,
      LoadExcel: this.props.LoadExcel
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "tools"
    }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
      icon: "close",
      onClick: this.del
    }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
      icon: "edit",
      onClick: this.link
    }))));
  };

  return ExcelGraph;
}(_react.default.Component);

var _default = ExcelGraph;
exports.default = _default;