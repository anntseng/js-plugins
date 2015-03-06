/**
* div模拟滚动条
* @author zhengyy3@ucweb.com  ## 1152781715@qq.com
* @date 2015/01/22
* @version 1.0
* @dependencies none
*/
(function(window){
	
	var Utils = {
		addEvent : function(element, type, handler){
			if(element.addEventListener){
				element.addEventListener(type, handler, false);
				this.addEvent = function(element, type, handler){
					element.addEventListener(type, handler, false);
				};
			}
			else if(element.attachEvent){
				element.attachEvent("on" + type, handler);
				this.addEvent = function(element, type, handler) {
					element.attachEvent("on" + type, handler);
				};
			}
			else{
				element["on" + type] = handler;
				this.addEvent = function(element, type, handler){
					element["on" + type] = handler;
				};
			}
		},
		getStyle : function(box, style){
			return box.currentStyle ? box.currentStyle[style] : document.defaultView.getComputedStyle(box, false)[style];
		},
		getByTag : function(tag){
			return document.getElementsByTagName(tag);
		},
		getById : function(id){
			return document.getElementById(id);
		},
		getByClass : function(searchClass, node, tag){
			var result = [];
			if(document.getElementsByClassName){ 
				var nodes = (node || document).getElementsByClassName(searchClass),
					nleng = nodes.length, 
					i = 0;
				while(i < nleng){
					node = nodes[i++];
					if(tag !== "*" && node.tagName === tag.toUpperCase()){ 
						result.push(node);
					}
					else{ 
						result.push(node);
					} 
				}
			}
			else{ 
				node = node || document; 
				tag = tag || "*"; 
				var classes  = searchClass.split(" "), 
					elements = (tag === "*" && node.all) ? node.all : node.getElementsByTagName(tag), 
					claCount = classes.length,
					eleCount = elements.length,
					patterns = [], current, match; 
				while(--claCount >= 0){ 
					patterns.push(new RegExp(classes[claCount])); 
				} 
				while(--eleCount >= 0){ 
					current = elements[eleCount]; 
					match = false; 
					for(var k=0; k<patterns.length; k++){ 
						match = patterns[k].test(current.className); 
						if(!match){
							break;
						}
					}
					if(match){
						result.push(current);
					}
				} 
			} 
			return result; 
		},
		simpleSelect : function(selector){
			var tag, searVal, result = [];
			if(/\./g.test(selector)){
				tag = selector.split(".")[0];
				searVal = selector.split(".")[1];
				result = Utils.getByClass(searVal, document, tag);
			}
			else if(/#/g.test(selector)){
				searVal = selector.split("#")[1];
				result[0] = Utils.getById(searVal);
			}
			else{
				tag = selector;
				result = Utils.getByTag(tag);
			}
			return result;
		},
		mousescroll : function(obj, fn){
			var roll = function(){
				var e = arguments[0],
					delta = 0;
				delta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
				fn(e, delta);
			};
			if(window.netscape){ //FireFox
				this.addEvent(obj, "DOMMouseScroll", roll);
			}
			else{
				this.addEvent(obj, "mousewheel", roll);
			}
		},
		mousehold : function(obj, fn){
			var leave = false, 
				timer;
			Utils.addEvent(obj, "mousedown", function(e){
				var e = e ? e : window.event || arguments[0],
					target = e.target ? e.target : e.srcElement;
				timer = setInterval(function(){
					fn(target);
				}, 100);
			});
			Utils.addEvent(document, "mouseup", function(){
				clearInterval(timer);
			});
			Utils.addEvent(obj, "mouseleave", function(){
				leave = true;
				clearInterval(timer);
			});
			Utils.addEvent(obj, "mouseout", function(){ // Safari
				if(leave){
					return;
				}
				else{
					clearInterval(timer);
				}
			});
		}
	};
	
	var Axis = function(options){ //滚动轴
		var that = this;
		that.contentBox = options.contentBox || {};
		that.container  = that.contentBox.parentNode || document.createElement("DIV");
		that.axisConfig = options.config;
	};
	Axis.prototype = {
		constructor : Axis,
		init : function(){
			var that    = this,
				axisObj = document.createElement("DIV");
			axisObj.className = "scrollBar";
			that.container.appendChild(axisObj);	
			that.render(axisObj, that.axisConfig);
			Utils.addEvent(axisObj, "click", function(){
				that._click(window.event || arguments[0]);
			});
		},
		_click : function(e){ //滚动轴点击事件
			var that   = this,
				target = e.target ? e.target : e.srcElement,
				xlass  = target.className;		
		
			if(xlass !== "scrollBar"){
				return;
			}	
			var	barObj    = target.children[0],
				conMaxTop = parseInt(that.contentBox.getAttribute("data-max")),
				barMaxTop = parseInt(barObj.getAttribute("data-max")),
				barSteps  = parseFloat(barObj.getAttribute("data-steps")),
				conSteps  = parseFloat(that.contentBox.getAttribute("data-steps")),
				clickY    = e.clientY - that.container.getBoundingClientRect().top,
				barCurPos, conCurPos;

			barCurPos = (clickY <= barMaxTop ? clickY : barMaxTop);
			conCurPos = barCurPos / barSteps * conSteps;
			conCurPos = conCurPos <= conMaxTop ? conCurPos : conMaxTop;	
			that.contentBox.style.top = -conCurPos + "px";
			barObj.style.top = barCurPos + "px";
		},
		render : function(obj, configs){ //滚动轴样式
			var _css = "position: absolute;z-index: 1;top: 0px;right: 0px;height: 100%;border-width: 0px 1px;border-style: solid;"
					 + "width:" + (configs.width - 2 || 8) + "px;"
					 + "background-color:" + (configs.bgColor || "rgb(145, 138, 136)") + ";"
					 + "border-color:" + (configs.bgBorder || configs.bgColor || "rgb(145, 138, 136)") + ";";
			obj.style.cssText = _css;
		}
	};
	
	var Handle = function(options){ //滚动条
		var that = this;
		that.options    = options;
		that.contentBox = options.contentBox || {};
		that.barConfig  = options.config || {}; 
		that.container  = that.contentBox.parentNode || document.createElement("DIV"); //滚动可视区域（容器）		
		that.conStepLen = that.barConfig.stepLength || 50; //内容滚动一次的距离，默认50px
		that.contentBox.setAttribute("data-index", options.index);
		that.contentBox.setAttribute("data-steps", that.conStepLen);
	};
	Handle.prototype = {
		constructor : Handle,
		init : function(){
			var that = this,
				barObj = that.contentBox.nextElementSibling || that.contentBox.nextSibling,
				handleObj = document.createElement("DIV");
			if(!barObj){
				return;
			}
			handleObj.className = "barHandle";
			barObj.appendChild(handleObj);
			
			that.render(handleObj, that.barConfig);
			that.calculate(that.contentBox);
			that.drag(handleObj);
			that.scroll(handleObj);
		},
		calculate : function(content){ //计算滚动条高度、步长及滚动所需的参数
			var container  = content.parentNode,
				handleObj  = (content.nextElementSibling || content.nextSibling).children[0],
				conStepLen = parseInt(content.getAttribute("data-steps")),       
				idx        = parseInt(content.getAttribute("data-index")),
				visible    = container.offsetHeight, //可视区域的高度
				total      = content.offsetHeight,//内容的高度（包含被隐藏部分）
				barHeight  = visible / total * (visible - 16), //计算滚动条的高度（height）
		        maxCon     = total - visible, //内容top的最大值
		        maxTop     = parseInt(Math.abs(visible - barHeight)) - 8,//滚动条top的最大值
		      barStepLen   = maxTop / (maxCon / conStepLen); //滚动条滚动一次的距离
				
			if(maxCon <= 0){
				handleObj.parentNode.style.display = "none";
			}
			else{
				handleObj.parentNode.style.display = "block";
			}
			
			handleObj.style.height = barHeight + "px";
			handleObj.style.top = "8px";
			content.style.top = 0;

			handleObj.setAttribute("data-max", maxTop);
			handleObj.setAttribute("data-steps", barStepLen);
			content.setAttribute("data-max", maxCon);

			scrollBar.params[idx] = { //存储可变参数
				barHeight  : barHeight,  //滚动条高度
				maxCon     : maxCon,	 //内容top的最大值
				maxTop     : maxTop,	 //滚动条top的最大值
				barStepLen : barStepLen  //滚动条滚动一次的距离
			};
		},
		drag : function(obj){ //滚动条拖拽事件
			var	that = this,
				Flag = {
					top : "0px",  //滚动条与轴的相对位置
					currentY : 0, //鼠标的位置
					drop : false  //标记拖拽开始
				},
				param = {};
			function start(e){ //拖拽开始
				var _e = e ? e : window.event || arguments[0];
				//禁止页面文本选中
				if(_e.target && typeof _e.target.style.MozUserSelect !== "undefined"){ //FireFox
					_e.target.style.MozUserSelect = "none"; 
				}
				else{
					document.onselectstart = function(){ //others
						return false;
					};
				}
				Flag.drop = true;
				Flag.currentY = _e.clientY;
				Flag.top = Utils.getStyle(obj, "top");
				param = scrollBar.params[that.options.index];
			}
			function end(){ //拖拽结束
				Flag.drop = false;
			}
			function move(e){ //拖拽中
				var _e = e ? e : window.event || arguments[0];
				
				if(Flag.drop){
					var disY = _e.clientY - Flag.currentY,
						_top = parseInt(Flag.top ) + disY, //计算滚动条位置
						cTop  = that.conStepLen / param.barStepLen * _top; //计算内容显示位置
					if(_top < 8){ //拖拽已到顶部
						_top = 8;
						cTop = 0;
					}
					if(_top > param.maxTop){ //拖拽已到底部
						_top = param.maxTop;
						cTop = param.maxCon;
					}
					obj.style.top  = _top + "px";
					that.contentBox.style.top = -cTop + "px";
				}
				else{
					return;
				}
			}
			Utils.addEvent(obj, "mousedown", start);
			Utils.addEvent(document, "mouseup", end);
			Utils.addEvent(document, "mousemove", move);
		},
		scroll : function(obj){ //鼠标滚动事件
			var that = this;
			function scrolling(e, delta){
				var param = scrollBar.params[that.options.index];
				e.preventDefault ? e.preventDefault() : (e.returnValue = false); //取消默认的鼠标滚动事件
				var _offsetTop = obj.offsetTop,
					curBar = _offsetTop - (delta * param.barStepLen), //当前滚动条的位置
					curCon = -that.contentBox.offsetTop - (delta * that.conStepLen); //当前内容的位置
				if((_offsetTop === 0 && delta === 1) || (_offsetTop >= param.maxTop && delta === -1)){ //滚动条已到顶端或底端
					return;
				}	
				
				if(curBar < 8 || curCon < 0){ //滚动已到顶部
					curBar = 8;
					curCon = 0;
				}
				else if(curBar > param.maxTop || curCon > param.maxCon){ //滚动已到底部
					curBar = param.maxTop;
					curCon = param.maxCon;
				}
				obj.style.top = curBar + "px";
				that.contentBox.style.top = -curCon + "px";
			}
			
			Utils.mousescroll(that.container, scrolling);
		},
		render : function(obj, configs){ //滚动条样式
			var _css = "position: absolute;z-index: 2;top: 8px;right: 1px;border-radius: 2px;"
					 + "width:" + (configs.width - 4 || 6) + "px;" 
					 + ";background-color:" + configs.color || "#5E5959"
					 + ";";
			obj.style.cssText = _css;
		}
	};

	var Arrow = function(options){ //滚动轴上下两个箭头
		var that = this;
		that.contentBox  = options.contentBox || {};
		that.arrowConfig = options.config || {};
		that.container   = that.contentBox.parentNode || document.createElement("DIV");
	};
	Arrow.prototype = {
		constructor : Arrow,
		init : function(){
			var barObj  = this.contentBox.nextElementSibling || this.contentBox.nextSibling,
				upObj   = document.createElement("button"),
				downObj = document.createElement("button");
			upObj.className = "upRoll arrows";
			downObj.className = "downRoll arrows";
			upObj.setAttribute("type", "button");
			downObj.setAttribute("type", "button");
			barObj.appendChild(upObj);
			barObj.appendChild(downObj);
			this._hold(barObj);
			this.render([upObj, downObj], this.arrowConfig);			
		},
		_hold : function(obj){ //箭头长按或点击事件
			var that = this;
			function holding(target){
				var	xlass  = target.className,
					barObj = target.parentNode.children[0],
					barCurPos, conCurPos;
				if(!/arrows/.test(xlass)){
					return;
				}
				else{
					var	conMaxTop = parseInt(that.contentBox.getAttribute("data-max")),
						barMaxTop = parseInt(barObj.getAttribute("data-max")),
						barSteps  = parseFloat(barObj.getAttribute("data-steps")),
						conSteps  = parseFloat(that.contentBox.getAttribute("data-steps")),
						barCurTop = parseInt(barObj.style.top),
						conCurTop = parseInt(that.contentBox.style.top);
					
					if(/upRoll/.test(xlass)){ //向上
						barCurPos = barCurTop - barSteps;
						conCurPos = -(conCurTop + conSteps);
						if(barCurPos < 8 || conCurPos < 0){
							barCurPos = 8;
							conCurPos = 0;
						}
					}
					else{ //向下
						barCurPos = barCurTop + barSteps;
						conCurPos = -(conCurTop - conSteps);
						if(barCurPos > barMaxTop || conCurPos > conMaxTop){
							barCurPos = barMaxTop;
							conCurPos = conMaxTop;
						}
					}
				}
				that.contentBox.style.top = -conCurPos + "px";
				barObj.style.top = barCurPos + "px";
			}
			Utils.mousehold(obj, holding);
		},
		render : function(obj, configs){ //箭头样式
			var  _css = "position: absolute;z-index: 1;left: 0px;width: 0px;height: 0px;border-width: 4px;border-style: solid;cursor:pointer;",
				up_css = _css
					   + "top: -2px;" 
					   + "border-color: " + configs.bgColor + " " + configs.bgColor + " " + configs.arrColor,
				down_css = _css
						 + "bottom:-2px;"
						 + "border-color: " + configs.arrColor + " " + configs.bgColor + " " + configs.bgColor;
			obj[0].style.cssText = up_css;
			obj[1].style.cssText = down_css;
		}
	};
	
	var scrollBar = (function(){
		var scrollBar = function(options){
			var selects = Utils.simpleSelect(options.block),
				count   = scrollBar.params ? scrollBar.params.length : 0,
				leng    = selects.length,
				content;
			for(var i=0; i<leng; i++,count++){
				content = selects[i];
				content.style.top = 0;
				content.style.position = "absolute";
				content.parentNode.style.overflow = "hidden";
				scrollBar.fn.init({index : count, contentBox:content, config : options.config});
			}
		};
		scrollBar.params = scrollBar.params ? scrollBar.params : [];
		scrollBar.fn = scrollBar.prototype = {
			constructor : scrollBar,
			init : function(options){ //各组件初始化
				var	axis   = new Axis(options),
					arrow  = new Arrow(options),
					handle = new Handle(options);
				axis.init();
				handle.init();
				arrow.init();
				this.calculate = handle.calculate;
			},
			recount : function(content){ //作用：重新计算滚动条高度。当滚动区域内容需改变时,可在外部调用
				if(typeof jQuery !== "undefined" && content instanceof jQuery){ //判断是否为jQuery对象
					content = content[0];
				}
				this.calculate(content);
			}
		};
		return scrollBar;
	})();
	window.scrollBar = scrollBar;
})(window);
