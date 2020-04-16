/**
 *  //十六进制颜色随机
 */
export const getRandomColor = () => {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
};


/**
 * //将十进制数字转换成两位十六进制字符串
 * @param {*} N 十进制数字
 */
export const toHex = N => {
    if (N === null) return '00';
    N = parseInt(N);
    if (N === 0 || isNaN(N)) return '00';
    N = Math.max(0, N);
    N = Math.min(N, 255);
    N = Math.round(N);
    return '0123456789ABCDEF'.charAt((N - (N % 16)) / 16) + '0123456789ABCDEF'.charAt(N % 16);
};

/**
//将rgb()格式颜色转换成大写十六机制字符串（#C0C0C0），如果已经是十六进制则直接输出
 * 
 * @param {*} str rgb()格式颜色
 */
export const RGBtoHEX = str => {
    if (str.substring(0, 3) === 'rgb') {
        var arr = str.split(',');
        var r = arr[0].replace('rgb(', '').trim(),
            g = arr[1].trim(),
            b = arr[2].replace(')', '').trim();
        var hex = [toHex(r), toHex(g), toHex(b)];
        return '#' + hex.join('');
    } else {
        return str;
    }
};

/**
// rgb to hex
 * 
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
export const rgbToHex = (r, g, b) => {
    var hex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
};

/**
// hex to rgb
 * 
 * @param {*} hex 
 */
export const hexToRgb = hex => {
    var rgb = [];
    for (var i = 1; i < 7; i += 2) {
        rgb.push(parseInt('0x' + hex.slice(i, i + 2)));
    }
    return rgb;
};

/**
// 计算渐变过渡色
 * 
 * @param {*} startColor 
 * @param {*} endColor 
 * @param {*} step 
 */
export const gradient = (startColor, endColor, step) => {
    // 将 hex 转换为rgb
    var sColor = hexToRgb(startColor),
        eColor = hexToRgb(endColor);

    // 计算R\G\B每一步的差值
    var rStep = (eColor[0] - sColor[0]) / step;
    var gStep = (eColor[1] - sColor[1]) / step;
    var bStep = (eColor[2] - sColor[2]) / step;

    var gradientColorArr = [];
    for (var i = 0; i < step; i++) {
        // 计算每一步的hex值
        gradientColorArr.push(
            rgbToHex(
                parseInt(rStep * i + sColor[0]),
                parseInt(gStep * i + sColor[1]),
                parseInt(bStep * i + sColor[2])
            )
        );
    }
    return gradientColorArr;
};

export default { getRandomColor, toHex, RGBtoHEX, rgbToHex, hexToRgb, gradient };
