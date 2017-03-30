# UI-gesture
## 思路
### 前言
* 因为以前从来没有做过移动端的项目,自己在网上查到了一篇文章,[移动前端开发之viewport的深入理解](http://www.cnblogs.com/2050/p/3877280.html)加深了自己对viewport的理解.
* 由于自己最近刚刚学习vue,就想拿vue来做这个项目,但是最后发现虽然用了vue,但是没有体现出vue的数据驱动这个特点.不过,基本指令算是熟练了.
* 本来想用flex来画9个圆圈,但是后来还是用了canvas.因为用flex,原点也不好计算,而且是固定值.
### 属性及函数
#### 属性值
![](http://i2.muimg.com/567571/5b6011378d6842db.png)
* Pointarr:数组,保存的是9个圆心的坐标.
* resarr: 数组,保存的是密码的走势.
* resarr2: 数组,在设置密码时,判断resarr2是否等于resarr来判断两次密码是否一样
#### init函数
在Vue的mounted的函数里执行,相当于流程的开始.
####creatPoint函数
算出了9个圆圈的圆心位置.
#### addevent函数
添加了三个事件touchstart,touchmove,touchend
#### judge函数
遍历9个圆,判断当前位置是否在此圆圈内(通过两点间距离),若在此圆内则向resarr数组push当前圆的index.
#### Draw函数
利用touchPoint是否为null来画最后一条线.
然后通过canvas来画9个圆
函数流程