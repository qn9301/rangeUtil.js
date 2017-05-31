function rangeUtil(option){
	option = option ? option : {};
	var _ = this;
	this.option = {
		// 父框
		father_box: '',
		// 主框的css
		outer_css: {
			width: "100%",
			height: "100%",
			cursor: "default"
		},
		// 滑动条的css
		range_css: {
			position: 'absolute',
			background: '#ededed',
			'border-radius': '2px',
    		'box-shadow': '1px 1px 3px rgba(0,0,0,.2)'
		},
		// 滑动块的css
		rangebox_css: {
			position: 'absolute',
			top:'40px',
			width: '26px',
			height: '26px',
			'border-radius': '50%',
			'background-color': '#f2f2f2',
			'box-shadow': '2px 2px 2px rgba(0,0,0,.2)'
		},
		defaultValue: 0,
		// 步长，0的话就精确到小数点2位
		step: 0,
		min: 0,
		max: 100,
		// 1 纵向 2 横向
		type: 1
	};


	var proto = this.__proto__ = {};
	proto.outer_box = null;
	proto.range = null;
	proto.rangebox = null;
	proto.func_list = [];
	proto.point = 0;
	// 初始化外观
	proto._initStyle = function (){
		// 实例化对象
		this.outer_box = $("<div>");
		this.range = $("<div>");
		this.rangebox = $("<div>");
		// 嵌套层次
		this.outer_box.append(this.range.append(this.rangebox))
			.appendTo($(this.option.father_box));
		// 根据不同的type 设置不同的样式
		if (this.option.type == 1){
			this.range.css({width: "5%", height: "90%"});
			this.rangebox.css({width: "300%", height: "6px"});
		} else {
			this.range.css({height: "5%", width: "90%"});
			this.rangebox.css({width: "6px", height: "300%"});
		}
		// 修改样式
		this.outer_box.css(this.option.outer_css).css("position", "relative");
		this.range.css(this.option.range_css).css("position", "absolute");
		this.rangebox.css(this.option.rangebox_css).css("position", "absolute");
		// 设置range的位置
		util._setCenter(this.range, this.outer_box);
		util._setCenter(this.rangebox, this.range);
		// 设置一个div相对另一个div位置的百分比
		util._setPointer(this.rangebox, this.range, 
			this.option.defaultValue, this.option.type);
		this._registEvent();
	};
	// 装载外置属性
	proto._initOption = function (){
		for (var i in option){
			if (i == "outer_css"){
				for(var j in option.outer_css){
					this.option.outer_css[j] = option.outer_css[j]
				}
			} else{
				if (this.option.hasOwnProperty(i)){
					this.option[i] = option[i];
				}
			}
		}
		this.point = this.option.defaultValue;
	};

	proto._registEvent = function (){
		var obj = this.outer_box;
		var moveState = false;
		obj.on("mousedown touchstart", function (e){
			moveState = true;
			e = util._parseEvent(e, _.range);
			deal_event(e)
		})
		obj.on("mousemove touchmove", function (e){
			if (moveState){
				e = util._parseEvent(e, _.range);
				deal_event(e)
			}
		})
		$(document).on("mouseup touchend", function (e){
			_.emitCallback({point: _.point})
			moveState = false;
		})

		function deal_event(e){
			var key = ["", ["y", "height"], ["x", "width"]][_.option.type];
			var h = _.range[key[1]]();
			var p = e[key[0]] / h
			if (p > 1){
				p = 1
			}else if (p < 0){
				p = 0;
			}
			if (_.option.type == 1){
				p = 1 - p
			}
			util._setPointer(_.rangebox, _.range, 
			p * 100, _.option.type);
		}
	}

	proto.setVal = function (val){
		if (!$.isNumeric(val)){
			return false;
		}
		if (val > this.max){
			val = this.max
		}
		if (val < this.min){
			val = this.min
		}
		util._setPointer(this.rangebox, this.range, 
			(val - this.min) / (this.max - this.min), this.option.type);
		return this;
	}

	proto.getVal = function (){
		return this.point * (this.max - this.min) + this.min;
	}

	proto.registCallback = function (call){
		this.func_list.push(call)
		return this;
	}

	// 初始化一切
	proto._init = function (){
		this._initOption();
		this._initStyle();
	};

	proto.emitCallback = function (data){
		for(var i=0;i<this.func_list.length;i++){
			this.func_list[i](data);
		}
	}
	// 辅助工具对象
	var util = {
		_setCenter: function (obj, fobj){
			var fw = fobj.width();
			var fh = fobj.height();
			var ow = obj.width();
			var oh = obj.height();
			if (fobj.css("position") == "static"){
				fobj.css("position", "relative")
			}
			if (obj.css("position") == "static"){
				obj.css("position", "absolute")
			}
			obj.css({left: (fw-ow)/2, top: (fh-oh)/2})
		}, 
		/*
			obj 子，fobj 父, 
			p 所占百分比的位置, 
			type 1 纵向 2 横向
		*/
		_setPointer: function (obj, fobj, p, type){
			_.point = parseFloat(p.toFixed(2));
			if (type == 1){
				var key = ["height", "top"]
				p = 100 - p;
			}else{
				var key = ["width", "left"]
			}
			p = p / 100
			var o_h = fobj[key[0]]();
			var h = obj[key[0]]();
			var ph = parseFloat(o_h * p);
			obj.css(key[1], ph - h / 2);
		},
		_parseEvent: function (e, obj){
			var n_e = {}
			if (typeof e.originalEvent.touches != "undefined"){
				n_e = e.originalEvent.touches[0]
				n_e.x = n_e.pageX
				n_e.y = n_e.pageY
			}
			else {
				n_e = e;
				n_e.x = n_e.pageX
				n_e.y = n_e.pageY
			}
			n_e.x = n_e.x - obj.offset().left;
			n_e.y = n_e.y - obj.offset().top;
			return n_e
		}
	}

	this._init();
}
