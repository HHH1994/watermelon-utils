import React from 'react';
import { Select, Input } from 'antd';
import './loadExcel.less';

const { Option } = Select;

class ExcelConfig extends React.Component {
    configChange = (e, item, isFormat) => {
        const { currentModel } = this.props.LoadExcel;
        const { id } = currentModel;
        if (isFormat) {
            this.props.LoadExcel.pushConfigNodes({ id, properties: [{ ...item, dataFormat: e }] });
        } else {
            this.props.LoadExcel.pushConfigNodes({ id, properties: [{ ...item, columns: [e] }] });
        }
    };

    render() {
        const { currentModel, excelData = [[]], configNodes } = this.props.LoadExcel;
        const { nodeTypes } = this.props;
        const { entId, id } = currentModel;
        const { properties = [] } = nodeTypes[entId] || {};
        const config = configNodes.find(v => v.id === id);
        const values = {};
        config &&
            config.properties &&
            config.properties.forEach(v => {
                values[v.localName] = v;
            });
        return (
            <div className="demo-props">
                {properties.map(v => {
                    const { dataType } = v;
                    const obj = values[v.localName] || {};
                    return (
                        <div key={v.localName}>
                            <label>{v.displayName}</label>
                            <div>
                                <Select
                                    value={(obj.columns && obj.columns[0]) || ''}
                                    style={{ width: 200 }}
                                    onChange={e => this.configChange(e, v)}
                                >
                                    {excelData.length
                                        ? excelData[0].map(v => <Option key={v}>{v}</Option>)
                                        : null}
                                </Select>
                            </div>
                            {(dataType === 'date' || dataType === 'datetime') &&
                            obj.columns &&
                            obj.columns[0] ? (
                                <div>
                                    <label>{v.displayName}时间格式</label>
                                    <Input
                                        value={obj.dataFormat || ''}
                                        onChange={e => this.configChange(e.target.value, v, true)}
                                    />
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default ExcelConfig;
