$(function(){
});


function QfScroll(divOpt) {
  var _this=this;

  var dataPanel=null;
  var selectedBar=null;
  var dataBar=null;

  var touchEvents = null;
  var oneHeight = 0;
  var dataList = null;
  var curIndex=0;

var mY = 0;
var dY = 0;
var isDown = false;


document.querySelector('body').addEventListener('touchstart', function (ev) {
    event.preventDefault();
});

this.getData = function(){
return dataList[curIndex];
};


this.setData = function(data){
    _this.initTouchEvents();
    _this.initView();
    _this.addEventListener();
dataList = data;
for (var i = 0; i < dataList.length; i++) {
    dataPanel.append('<div class="dataBar">' + dataList[i] + '</div>');
};

dataBar = divOpt.find('.dataBar');
dataBar.height(divOpt.height() / 5);
dataBar.css('line-height',divOpt.height() / 5+'px');
_this.selectIndex(dataList.length-1);
};

this.addEventListener = function(){

dataPanel.bind(touchEvents.start, function(event) {
    mY = _this.getMousePos(event).y;
    dY = dataPanel.position().top;
    isDown = true;
});
    
    dataPanel.bind(touchEvents.move, function(event) {
        var y = _this.getMousePos(event).y;
        if(isDown) {
           _this.setTop( y - mY + dY);
        };
    });

    dataPanel.bind(touchEvents.end, function(event) {
        isDown = false;
       _this.setRightTop();
      });
};


this.setRightTop = function(){
    var topValue = dataPanel.position().top;
    if(topValue>=0){
                if ((topValue%oneHeight)<=(oneHeight/2)) {
                    index = -parseInt(topValue/oneHeight)+2;
                }else{
                    index = -parseInt(topValue/oneHeight)+1;
                };
                if (topValue >= oneHeight * 2) {
                    index = 0;
                };
            }else{
                if ((-topValue%oneHeight)<=(oneHeight/2)) {
                    index = parseInt(-topValue/oneHeight)+2;
                }else{
                    index = parseInt(-topValue/oneHeight)+3;
                };
                if (topValue <= - oneHeight * (dataList.length - 3)) {
                    index = dataList.length-1;
                };

            };
            _this.selectIndex(index);
};


this.changeFunction = function(){};

this.selectIndex = function(index){
        var val=oneHeight * 2 - index*oneHeight;
        _this.setTop(val);
        curIndex = index;
       _this.changeFunction();
};


this.setTop = function(value){
        dataPanel.css('top',value);
};

this.initView = function(event) {

    divOpt.addClass('rootPanel');
    divOpt.html(
      '<div class="dataPanel"></div>'+
      '<div class="selectedBar"></div>'
    );
    dataPanel = divOpt.find('.dataPanel');
    selectedBar = divOpt.find('.selectedBar');

    divOpt.css({
        "background":"#ccc",
        "display": "inline-block",
        "min-width": "100px",
        "height": "200px",
        "overflow": "hidden",
        "position": "relative",
        "z-index": "0"
    });
    dataPanel.css({
        "text-align": "center",
        "position": "absolute",
        "display": "inline-block",
        "opacity": "0.8",
        "min-width": "100px",
        "top": "0",
        "left": "0",
        "z-index": "80"
    });

    selectedBar.css({
        "position": "absolute",
        "top": "40%",
        "left": "0",
        "width": "100%",
        "height": "20%",
        "border-top": "1px solid #fff",
        "border-bottom": "1px solid #fff",
        "z-index": "50"
    });
    oneHeight = divOpt.height()/5;
};

this.initTouchEvents = function(event) {
	if(_this.isPC()){
	    touchEvents = {
	        start: "mousedown",
	        move: "mousemove",
	        end: "mouseup",
	        leave: "mouseleave"
	        }
	    }else{
	     touchEvents = {
	        start: "touchstart",
	        move: "touchmove",
	        end: "touchend",
	        leave: "mouseleave"
	        };
	    }
};


this.isPC = function(event) {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
};

this.getMousePos = function(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return {
        'x': x,
        'y': y
    };
};


}