import color from './color';
import string from './string';
import object from './object';
import engineering from './engineering';

// color 颜色
export { getRandomColor } from './color';
export { toHex } from './color';
export { RGBtoHEX } from './color';
export { rgbToHex } from './color';
export { hexToRgb } from './color';
export { gradient } from './color';

// string 字符串
export { calcStrLen } from './string';
export { fittingString } from './string';
export { getQueryString } from './string';

// object 对象
export { isNullOrEmpty } from './object';

// engineering 工程
export { debounce } from './engineering';

export default { ...color, ...string, ...object, ...engineering };
