import G6 from '@antv/g6';

// 封装点击添加边的交互
G6.registerBehavior('click-add-edge', {
  // 设定该自定义行为需要监听的事件及其响应函数
  getEvents() {
    return {
      'node:click': 'onClick', // 监听事件 node:click，响应函数时 onClick
      mousemove: 'onMousemove', // 监听事件 mousemove，响应函数时 onMousemove
      'edge:click': 'onEdgeClick', // 监听事件 edge:click，响应函数时 onEdgeClick
      'canvas:click': 'onRightClick'
    };
  },
  onRightClick() {
    this.graph.removeItem(this.edge);
    this.edge = null;
    this.addingEdge = false;
  },
  // getEvents 中定义的 'node:click' 的响应函数
  onClick(ev) {
    const node = ev.item;
    const graph = this.graph;
    // 鼠标当前点击的节点的位置
    const point = { x: ev.x, y: ev.y };
    const model = node.getModel();
    if (this.addingEdge && this.edge) {
      graph.updateItem(this.edge, {
        target: model.id
      });

      this.edge = null;
      this.addingEdge = false;
      this.graph.setMode('select');
    } else {
      // 在图上新增一条边，结束点是鼠标当前点击的节点的位置
      this.edge = graph.addItem('edge', {
        id: new Date().getTime() + '',
        source: model.id,
        target: point
      });
      this.addingEdge = true;
    }
  },
  getOffset(num) {
    var curveOffset = 0;
    if (num % 2 > 0) {
      curveOffset = 0;
    } else {
      curveOffset = -15;
    }
    curveOffset = Math.floor(num / 2) * 30 + curveOffset;
    return {
      curveOffset: curveOffset - 30 * (num - 1) || 1,
      curvePosition: (num - 1) / num
    };
  },
  // getEvents 中定义的 mousemove 的响应函数
  onMousemove(ev) {
    // 鼠标的当前位置
    const point = { x: ev.x, y: ev.y };
    if (this.addingEdge && this.edge) {
      // 更新边的结束点位置为当前鼠标位置
      this.graph.updateItem(this.edge, {
        target: point
      });
    }
  },
  // getEvents 中定义的 'edge:click' 的响应函数
  onEdgeClick(ev) {
    const currentEdge = ev.item;
    // 拖拽过程中，点击会点击到新增的边上
    if (this.addingEdge && this.edge == currentEdge) {
      this.graph.removeItem(this.edge);
      this.edge = null;
      this.addingEdge = false;
    }
  }
});
