/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';
import { Modal, Upload, Icon, message, Button, Table } from 'antd';
import { saveAs } from 'file-saver';
import Graph from './excelGraph';
import Preview from './preview';

import './loadExcel.less';
class LoadExcel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            excelData: [],
            graphData: null,
            previewData: null,
            previewVisible: false,
            fileList: [],
        };
    }

    componentDidMount() {
        this.props.getEntTree();

        console.log('this.props======', this.props);
    }

    componentWillUnmount() {
        this.props.LoadExcel.clear();
    }

    saveConfig = () => {
        const { configNodes, configEdges } = this.props.LoadExcel;
        const str = JSON.stringify({ configNodes, configEdges });
        var blob = new Blob([str], {
            type: 'text/plain;charset=utf-8',
        });
        saveAs(blob, '配置.json');
    };

    saveByGraph = () => {
        const { configNodes, configEdges } = this.props.LoadExcel;
        // 补充source和target的type
        configEdges.forEach(v => {
            const { target, source } = v;
            const targetType = configNodes.find(v => v.id === target);
            const sourceType = configNodes.find(v => v.id === source);
            v.targetType = targetType;
            v.sourceType = sourceType;
        });
        const columsConfig = {};
        const [colums, ...list] = this.state.excelData;
        // 把表头处理一下
        colums.forEach((v, i) => {
            columsConfig[v] = i;
        });
        let nodes = {};
        const edges = [];
        const func = (a, p) => {
            return ['', ...p.columns].reduce((pre, next) => {
                return pre + a[columsConfig[next]];
            });
        };
        // 循环数据
        list.slice(0, 100).forEach(arr => {
            const tempsNode = {};
            // 循环node配置
            configNodes.forEach(nodeConfig => {
                const { properties, entId, id } = nodeConfig;
                // 取出entid存起来
                const node = { entId: entId };
                // 循环属性配置
                properties.forEach(p => {
                    // 属性 node【key是localname】【value是数据中columns对应的】
                    node[p.localName] = func(arr, p);
                    // 把主键当id
                    if (p.isPk) {
                        node.id = func(arr, p); // mock数据无法保证id唯一。先用new Date().getTime()测试
                    }
                    // 把title当label
                    if (p.isTitle) {
                        node.label = func(arr, p);
                    }
                });
                // 把node临时存在本次循环，以供edge配置循环时使用
                tempsNode[id] = node;
                nodes[node.id] = node; // 用id去重并存起来
            });
            // 循环edge配置
            configEdges.forEach(edgeConfig => {
                const { properties, source, target } = edgeConfig;
                // 取出relid存起来
                const edge = { relId: edgeConfig.relId };
                // 循环属性配置
                properties.forEach(p => {
                    // 属性 edge【key是localname】【value是数据中columns对应的】
                    edge[p.localName] = func(arr, p);
                    // 把主键当id
                    if (p.isPk) {
                        edge.id = func(arr, p);
                    }
                    if (p.isTitle) {
                        edge.label = func(arr, p);
                    }
                });
                // 找到临时存储的node中对应的target，source
                edge.target = tempsNode[source].id;
                edge.source = tempsNode[target].id;
                // 存起来
                edge.target && edge.source && edges.push(edge);
            });
        });
        nodes = Object.values(nodes);
        // setPreview({ nodes, edges });
        // setVisible(true);
        this.setState({
            previewData: { nodes, edges },
            previewVisible: true,
        });
    };

    setVisible = value => {
        this.setState({ previewVisible: value });
    };

    dataToGraph = ({ dataSource, mark }) => {
        const { configNodes, configEdges } = this.props.LoadExcel;
        // nodeid text作为新字段传给后端
        const tempNodes = configNodes.map(item => {
            const propList = [...item.properties];
            propList.forEach(item => {
                if (item.isPk) {
                    propList.push({
                        ...item,
                        localName: 'nodeId',
                    });
                }
                if (item.isSecondPk) {
                    propList.push({
                        ...item,
                        localName: 'secondNodeId',
                    });
                }
                if (item.isTitle) {
                    const index = propList.findIndex(v => v.localName === 'text');
                    if (index >= 0) {
                        propList[index].columns.push(...item.columns);
                    } else {
                        propList.push({
                            ...item,
                            localName: 'text',
                        });
                    }
                }
            });
            return {
                ...item,
                properties: propList,
            };
        });
        const tempEdges = configEdges.map(item => {
            const propList = [...item.properties];
            propList.forEach(item => {
                if (item.isTitle) {
                    const index = propList.findIndex(v => v.localName === 'text');
                    if (index >= 0) {
                        propList[index].columns.push(...item.columns);
                    } else {
                        propList.push({
                            ...item,
                            localName: 'text',
                        });
                    }
                }
            });
            return {
                ...item,
                direction: this.props.edgeTypes[item.relId].direction,
                properties: propList,
            };
        });
        const params = {
            ids: this.state.fileList.map(v => v.response.data.id),
            source: dataSource,
            memo: mark,
            config: { configNodes: tempNodes, configEdges: tempEdges },
        };
        this.props.LoadExcel.dataToGraph(params, () => this.setState({ previewVisible: false }));
    };
    render() {
        // 导入excel的upload
        const prop = {
            name: 'files',
            action: '/api/file/upload',
            multiple: true,
            accept: '.xls,.xlsx,.csv',
            onChange: ({ file, fileList }) => {
                if (file.status === 'done') {
                    this.setState({
                        excelData: fileList[0].response.data.data,
                        fileList,
                    });
                    this.props.LoadExcel.setExcelData(fileList[0].response.data.data);
                    message.success(`${file.name} 上传成功`);
                } else if (file.status === 'error') {
                    message.error(`${file.name} 上传失败`);
                }
            },
        };
        const loadProp = {
            name: 'file',
            action: '/',
            accept: 'application/json',
            beforeUpload: file => {
                if (file.size > 20 * 1024 * 1024) {
                    message.warn('文件不得超过20M！');
                    return false;
                }

                const reader = new FileReader();
                reader.addEventListener(
                    'load',
                    () => {
                        const { result } = reader;
                        const data = JSON.parse(result);
                        const { configNodes, configEdges } = data;
                        configNodes.forEach(config => {
                            config.properties = config.properties.filter(
                                v => v.localName !== 'nodeId' && v.localName !== 'text'
                            );
                        });
                        configEdges.forEach(config => {
                            config.properties = config.properties.filter(
                                v => v.localName !== 'text'
                            );
                        });
                        this.props.LoadExcel.setNodeAndEdgeConfig(data);
                        // setGraphData(data);
                        this.setState({ graphData: data });
                    },
                    false
                );
                reader.readAsText(file);
                return false;
            },
        };
        const { excelData, graphData, previewVisible, previewData } = this.state;
        // 第一行作为表头
        const columns = excelData.length
            ? excelData[0].map(v => ({
                  title: v,
                  key: v,
                  dataIndex: v,
                  ellipsis: true,
                  width: 200,
              }))
            : [];

        const dataSource = excelData
            .filter((v, i) => i !== 0) // 第一行作为表头
            .map(v => {
                const row = {};
                columns.forEach((item, i) => {
                    row[item.title] = v[i];
                });
                return row;
            });

        // return (
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
        return (
            <div>
                <div className={`upload ${excelData.length > 0 ? '' : 'center'}`}>
                    <Upload {...prop}>
                        <Button size="small">
                            <Icon type="upload" /> 点击上传
                        </Button>
                    </Upload>
                </div>

                {dataSource.length ? (
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        size="small"
                        pagination={false}
                        scroll={{ x: 1500, y: 150 }}
                    />
                ) : null}
                {dataSource.length ? (
                    <div className="load-excel-demo">
                        <Graph
                            graphData={graphData}
                            nodeTypes={this.props.nodeTypes}
                            edgeTypes={this.props.edgeTypes}
                            LoadExcel={this.props.LoadExcel}
                            entTree={this.props.entTree}
                        />
                    </div>
                ) : null}
                {dataSource.length ? (
                    <div className="load-excel-btns" style={{ textAlign: 'end' }}>
                        <Button onClick={this.props.onCancel}>取消</Button>
                        <Upload {...loadProp} className="load-json">
                            <Button type="primary">导入配置</Button>
                        </Upload>
                        <Button type="primary" onClick={this.saveConfig}>
                            保存配置
                        </Button>
                        <Button type="primary" onClick={this.saveByGraph}>
                            预览
                        </Button>
                    </div>
                ) : null}
                {previewData ? (
                    <Modal
                        title={'预览'}
                        visible={previewVisible}
                        onOk={() => this.setVisible(false)}
                        onCancel={() => this.setVisible(false)}
                        width={'80%'}
                        footer={null}
                        style={{ top: 10 }}
                    >
                        <Preview
                            data={this.previewData}
                            save={this.dataToGraph}
                            onCancel={() => this.setVisible(false)}
                        />
                    </Modal>
                ) : null}
            </div>
        );
    }
}

export default LoadExcel;
