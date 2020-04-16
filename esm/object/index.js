/**
 * 
 * @param {*} obj 
 */
export var isNullOrEmpty = function isNullOrEmpty(obj) {
  if (!obj || obj.length === 0) {
    return true;
  }

  if (obj instanceof Object) {
    for (var k in obj) {
      if (obj[k]) {
        return false;
      }
    }

    return true;
  }

  return false;
};
export default {
  isNullOrEmpty: isNullOrEmpty
};