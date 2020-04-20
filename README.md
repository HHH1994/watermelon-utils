# bywin 公用函数 
文档描述了函数作用，具体使用和参数说明详见源码

## 示例
```js
import { getRandomColor } from 'bywin-public-function';

const color = getRandomColor();

// or
import bywin from 'bywin-public-function';

const color = bywin.getRandomColor();


```

-----

## 目录
> - ## [string 字符串](#string)
> - ## [object 对象](#object)
> - ## [array 集合数组](#array)
> - ## [engineering 工程](#engineering)
> - ## [color 颜色](#color)


> - ## [开发打包发布](#work)

-----
## <span id="string">string 字符串</span>    [<源码>][string]
- calcStrLen :
计算字符串的长度
- fittingString :
计算显示的字符串（省略掉过长的用...代替）
- getQueryString :
获取参数

------------------------
## <span id="object">object 对象</span>     [<源码>][object]
- isNullOrEmpty :
判空

-------------------
## <span id="array">array 集合数组</span>       [<源码>][array]
- listToMap  :
list根据colum转obj并去重
- listCountByColum :
list根据colum计数

------------------------
##  <span id="engineering">engineering 工程</span>      [<源码>][engineering]
- debounce :
防抖

-----
## <span id="color">color 颜色</span>    [<源码>][color]
- getRandomColor :
十六进制颜色随机
- toHex :
将十进制数字转换成两位十六进制字符串
- RGBtoHEX :
将rgb()格式颜色转换成大写十六机制字符串（#C0C0C0），如果已经是十六进制则直接输出
- rgbToHex :
rgb to hex
- hexToRgb :
hex to rgb
- gradient :
计算渐变过渡色



# <span id="work">开发</span>
git下来代码在src/components里开发。
在src/components/index里export
# 打包
```js
npm run build:commonjs                                                               
npm run build:esm
```
# 发布
git push

# 安装 
在 package.json 中加上
```js
"bywin-public-function":"git+http://你的账号:你的密码@code.bywin.cn/bywin-components/bywin-public-function.git"
```

然后 cnpm i 安装



[color]:http://code.bywin.cn/bywin-components/bywin-public-function/src/master/src/components/color/index.js
[string]:http://code.bywin.cn/bywin-components/bywin-public-function/src/master/src/components/string/index.js
[object]:http://code.bywin.cn/bywin-components/bywin-public-function/src/master/src/components/object/index.js
[array]:http://code.bywin.cn/bywin-components/bywin-public-function/src/master/src/components/array/index.js
[engineering]:http://code.bywin.cn/bywin-components/bywin-public-function/src/master/src/components/engineering/index.js