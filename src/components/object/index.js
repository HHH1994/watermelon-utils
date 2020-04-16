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

export default { isNullOrEmpty };
