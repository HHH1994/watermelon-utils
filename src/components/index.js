import color from './color';
import string from './string';
import object from './object';
import engineering from './engineering';
import array from './array';
import time from './time';

// color 颜色
export { getRandomColor, toHex, RGBtoHEX, rgbToHex, hexToRgb, gradient } from './color';

// string 字符串
export { calcStrLen,fittingString,getQueryString } from './string';

// object 对象
export { isNullOrEmpty, containProperty, isEmptyObject } from './object';

// engineering 工程
export { debounce, throttle } from './engineering';

// array 集合数组
export { listToMap, listCountByColum} from './array';

// 时间格式化
export { parseTime, getLastDate } from './time';

export default { ...color, ...string, ...object, ...engineering,...array, ...time };
