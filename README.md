# 基于jQuery封装的滑动条插件
1. 面向对象封装
2. 用户可以通过设置config自定义css样式
3. 目前step还未实现
4. 兼容PC端和移动端

## demo

### 初始化插件
```
var range = new rangeUtil({
    // 指定父div
	father_box: $("div"),
	// 设置初始值
	defaultValue: 50,
	// 追加外部div的css
	// outer_css: {},
	// 编辑滑动条的css
	// range_css: {},
	// 编辑滑块的css
	// rangebox_css: {},
	min: 0, // 最小值
	max: 100, // 最大值
	type: 1 // 1 纵向 2 横向
});
```
### 得到值

```
range.getVal(); // 返回目前的百分比，可以修改插件返回相应的值
```

### 设置值

```
range.setVal(); // 返回目前的百分比，可以修改插件返回相应的值
```

### 注册回调事件
支持链式，能注册多个事件，返回值可以通过插件自行修改

```
range.registCallback(function (data){
    // dosomething    
}).registCallback(function (data){
    // dosomething  
})
```
### 效果图
![image](https://raw.githubusercontent.com/qn9301/rangeUtil/master/image/I%5BG2%7DQ)%7D8K2A%7DOT%242PCP%407R.png)