# div 模拟滚动条
## 使用示例：
### HTML：
<pre>
<code>
&lt;div class = "wrap"&gt; 
  &lt;div class = "sb"&gt;...&lt;/div&gt;
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
var Config = {
	width : 10,
	color : "#24211F",
	bgColor : "#585858",
	bgBorder : "#393939",
	arrColor : "#000",
	stepLength : 50
};
scrollBar({config : Config1, block : "div.sb"});
</code>
</pre>
