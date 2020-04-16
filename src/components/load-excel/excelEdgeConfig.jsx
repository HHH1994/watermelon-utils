import React from 'react';
import { Select, Input } from 'antd';
import './loadExcel.less';

const { Option } = Select;
const ExcelEdgeConfig = (props) => {
  const { currentModel, excelData = [[]], configEdges } = props.LoadExcel;
  const {edgeTypes} = props;
  const { relId = {}, id } = currentModel;
  const { properties = [], relName } = edgeTypes[relId] || {};
  const configChange = (e, item, isFormat) => {
    if (isFormat) {
      props.LoadExcel.pushConfigEdges({ id, properties: [{ ...item, dataFormat: e }] });
    } else {
      props.LoadExcel.pushConfigEdges({ id, properties: [{ ...item, columns: [e] }] });
    }
  };
  const configChangeType = (e) => {
    props.LoadExcel.pushConfigEdges({ id }, e);
  };
  const config = configEdges.find((v) => v.id === id);

  const values = {};
  config &&
    config.properties &&
    config.properties.forEach((v) => {
      values[v.localName] = v;
    });
  return (
    <div className="demo-props">
      <div>
        <label>边类型</label>
        <div>
          <Select
            value={relName || ''}
            style={{ width: 200 }}
            onChange={(e) => configChangeType(e)}
          >
            {Object.values(edgeTypes).map((v) => (
              <Option key={v.relId}>{v.relName}</Option>
            ))}
          </Select>
        </div>
      </div>
      {properties.map((v) => {
        const { dataType } = v;
        const obj = values[v.localName] || {};
        return (
          <div key={v.localName}>
            <label>{v.displayName}</label>
            <div>
              <Select
                value={(obj.columns && obj.columns[0]) || ''}
                style={{ width: 200 }}
                onChange={(e) => configChange(e, v)}
              >
                {excelData.length ? excelData[0].map((v) => <Option key={v}>{v}</Option>) : null}
              </Select>
            </div>
            {(dataType === 'date' || dataType === 'datetime') && obj.columns && obj.columns[0] ? (
              <div>
                <label>{v.displayName}时间格式</label>
                <Input
                  value={obj.dataFormat || ''}
                  onChange={(e) => configChange(e.target.value, v, true)}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ExcelEdgeConfig;
