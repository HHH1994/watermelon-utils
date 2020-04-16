/**
 * list根据colum转obj并去重
 * @param {*} list 【{},{}】obj的集合
 * @param {*} colum 作为map的key的obj的一个字段名  默认是id
 * @return map
 */
export const listToMap = (list = [], colum = 'id') => {
    const map = {};
    (list || []).forEach(item => {
        map[item[colum]] = item;
    });
    return map;
};

/**
 * list根据colum计数
 * @param {*} list 【{},{}】obj的集合 比如[{id:'a'},{id:'b'},{id:'b'}]
 * @param {*} colum 作为map的key的obj的一个字段名  默认是id
 * @return map  比如{a:1,b:2}
 * [{id:'a',key:'xxx'},{id:'b'},{id:'b'}]经过listCountByColum后变成{a:1,b:2}
 */
export const listCountByColum = (list = [], colum = 'id') => {
    const map = {};
    (list || []).forEach(item => {
        map[item[colum]] = map[item[colum]] ? map[item[colum]] + 1 : 1;
    });
    return map;
};

export default { listToMap, listCountByColum };
