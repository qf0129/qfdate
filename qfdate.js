/* ============================================================
 * flatui-radiocheck v0.1.0
 * ============================================================ */
$(function(){
    new QfDate().init();
});

function QfDate(){
  var _this=this;
  var qfDateMain,qfDateMask,qfDateCancelBtn,qfDateOkBtn,qfDateYearScroll,qfDateMonthScroll,qfDateDayScroll;
  var startYear=1900;//起始年份
  var curOpt=null;
  var yData=[],mData=[],dData=[];

  this.init=function(){
    $('body').append(
    	'<div class="qfDateMain" style="display:none;text-align:center;">'+
    	'<div class="qfDateMask" style="position:fixed;opacity:0.5;background:#999;height: 100%;width: 100%;left: 0;top: 0;z-index: 9999;"></div>'+
    	'<div class="qfDateDialog" style="background:#fff;position:fixed;left:0;bottom:0;width:100%;z-index:99999;border-top:1px solid #e5e5e5;">'+
    	'<div class="qfDateTitle" style="background:#e1e1e1;height:35px;color:#666;font-size:14px;">'+
    	'<div class="qfDateCancelBtn" style="display: inline-block;line-height:35px;padding: 0 20px;float: left;">取消</div>'+
    	'<div class="qfDateTitle_title" style="display: inline-block;line-height:35px;padding: 0 20px;">选择日期</div>'+
    	'<div class="qfDateOkBtn" style="display: inline-block;line-height:35px;padding: 0 20px;float: right;">确定</div>'+
    	'</div>'+
    	'<div class="qfscroll qfDateYearScroll"></div>'+
    	'<div class="qfscroll qfDateMonthScroll"></div>'+
    	'<div class="qfscroll qfDateDayScroll"></div>'+
    	'</div>'+
    	'</div>'
    	);
    	qfDateMain=$('.qfDateMain');
    	qfDateMask=$('.qfDateMask');
    	qfDateCancelBtn=$('.qfDateCancelBtn');
    	qfDateOkBtn=$('.qfDateOkBtn');
    	qfDateYearScroll=new QfScroll($('.qfDateYearScroll'));
    	qfDateMonthScroll=new QfScroll($('.qfDateMonthScroll'));
    	qfDateDayScroll=new QfScroll($('.qfDateDayScroll'));
      qfDateYearScroll.init();
      qfDateMonthScroll.init();
      qfDateDayScroll.init();

      qfDateYearScroll.setTodo(function(){
          _this.checkDays();
      });
      qfDateMonthScroll.setTodo(function(){
          _this.checkDays();
      });

    	qfDateCancelBtn.click(function(){
    		qfDateMain.hide();
    	});
    	qfDateMask.click(function(){
    		qfDateMain.hide();
    	});
    	qfDateOkBtn.click(function(){
    		qfDateMain.hide();
        if (curOpt[0].nodeName=='INPUT') {
            curOpt.val(_this.getDate());
        }else{
          	curOpt.html(_this.getDate());
        }
    	});

      $('.qfDate').attr('readonly','readonly');
      $('.qfDate').attr('type','text');
    	$('.qfDate').click(function(){
        curOpt=$(this);
    		_this.showView();
    	});
  };

  this.getDate=function(){
      return _this.getY()+'-'+_this.getM()+'-'+_this.getD();
  };
  this.getY=function(){
      return qfDateYearScroll.getVal();
  };
  this.getM=function(){
      return qfDateMonthScroll.getVal();
  };
  this.getD=function(){
      return qfDateDayScroll.getVal();
  };

  this.checkDays=function(){
      var days=new Date(_this.getY(),(_this.getM()),0).getDate();
      if(qfDateDayScroll.getCount()==days){
        return;
      };
      dData=[];
    	for (var i = 0; i < days; i++) {
    		dData[i]=i+1;
    	};
      if (_this.getD()<days) {
          	qfDateDayScroll.setData(dData,_this.getD()-1);
      }else{
          	qfDateDayScroll.setData(dData);
      };
  };

  this.showView=function(){
      var now=new Date();
    	var nowY=now.getFullYear();
    	var nowM=now.getMonth();
    	var nowD=now.getDate()-1;
    	for (var i = 0; i < nowY-startYear+2; i++) {
    		yData[i]=startYear+i;
    	};
    	qfDateYearScroll.setData(yData,nowY-startYear);

    	for (var i = 0; i < 12; i++) {
    		mData[i]=i+1;
    	};
    	qfDateMonthScroll.setData(mData,nowM);

    	for (var i = 0; i < 31; i++) {
    		dData[i]=i+1;
    	};
    	qfDateDayScroll.setData(dData,nowD);

      var inputValue=curOpt.val();
      if (inputValue!='') {
        var dateValues=inputValue.split('-');
        qfDateYearScroll.setData(yData,dateValues[0]-startYear);
      	qfDateMonthScroll.setData(mData,dateValues[1]-1);
      	qfDateDayScroll.setData(dData,dateValues[2]-1);
      }
    	qfDateMain.show();
  };
};

function QfScroll(divOpt){
  var _this=this;
  var range=5;//多少像素移动一格,值越大速度越慢
  var curIndex=0;
  var curData=[];
  var todo=function(){};
  var touchEvents = {
  	start: "touchstart",
  	move: "touchmove",
  	end: "touchend",
  	leave:"mouseleave",
  	init: function () {
  		if (isPC()) {
  			this.start = "mousedown";
  			this.move = "mousemove";
  			this.end = "mouseup";
  		}
  	}
  };

  this.setTodo=function(way){
    todo=way;
  };
  this.setRange=function(r){
    range=r;
  };

  this.init=function(){
    touchEvents.init();

    divOpt.html(
      '<div class="qffloor qffloor0">&nbsp;</div>'+
      '<div class="qffloor qffloor1">&nbsp;</div>'+
      '<div class="qffloor qffloor2">&nbsp;</div>'+
      '<div class="qffloor qffloor3">&nbsp;</div>'+
      '<div class="qffloor qffloor4">&nbsp;</div>'
    );

    divOpt.css('display','inline-block');
    divOpt.css('padding-top','10px');
    divOpt.css('padding-bottom','10px');
    divOpt.find('.qffloor').css('height','40px');
    divOpt.find('.qffloor').css('line-height','40px');
    divOpt.find('.qffloor').css('min-width','100px');
    divOpt.find('.qffloor').css('text-align','center');
    divOpt.find('.qffloor').css('user-select','none');

    divOpt.find('.qffloor0,.qffloor4').css('font-size','16px');
    divOpt.find('.qffloor0,.qffloor4').css('color','#ddd');

    divOpt.find('.qffloor1,.qffloor3').css('font-size','20px');
    divOpt.find('.qffloor1,.qffloor3').css('color','#aaa');

    divOpt.find('.qffloor2').css('font-size','24px');
    divOpt.find('.qffloor2').css('font-weight','bold');
    divOpt.find('.qffloor2').css('color','#000');
    divOpt.find('.qffloor2').css('border-top','1px solid #eee');
    divOpt.find('.qffloor2').css('border-bottom','1px solid #eee');

    divOpt.bind(touchEvents.start, function (event) {
    	event.preventDefault();
    	var startY=0;
    	var endY=0;
    	var subY=0;
    	var lastEndY=0;
            var time1=new Date().getTime();
            var time2=0;
    	startY = getMousePos(event).y;
    	divOpt.bind(touchEvents.move, function (event) {
    		event.preventDefault();
    		endY = getMousePos(event).y;
    		subY=endY-startY;
                  if(subY>-80&&subY<80){
                    range=30;
                  }else{
                    range=6;
                  };
    		if(subY>0){
    			if(subY%range==0){
    				if (endY<lastEndY) {
    					if(subY%range==0){
    						curIndex=_this.setData(curData,curIndex+1);
    					}
    				}
    				_this.setData(curData,curIndex-1);
    			}
    		};
    		if(subY<0){
    			if(subY%range==0){
    				if (endY>lastEndY) {
    					if(subY%range==0){
    						curIndex=_this.setData(curData,curIndex-1);
    					}
    				}
    				_this.setData(curData,curIndex+1);
    			}
    		};
    		lastEndY=endY;

    	});

      	divOpt.bind(touchEvents.end , function (event) {
      		event.preventDefault();
      		divOpt.unbind(touchEvents.move);
      		divOpt.unbind(touchEvents.end);
      		divOpt.unbind(touchEvents.leave);
          todo();
      	});

      	divOpt.bind(touchEvents.leave, function (event) {
      		event.preventDefault();
      		divOpt.unbind(touchEvents.move);
      		divOpt.unbind(touchEvents.end);
      		divOpt.unbind(touchEvents.leave);
          todo();
      	});

    });


    divOpt.find('.qffloor0,.qffloor1').bind(touchEvents.start,function(event){
      event.preventDefault();
      curIndex=_this.setData(curData,curIndex-1);
    });
    divOpt.find('.qffloor3,.qffloor4').bind(touchEvents.start,function(event){
      event.preventDefault();
      curIndex=_this.setData(curData,curIndex+1);
    });

  };

  this.getVal=function(){
  	return divOpt.find('.qffloor2').html();
  };
    this.getCount=function(){
    	return curData.length;
    };

  this.setData=function(mData,index){
      curData=mData;
  	for (var i = 0; i <5; i++) {
  		divOpt.find('.qffloor'+ i).html("&nbsp;");
  	}
  	if(index==null){
  		index=mData.length-1;
  	}else if(index>mData.length-1){
  		index=mData.length-1;
  	}else if (index<0){
  		index=0;
  	};
  	curIndex=index;
  	if(index==-1){
  		for (var i = 0; i <mData.length; i++) {
  			divOpt.find('.qffloor'+(2-i)).html(mData[mData.length-1-i]);
  			if (i==2) {
  				break;
  			}
  		}
  	}

  	if(index==0){
  		for (var i = 0; i <mData.length; i++) {
  			divOpt.find('.qffloor'+(2+i)).html(mData[i]);
  			if (i==2) {
  				break;
  			}
  		}
  	}

  	if(index==1){
  		for (var i = 0; i <mData.length; i++) {
  			divOpt.find('.qffloor'+(1+i)).html(mData[i]);
  			if (i==3) {
  				break;
  			}
  		}
  	}

  	if(index>1){
  		for (var i = -2; i <mData.length; i++) {
  			divOpt.find('.qffloor'+(i+2)).html(mData[index+i]);
  			if (i==2) {
  				break;
  			}
  		}
  	}
  	return curIndex;
  };

};

function isPC(){
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
	}
	return flag;
};

function getMousePos(event) {
	var e = event || window.event;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var x = e.pageX || e.clientX + scrollX;
	var y = e.pageY || e.clientY + scrollY;
	return { 'x': x, 'y': y };
};
