function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export var defaultConfig = {
  defaultEdge: {
    style: {
      stroke: '#eee',
      lineWidth: 1
    },
    labelCfg: {
      refY: 15
    }
  },
  defaultNode: {
    style: {
      fill: '#0084FF',
      stroke: 'transparent',
      lineWidth: 0,
      fillOpacity: 0.2
    },
    size: [48, 48],
    labelCfg: {
      position: 'bottom',
      offset: 7,
      style: {
        fontSize: 14,
        fill: 'rgba(0,0,0,0.85)' // ... 文本样式的配置

      }
    }
  }
};
/**
 * 计算字符串的长度
 * @param {string} str 指定的字符串
 * @return {number} 字符串长度
 */

export var calcStrLen = function calcStrLen(str) {
  if (str === void 0) {
    str = '';
  }

  var len = 0;

  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
  }

  return len;
};
/**
 * 计算显示的字符串
 * @param {string} str 要裁剪的字符串
 * @param {number} maxWidth 最大宽度
 * @param {number} fontSize 字体大小
 * @return {string} 处理后的字符串
 */

export var fittingString = function fittingString(str, maxWidth, fontSize) {
  if (str === void 0) {
    str = '';
  }

  var fontWidth = fontSize * 1.3; // 字号+边距

  maxWidth = maxWidth * 2; // 需要根据自己项目调整

  var width = calcStrLen(str) * fontWidth;
  var ellipsis = '…';

  if (width > maxWidth) {
    var actualLen = Math.floor((maxWidth - 10) / fontWidth);
    var result = str.substring(0, actualLen) + ellipsis;
    return result;
  }

  return str;
};
export var setArcEdges = function setArcEdges(edges) {
  var obj = {};
  var positions = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
  edges.forEach(function (edge) {
    var key = edge.target + "--" + edge.source;

    if (obj[edge.source + "--" + edge.target]) {
      key = edge.source + "--" + edge.target;
    }

    if (edge.source === edge.target) {
      edge.shape = 'loop';
      edge.labelCfg = {
        refY: -5,
        refX: 30
      };

      if (obj[key]) {
        obj[key].push(edge);
      } else {
        obj[key] = [edge];
      }

      edge.loopCfg = {
        position: positions[obj[key].length - 1]
      };
    } else if (obj[key]) {
      obj[key].push(edge);
      var num = obj[key].length;
      var curveOffset = 0;

      if (num % 2 > 0) {
        curveOffset = 0;
      } else {
        curveOffset = -15;
      }

      curveOffset = Math.floor(num / 2) * 30 + curveOffset;

      for (var index = 0; index < obj[key].length; index++) {
        var element = obj[key][index];
        element.curveOffset = curveOffset - 30 * index || 1;
        element.curvePosition = index / obj[key].length;
        element.shape = 'quadratic-line'; // 自带曲线
      }
    } else {
      obj[key] = [edge];
    }
  });
};
export var handleGraphData = function handleGraphData(data, nodeTypes, edgeTypes) {
  var nodes = data.nodes.map(function (item) {
    return _objectSpread({}, nodeTypes[item.entId], {}, item, {
      id: item.id || item.uid,
      label: fittingString(item.label || item.text, 85, 12),
      icon: {
        show: true,
        img: nodeTypes[item.entId] ? "/api/graph/previewIcon/" + nodeTypes[item.entId].iconId : '',
        width: 36,
        height: 36
      }
    });
  });
  var edges = data.edges.map(function (item) {
    var _ref = edgeTypes[item.relId] || {},
        lineWidth = _ref.lineWidth,
        lineColor = _ref.lineColor,
        lineType = _ref.lineType,
        direction = _ref.direction,
        relName = _ref.relName;

    if (!item.uid && item.dataList) {
      return _objectSpread({}, edgeTypes[item.relId], {}, item, {
        label: relName + "(" + item.dataList.length + ")",
        style: {
          lineWidth: lineWidth || 1,
          stroke: lineColor || '#eee',
          lineDash: lineType === 'dashed' ? [5] : '',
          endArrow: direction ? {
            path: 'M 6,0 L -6,-6 L -6,6 Z',
            d: 6
          } : {}
        }
      });
    }

    return _objectSpread({}, edgeTypes[item.relId], {}, item, {
      label: item.label || item.text,
      style: {
        lineWidth: lineWidth || 1,
        stroke: lineColor || '#eee',
        lineDash: lineType === 'dashed' ? [5] : '',
        endArrow: direction ? {
          path: 'M 6,0 L -6,-6 L -6,6 Z',
          d: 6
        } : {}
      }
    });
  });
  setArcEdges(edges);
  return {
    nodes: nodes,
    edges: edges
  };
};
export default {
  defaultConfig: defaultConfig,
  handleGraphData: handleGraphData
};