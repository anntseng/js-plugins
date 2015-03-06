# div 模拟滚动条
## 使用示例：
### HTML：
<pre>
<code>
&lt;div class = "wrap"&gt; 
  &lt;div class = "sb" id = "content"&gt;...&lt;/div&gt;
&lt;/div&gt;
&lt;div class = "wrap"&gt; 
  &lt;div class = "nb"&gt;...&lt;/div&gt;
&lt;/div&gt;
</code>
</pre>
### CSS：
<pre>
<code>
.wrap{
  position : relative;
  overflow : hidden;
  ...
}
.sb, .nb{
  position : absolute;
  z-index : 1;
  width : 100%;
  ...
}
</code>
</pre>
### JS:
<pre>
<code>
//滚动条样式配置
var Config = {
	width : 10,         //滚动轴的宽度，默认为10px
	color : "#24211F",  //滚动条的颜色
	bgColor : "#585858",//滚动轴的背景颜色
	bgBorder : "#393939",//边框颜色
	arrColor : "#000",   //上下箭头的颜色
	stepLength : 50      //滚动一步的长度
};
//调用
scrollBar({config : Config, block : "div.sb"});
//scrollBar({config : Config, block : "div#content"});
</code>
</pre>
