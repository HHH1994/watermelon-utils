import React from 'react';
import G6 from '@antv/g6';
import { Button, Input } from 'antd';
import g6Utils from './g6Utils';
import './loadExcel.less';
class Preview extends React.Component {
  state = {
    dataSource: '',
    mark: ''
  };
  componentDidMount() {
    const dom = document.getElementById('preview-graph');
    this.graph = new G6.Graph({
      container: 'preview-graph',
      width: dom.scrollWidth,
      height: dom.scrollHeight,
      layout: {
        type: 'grid',
        nodeSize: 48,
        preventOverlap: true,
        preventOverlapPadding: 100
      },
      ...g6Utils.defaultConfig
    });
    const { data } = this.props;
    const graphData = g6Utils.handleGraphData(data);
    this.graph.data(graphData);
    this.graph.render();
    this.graph.fitView(10);
  }

  componentWillUnmount() {
    this.graph.destroy();
  }
  save = () => {
    this.props.save(this.state);
  };
  render() {
    const { mark, dataSource } = this.state;
    return (
      <React.Fragment>
        <div id="preview-graph" style={{ height: 600 }}></div>
        <div className="mark">
          <span>如果要进行数图转换，建议填写</span>
          <div>
            <label>数据来源：</label>
            <Input
              value={dataSource}
              onChange={(e) => this.setState({ dataSource: e.target.value })}
            />
          </div>
          <div>
            <label>备注：</label>
            <Input.TextArea
              rows={3}
              value={mark}
              onChange={(e) => this.setState({ mark: e.target.value })}
            />
          </div>
        </div>
        <div className="load-excel-btns" style={{ textAlign: 'end' }}>
          <Button onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" onClick={this.save}>
            数图转换
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default Preview;
