var vm = new Vue({
	el: "#item",
	data:{
		info:"绘制解锁图案,请至少连接4个点",
		pointData:{
			 R:26,
			 CW:400,
			 CH:320,
			 OffsetX:30,
			 OffsetY:30
		},
		Pointarr:[],
		resarr:[],
		resarr2:[],
		ok:true,
		success:true,
		checked: true
	},
	mounted: function () {
  		this.$nextTick(function () {
    		// 代码保证 this.$el 在 document 中
    		this.init();
  		})
	},
	methods:{
		init:function(){
			var c = document.getElementById("can");
            c.width = this.pointData.CW;
            c.height = this.pointData.CH;
            var cxt = c.getContext("2d");
            var X = (this.pointData.CW - 2 * this.pointData.OffsetX - this.pointData.R * 2 * 3) / 2;
            var Y = (this.pointData.CH - 2 * this.pointData.OffsetY - this.pointData.R * 2 * 3) / 2;
            console.log(X,Y);
            this.creatPoint(X, Y);
            this.addevent(c,cxt);
            this.resarr = [];
            this.Draw(cxt,null);
		},
		sel1: function(){
			this.info = "请绘制您的密码,密码长度不小于4位"
			this.checked = true;
			this.ok = true;
			this.success = true;
			//this.Pointarr = [];
			this.resarr = [];
			this.resarr2 = [];
			this.init();
		},
		sel2: function(){
			this.info = "请输入您的密码";
			this.ok = true;
			this.success = true;
			this.checked = false;
			//this.Pointarr = [];
			this.resarr = [];
			this.resarr2 = [];
			this.init();

		},
		creatPoint:function(diffX,diffY){
			 for (var row = 0; row < 3; row++) {
                for (var col = 0; col < 3; col++) {
                    var Point = {
                        X: (this.pointData.OffsetX + col * diffX + (col * 2 + 1) * this.pointData.R),
                        Y: (this.pointData.OffsetY + row * diffY + (row * 2 + 1) * this.pointData.R)
                    };
                    
                    this.Pointarr.push(Point);
                }
            }
		},
		judge: function(touches){
			 for (var i = 0; i < this.Pointarr.length; i++) {
                var currentPoint = this.Pointarr[i];
                var xdiff = Math.abs(currentPoint.X - touches.pageX);
                var ydiff = Math.abs(currentPoint.Y - touches.pageY);
                var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
                if (dir < this.pointData.R ) {
                    if(this.resarr.indexOf(i) < 0){ 
                        this.resarr.push(i);
                    }
                    break;
                }
            }
		},
		judge2: function(){

		},
		addevent: function(can,cxt){
			
			var _this = this;
			can.addEventListener("touchstart", function (e) {
                var event = EventUtil.getEvent(e);
                _this.judge(event.touches[0]);
                //cxt.clearRect(0,0,_this.pointData.CW,_this.pointData.CH);
            }, false);
            can.addEventListener("touchmove", function (e) {
            	var event = EventUtil.getEvent(e);
                EventUtil.preventDefault(event);
                var touches = event.touches[0];
                _this.judge(touches);
                cxt.clearRect(0,0,_this.pointData.CW,_this.pointData.CH);
                _this.Draw(cxt,{X:touches.pageX,Y:touches.pageY});
            }, false);
            can.addEventListener("touchend", function (e) { 
            	const STORAGE_KEY = 'i-want-to-join-360';
            	var event = EventUtil.getEvent(e);
                cxt.clearRect(0,0,_this.pointData.CW,_this.pointData.CH);
                _this.Draw(cxt,null);
                if(! _this.checked){
                	if(_this.resarr.length < 4){
                		_this.info = "最少4个点老哥";
                		_this.Draw(cxt,event.touches[0],1);
                		_this.resarr = [];
                		_this.info = "请重新输入密码";
                	}else{
                		var a = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
                		console.log(a);
                		if(_this.resarr.toString() == a.toString()){
                			_this.info = "验证成功!"
                		}else{
                			_this.info = "验证失败!";
                			_this.gogogo();
                		}
                	}
                }else{
                	if(_this.resarr.length < 4){
                		_this.info = "最少4个点老哥";
                		_this.Draw(cxt,event.touches[0],1);
                		_this.resarr = [];
					}else{
						if(_this.resarr2.length == 0){
							console.log("00000000000");
							_this.resarr2 = _this.resarr.concat();
							_this.resarr = [];

							console.log(_this.resarr);

						}else{
							console.log("1111111111");
							if(_this.resarr2.toString() == _this.resarr.toString()){
								_this.info = "绘制成功!请点击完成来保存您的密码";	
								_this.success = false;
							}else{
							_this.info = "请输入您刚才绘制的密码";
							cxt.clearRect(0,0,_this.pointData.CW,_this.pointData.CH);
							_this.resarr = [];
                			_this.Draw(cxt,event.touches[0])
							}
						}
						_this.ok = false;
					}
                }
                
            }, false);
		},
		gogogo: function(){
			this.resarr = [];
			this.resarr2 = [];
			this.init();
		},
		init2: function(){
			const STORAGE_KEY = 'i-want-to-join-360';
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.resarr2));
			this.resarr = [];
			this.resarr2 = [];
			this.success = true;
			this.ok = true;
			this.init();
		},
		Draw: function(cxt,touchPoint,color){
			if (this.resarr.length > 0) {
                cxt.beginPath();
                color==1 ? color="#ff0000": color="#000000"
                for (var i = 0; i < this.resarr.length; i++) {
                    var pointIndex = this.resarr[i];
                    cxt.lineTo(this.Pointarr[pointIndex].X, this.Pointarr[pointIndex].Y);
                }
                cxt.lineWidth = 10;
                cxt.strokeStyle = color;
                cxt.stroke();
                cxt.closePath();
                if(touchPoint!=null)
                {
                    var lastPointIndex=this.resarr[this.resarr.length-1];
                    var lastPoint=this.Pointarr[lastPointIndex];
                    cxt.beginPath();
                    cxt.moveTo(lastPoint.X,lastPoint.Y);
                    cxt.lineTo(touchPoint.X,touchPoint.Y);
                    cxt.stroke();
                    cxt.closePath();
                }
            }
            for (var i = 0; i < this.Pointarr.length; i++) {
                var Point = this.Pointarr[i];
                cxt.fillStyle = "#F80000";
                cxt.beginPath();
                cxt.arc(Point.X, Point.Y, this.pointData.R, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fill();
                cxt.fillStyle = "#EEEE00";
                cxt.beginPath();
                cxt.arc(Point.X, Point.Y, this.pointData.R - 3, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fill();
                if(this.resarr.indexOf(i)>=0)
                {
                	console.log("找到1");
                    cxt.fillStyle = "#627eed";
                    cxt.beginPath();
                    cxt.arc(Point.X, Point.Y, this.pointData.R -20, 0, Math.PI * 2, true);
                    cxt.closePath();
                    cxt.fill();
                }

            }
		}

	}
})