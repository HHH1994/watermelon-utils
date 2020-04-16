"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _fileSaver = require("file-saver");

var _excelGraph = _interopRequireDefault(require("./excelGraph"));

var _preview = _interopRequireDefault(require("./preview"));

require("./loadExcel.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var LoadExcel = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(LoadExcel, _React$Component);

  function LoadExcel(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.saveConfig = function () {
      var _this$props$LoadExcel = _this.props.LoadExcel,
          configNodes = _this$props$LoadExcel.configNodes,
          configEdges = _this$props$LoadExcel.configEdges;
      var str = JSON.stringify({
        configNodes: configNodes,
        configEdges: configEdges
      });
      var blob = new Blob([str], {
        type: 'text/plain;charset=utf-8'
      });
      (0, _fileSaver.saveAs)(blob, '配置.json');
    };

    _this.saveByGraph = function () {
      var _this$props$LoadExcel2 = _this.props.LoadExcel,
          configNodes = _this$props$LoadExcel2.configNodes,
          configEdges = _this$props$LoadExcel2.configEdges; // 补充source和target的type

      configEdges.forEach(function (v) {
        var target = v.target,
            source = v.source;
        var targetType = configNodes.find(function (v) {
          return v.id === target;
        });
        var sourceType = configNodes.find(function (v) {
          return v.id === source;
        });
        v.targetType = targetType;
        v.sourceType = sourceType;
      });
      var columsConfig = {};

      var _this$state$excelData = _this.state.excelData,
          colums = _this$state$excelData[0],
          list = _this$state$excelData.slice(1); // 把表头处理一下


      colums.forEach(function (v, i) {
        columsConfig[v] = i;
      });
      var nodes = {};
      var edges = [];

      var func = function func(a, p) {
        return [''].concat(p.columns).reduce(function (pre, next) {
          return pre + a[columsConfig[next]];
        });
      }; // 循环数据


      list.slice(0, 100).forEach(function (arr) {
        var tempsNode = {}; // 循环node配置

        configNodes.forEach(function (nodeConfig) {
          var properties = nodeConfig.properties,
              entId = nodeConfig.entId,
              id = nodeConfig.id; // 取出entid存起来

          var node = {
            entId: entId
          }; // 循环属性配置

          properties.forEach(function (p) {
            // 属性 node【key是localname】【value是数据中columns对应的】
            node[p.localName] = func(arr, p); // 把主键当id

            if (p.isPk) {
              node.id = func(arr, p); // mock数据无法保证id唯一。先用new Date().getTime()测试
            } // 把title当label


            if (p.isTitle) {
              node.label = func(arr, p);
            }
          }); // 把node临时存在本次循环，以供edge配置循环时使用

          tempsNode[id] = node;
          nodes[node.id] = node; // 用id去重并存起来
        }); // 循环edge配置

        configEdges.forEach(function (edgeConfig) {
          var properties = edgeConfig.properties,
              source = edgeConfig.source,
              target = edgeConfig.target; // 取出relid存起来

          var edge = {
            relId: edgeConfig.relId
          }; // 循环属性配置

          properties.forEach(function (p) {
            // 属性 edge【key是localname】【value是数据中columns对应的】
            edge[p.localName] = func(arr, p); // 把主键当id

            if (p.isPk) {
              edge.id = func(arr, p);
            }

            if (p.isTitle) {
              edge.label = func(arr, p);
            }
          }); // 找到临时存储的node中对应的target，source

          edge.target = tempsNode[source].id;
          edge.source = tempsNode[target].id; // 存起来

          edge.target && edge.source && edges.push(edge);
        });
      });
      nodes = Object.values(nodes); // setPreview({ nodes, edges });
      // setVisible(true);

      _this.setState({
        previewData: {
          nodes: nodes,
          edges: edges
        },
        previewVisible: true
      });
    };

    _this.setVisible = function (value) {
      _this.setState({
        previewVisible: value
      });
    };

    _this.dataToGraph = function (_ref) {
      var dataSource = _ref.dataSource,
          mark = _ref.mark;
      var _this$props$LoadExcel3 = _this.props.LoadExcel,
          configNodes = _this$props$LoadExcel3.configNodes,
          configEdges = _this$props$LoadExcel3.configEdges; // nodeid text作为新字段传给后端

      var tempNodes = configNodes.map(function (item) {
        var propList = [].concat(item.properties);
        propList.forEach(function (item) {
          if (item.isPk) {
            propList.push(_objectSpread({}, item, {
              localName: 'nodeId'
            }));
          }

          if (item.isSecondPk) {
            propList.push(_objectSpread({}, item, {
              localName: 'secondNodeId'
            }));
          }

          if (item.isTitle) {
            var index = propList.findIndex(function (v) {
              return v.localName === 'text';
            });

            if (index >= 0) {
              var _propList$index$colum;

              (_propList$index$colum = propList[index].columns).push.apply(_propList$index$colum, item.columns);
            } else {
              propList.push(_objectSpread({}, item, {
                localName: 'text'
              }));
            }
          }
        });
        return _objectSpread({}, item, {
          properties: propList
        });
      });
      var tempEdges = configEdges.map(function (item) {
        var propList = [].concat(item.properties);
        propList.forEach(function (item) {
          if (item.isTitle) {
            var index = propList.findIndex(function (v) {
              return v.localName === 'text';
            });

            if (index >= 0) {
              var _propList$index$colum2;

              (_propList$index$colum2 = propList[index].columns).push.apply(_propList$index$colum2, item.columns);
            } else {
              propList.push(_objectSpread({}, item, {
                localName: 'text'
              }));
            }
          }
        });
        return _objectSpread({}, item, {
          direction: _this.props.edgeTypes[item.relId].direction,
          properties: propList
        });
      });
      var params = {
        ids: _this.state.fileList.map(function (v) {
          return v.response.data.id;
        }),
        source: dataSource,
        memo: mark,
        config: {
          configNodes: tempNodes,
          configEdges: tempEdges
        }
      };

      _this.props.LoadExcel.dataToGraph(params, function () {
        return _this.setState({
          previewVisible: false
        });
      });
    };

    _this.state = {
      excelData: [],
      graphData: null,
      previewData: null,
      previewVisible: false,
      fileList: []
    };
    return _this;
  }

  var _proto = LoadExcel.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.props.getEntTree();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.props.LoadExcel.clear();
  };

  _proto.render = function render() {
    var _this2 = this;

    // 导入excel的upload
    var prop = {
      name: 'files',
      action: '/api/file/upload',
      multiple: true,
      accept: '.xls,.xlsx,.csv',
      onChange: function onChange(_ref2) {
        var file = _ref2.file,
            fileList = _ref2.fileList;

        if (file.status === 'done') {
          _this2.setState({
            excelData: fileList[0].response.data.data,
            fileList: fileList
          });

          _this2.props.LoadExcel.setExcelData(fileList[0].response.data.data);

          _antd.message.success(file.name + " \u4E0A\u4F20\u6210\u529F");
        } else if (file.status === 'error') {
          _antd.message.error(file.name + " \u4E0A\u4F20\u5931\u8D25");
        }
      }
    };
    var loadProp = {
      name: 'file',
      action: '/',
      accept: 'application/json',
      beforeUpload: function beforeUpload(file) {
        if (file.size > 20 * 1024 * 1024) {
          _antd.message.warn('文件不得超过20M！');

          return false;
        }

        var reader = new FileReader();
        reader.addEventListener('load', function () {
          var result = reader.result;
          var data = JSON.parse(result);
          var configNodes = data.configNodes,
              configEdges = data.configEdges;
          configNodes.forEach(function (config) {
            config.properties = config.properties.filter(function (v) {
              return v.localName !== 'nodeId' && v.localName !== 'text';
            });
          });
          configEdges.forEach(function (config) {
            config.properties = config.properties.filter(function (v) {
              return v.localName !== 'text';
            });
          });

          _this2.props.LoadExcel.setNodeAndEdgeConfig(data); // setGraphData(data);


          _this2.setState({
            graphData: data
          });
        }, false);
        reader.readAsText(file);
        return false;
      }
    };
    var _this$state = this.state,
        excelData = _this$state.excelData,
        graphData = _this$state.graphData,
        previewVisible = _this$state.previewVisible,
        previewData = _this$state.previewData; // 第一行作为表头

    var columns = excelData.length ? excelData[0].map(function (v) {
      return {
        title: v,
        key: v,
        dataIndex: v,
        ellipsis: true,
        width: 200
      };
    }) : [];
    var dataSource = excelData.filter(function (v, i) {
      return i !== 0;
    }) // 第一行作为表头
    .map(function (v) {
      var row = {};
      columns.forEach(function (item, i) {
        row[item.title] = v[i];
      });
      return row;
    }); // return (
    //     <div>
    //         1
    //         <div className={`upload ${excelData.length > 0 ? '' : 'center'}`}>
    //             <Upload {...prop}>
    //                 <Button size="small">
    //                     <Icon type="upload" /> 点击上传
    //                 </Button>
    //             </Upload>
    //         </div>
    //     </div>
    // );

    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "upload " + (excelData.length > 0 ? '' : 'center')
    }, /*#__PURE__*/_react.default.createElement(_antd.Upload, prop, /*#__PURE__*/_react.default.createElement(_antd.Button, {
      size: "small"
    }, /*#__PURE__*/_react.default.createElement(_antd.Icon, {
      type: "upload"
    }), " \u70B9\u51FB\u4E0A\u4F20"))), dataSource.length ? /*#__PURE__*/_react.default.createElement(_antd.Table, {
      dataSource: dataSource,
      columns: columns,
      size: "small",
      pagination: false,
      scroll: {
        x: 1500,
        y: 150
      }
    }) : null, dataSource.length ? /*#__PURE__*/_react.default.createElement("div", {
      className: "load-excel-demo"
    }, /*#__PURE__*/_react.default.createElement(_excelGraph.default, {
      graphData: graphData,
      LoadExcel: this.props.LoadExcel,
      entTree: this.props.entTree
    })) : null, dataSource.length ? /*#__PURE__*/_react.default.createElement("div", {
      className: "load-excel-btns",
      style: {
        textAlign: 'end'
      }
    }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
      onClick: this.props.onCancel
    }, "\u53D6\u6D88"), /*#__PURE__*/_react.default.createElement(_antd.Upload, _extends({}, loadProp, {
      className: "load-json"
    }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
      type: "primary"
    }, "\u5BFC\u5165\u914D\u7F6E")), /*#__PURE__*/_react.default.createElement(_antd.Button, {
      type: "primary",
      onClick: this.saveConfig
    }, "\u4FDD\u5B58\u914D\u7F6E"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
      type: "primary",
      onClick: this.saveByGraph
    }, "\u9884\u89C8")) : null, previewData ? /*#__PURE__*/_react.default.createElement(_antd.Modal, {
      title: '预览',
      visible: previewVisible,
      onOk: function onOk() {
        return _this2.setVisible(false);
      },
      onCancel: function onCancel() {
        return _this2.setVisible(false);
      },
      width: '80%',
      footer: null,
      style: {
        top: 10
      }
    }, /*#__PURE__*/_react.default.createElement(_preview.default, {
      data: this.previewData,
      save: this.dataToGraph,
      onCancel: function onCancel() {
        return _this2.setVisible(false);
      }
    })) : null);
  };

  return LoadExcel;
}(_react.default.Component);

var _default = LoadExcel;
exports.default = _default;