/* eslint-disable react/no-find-dom-node */
import React from 'react';
import { Row, Button, Tree } from 'antd';
import _ from 'lodash';
import ExcelConfig from './excelConfig';
import ExcelEdgeConfig from './excelEdgeConfig';
import g6Utils from './g6Utils';
import G6 from '@antv/g6';

import './addEdge';

const { TreeNode } = Tree;


class ExcelGraph extends React.Component {
  state = { config: 'node' };
  componentDidMount() {
    const dom = document.getElementById('demo-graph');
    this.graph = new G6.Graph({
      container: 'demo-graph',
      width: dom.scrollWidth,
      height: dom.scrollHeight,
      ...g6Utils.defaultConfig,
      modes: {
        default: ['drag-canvas', 'drag-node'],
        clickAddEdge: ['click-add-edge'],
        select: ['drag-node', 'drag-canvas']
      }
    });
    // 拖拽生成node
    this.graph.on('canvas:mouseup', this.addNode);
    // 选中node 展示node属性提供选择
    this.graph.on('node:click', this.setConfig);
    // 选中edge 展示edge属性提供选择
    this.graph.on('edge:click', this.setConfigByEdge);
    // 重置模式
    this.graph.on('canvas:click', () => {
      this.graph.setMode('select');
    });
    // 鼠标经过时edge变粗
    this.graph.on('edge:mouseenter', (evt) => {
      var edge = evt.item;
      this.graph.updateItem(edge, {
        ...edge._cfg.model,
        style: { lineWidth: 3 }
      });
    });
    // 鼠标离开时edge恢复
    this.graph.on('edge:mouseleave', (evt) => {
      var edge = evt.item;
      this.graph.updateItem(edge, {
        ...edge._cfg.model,
        style: { lineWidth: 1 }
      });
    });
  }

  UNSAFE_componentWillReceiveProps(next) {
    // 接受导入的配置 生成graph
    if (!_.isEqual(next.graphData, this.props.graphData)) {
      const { configNodes: nodes, configEdges: edges } = next.graphData;
      this.graph.changeData(g6Utils.handleGraphData({ nodes, edges }));
      this.graph.refresh();
    }
  }

  // 拖拽生成node
  addNode = (event) => {
    const { isDrag, currentNodeType } = this.state;

    if (isDrag) {
      const model = {
        id: new Date().getTime() + '',
        x: event.x,
        y: event.y,
        entId: currentNodeType.entId,
        // shape: 'image',
        icon: {
          show: true,
          img: `/api/graph/previewIcon/${currentNodeType.iconId}`,
          width: 36,
          height: 36
        },
        label: currentNodeType.entName + this.graph.getNodes().length
      };
      this.graph.addItem('node', model);
    }
    this.setState({ isDrag: false });
  };

  // 清空node和edge的选中状态，选中当前的node或edge
  reSetSelected = (item) => {
    const selectedNodes = this.graph.findAllByState('node', 'selected');
    selectedNodes.forEach((node) => {
      this.graph.setItemState(node, 'selected', false);
    });
    const selectedEdges = this.graph.findAllByState('edge', 'selected');
    selectedEdges.forEach((node) => {
      this.graph.setItemState(node, 'selected', false);
    });
    item && this.graph.setItemState(item, 'selected', true);
  };

  //展示node属性，提供选择
  setConfig = (event) => {
    const { item } = event;
    const model = item.getModel();
    this.props.LoadExcel.setCurrentModel(model);
    this.props.LoadExcel.setConfigNodes(model);
    this.reSetSelected(item);
    this.setState({ config: 'node' });
  };

  //展示edge属性，提供选择
  setConfigByEdge = (event) => {
    const { item } = event;
    const model = item.getModel();
    this.props.LoadExcel.setCurrentModel(model);
    this.props.LoadExcel.setConfigEdges(model);
    this.reSetSelected(item);
    this.setState({ config: 'edge' });
  };

  //开始拖拽
  onMouseDown = (e, type) => {
    this.setState({ isDrag: true, currentNodeType: type });
  };

  // 删除节点
  del = () => {
    const selectedNodes = this.graph.findAllByState('node', 'selected');
    if (selectedNodes.length) {
      const item = selectedNodes[0];
      const model = item.getModel();
      this.props.LoadExcel.delConfigNodes({ id: model.id });
      const arr = item.getEdges();
      arr.forEach((v) => this.graph.removeItem(v));
      this.graph.removeItem(item);
    } else {
      const selectedEdge = this.graph.findAllByState('edge', 'selected');
      const item = selectedEdge[0];
      const model = item.getModel();
      this.props.LoadExcel.delConfigEdges({ id: model.id });
      this.graph.removeItem(item);
    }
  };

  // 进入新增edge模式
  link = () => {
    if (this.graph.getCurrentMode() !== 'clickAddEdge') {
      this.graph.setMode('clickAddEdge');
    }
  };

  changeNode = (id, label) => {
    this.updateItem(id, {
      label
    });
  };

  render() {
    const { entTree } = this.props;
    return (
      <Row className="excel-config">
        <div className="demo-graph">
          <div className="node-type">
            {entTree && (
              <Tree showIcon={true} onDragStart={() => false}>
                {/* <TreeNode key={entTree.entId} title={entTree.entName}> */}
                {entTree.children.map((child) => {
                  return (
                    <TreeNode
                      icon={
                        child.iconId ? (
                          <img
                          alt=""
                            width="20"
                            height="20"
                            src={`/api/graph/previewIcon/${child.iconId}`}
                          />
                        ) : null
                      }
                      key={child.entId}
                      title={child.entName}
                    >
                      {child.children.map((v) => {
                        return (
                          <TreeNode
                            icon={
                              v.iconId ? (
                                <img
                                alt=""
                                  width="20"
                                  height="20"
                                  src={`/api/graph/previewIcon/${v.iconId}`}
                                  onMouseDown={(e) => this.onMouseDown(e, v)}
                                  onSelectStart={() => false}
                                />
                              ) : null
                            }
                            key={v.entId}
                            title={
                              <span
                                className="tree-title"
                                onMouseDown={(e) => this.onMouseDown(e, v)}
                                onSelectStart={() => false}
                              >
                                {v.entName}
                              </span>
                            }
                          ></TreeNode>
                        );
                      })}
                    </TreeNode>
                  );
                })}
                {/* </TreeNode> */}
              </Tree>
            )}
          </div>
          <div id="demo-graph"></div>
          {this.state.config === 'node' ? (
            <ExcelConfig onChange={this.changeNode} nodeTypes={this.props.nodeTypes} LoadExcel={this.props.LoadExcel}/>
          ) : (
            <ExcelEdgeConfig edgeTypes={this.props.edgesTypes} LoadExcel={this.props.LoadExcel}/>
          )}

          <div className="tools">
            <Button icon="close" onClick={this.del}></Button>
            <Button icon="edit" onClick={this.link}></Button>
          </div>
        </div>
      </Row>
    );
  }
}

export default ExcelGraph;
