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
