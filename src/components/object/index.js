/**
 * 
 * @param {*} obj 
 */
export const isNullOrEmpty = obj => {
    if (!obj || obj.length === 0) {
        return true;
    }
    if (obj instanceof Object) {
        for (let k in obj) {
            if (obj[k]) {
                return false;
            }
        }
        return true;
    }
    return false;
};

/**
 * 判断对象中是否存在某个属性
 * @param {*} property 属性名
 * @param {*} obj 对象
 */
export const containProperty = (property, obj) => {
    // 控制传参有效性
    if (typeof obj !== 'object') {
        throw new Error('obj必须为一个对象');
    }

    if (typeof property !== 'string' || typeof property !== 'symbol') {
        throw new Error('property必须为String或者Symbol');
    }

    // 判断非继承属性
    if (obj.hasOwnProperty(property)) {
        return true;
    }

    return property in obj;
};

/**
 * 判断对象是否为空
 * @param {*} obj 带判断的对象 
 */
export const isEmptyObject = (obj) => {
    // ES6
    if (Object.keys) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    return Object.prototype.toString.call(obj) === '[object Object]' && JSON.stringify(obj) === '{}';
    
}

/**
 * 判断输入值类型
 * @param {*} obj 
 */
export const typeOf = (obj) => {
    const tostring = Object.prototype.toString();
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Object]': 'object',
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object RegExp]': 'regExp'
    };
    return map[tostring.call(obj)];
}
export default { isNullOrEmpty, containProperty, isEmptyObject, typeOf};
