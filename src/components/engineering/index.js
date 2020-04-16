/**
 * 防抖
 * @param {*} fn 函数
 * @param {*} delay 延时
 */
export const debounce = (fn, delay) => {
    let timer = null;
    return () => {
        timer && clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
};
export default { debounce };
