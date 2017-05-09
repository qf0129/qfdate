/* ============================================================
 * https://github.com/qf0129/qfdate
 * version = 0.2
 * ============================================================ */
$(function() {
    new QfDatePicker().init();
});

function QfDatePicker() {
    var _this = this;
    var maxYear = new Date().getFullYear();
    var minYear = 1900;

    var curOpt = null;
    var rootDiv = null;
    var yearScroll, monthScroll, dayScroll;
    var okBtn, cancelBtn;

    var yearList = [],
        monthList = [],
        dayList = [];

    this.init = function() {
        _this.initView();
        _this.initData();

        yearScroll.changeFunction = _this.updateDate;
        monthScroll.changeFunction = _this.updateDate;
        dayScroll.changeFunction = _this.updateDate;

        $('.qfdate').attr('readonly', 'readonly');
        $('.qfdate').attr('type', 'text');
        $('.qfdate').click(function() {
            curOpt = $(this);
            rootDiv.show();
            _this.resetData();
        });
        okBtn.click(function() {
            rootDiv.hide();
            if (curOpt[0].nodeName == 'INPUT') {
                curOpt.val(_this.getDate());
            } else {
                curOpt.html(_this.getDate());
            };
        });
        cancelBtn.click(function() {
            rootDiv.hide();
        });
    };

    this.getDate = function() {
        var date = yearScroll.getValue() + '-' + monthScroll.getValue() + '-' + dayScroll.getValue();
        return date;
    };
    
    this.initData = function() {
        for (var i = minYear; i < maxYear + 1; i++) {
            yearList[i - minYear] = i;
        };
        for (var i = 0; i < 12; i++) {
            monthList[i] = i + 1;
        };
        yearScroll.setData(yearList);
        monthScroll.setData(monthList);
    };
    
    this.resetData = function() {
        yearScroll.selectIndex(yearList.length-1);
        monthScroll.selectIndex(0);
        dayScroll.selectIndex(0);
    };

    this.updateDate = function() {
        var y = yearScroll.getValue();
        var m = monthScroll.getValue();

        var daycount = new Date(y, m, 0).getDate();
        var curIndex = dayScroll.curIndex;

        if (daycount != dayList.length) {
            dayList = []
            for (var i = 0; i < daycount; i++) {
                dayList[i] = i + 1;
            };
            dayScroll.setData(dayList);
            dayScroll.selectIndex(curIndex);
        };
    };

    this.initView = function() {
        $('body').append(
            '<div class="qfDatepickerRoot">' +
            '<div class="yearScroll"></div>' +
            '<div class="monthScroll"></div>' +
            '<div class="dayScroll"></div>' +
            '<div class="datepickerBtnDiv">' +
            '<div class="cancelBtn datepickerBtn">Cancel</div>' +
            '<div class="okBtn datepickerBtn">Ok</div>' +
            '</div>' +
            '</div>'
        );

        rootDiv = $('.qfDatepickerRoot');
        cancelBtn = rootDiv.find('.cancelBtn');
        okBtn = rootDiv.find('.okBtn');

        yearScroll = new QfScroll($('.yearScroll'));
        monthScroll = new QfScroll($('.monthScroll'));
        dayScroll = new QfScroll($('.dayScroll'));

        $('.qfDatepickerRoot').css({
            "display": "none",
            "position": "fixed",
            "top": "20%",
            "width": "80%",
            "max-width": "600px",
            "left": "10%",
            "background": "#fcfcfc",
            "height": "auto",
            "text-align": "center",
            "box-shadow": "0px 0px 30px #999",
            "border-radius": "3px",
        });

        rootDiv.find('.datepickerBtnDiv').css({
            "text-align": "right",
            "margin": "10px"
        });

        rootDiv.find('.datepickerBtn').css({
            "display": "inline-block",
            "text-align": "center",
            "margin-right": "10px",
            "padding": "10px 20px",
            "color": "#333"
        });

    };
};

function QfScroll(divOpt) {
    var _this = this;

    var dataPanel = null;
    var selectedBar = null;
    var dataBar = null;

    var touchEvents = null;
    var oneHeight = 0;
    var dataList = null;
    this.curIndex = 0;

    var mY = 0;
    var dY = 0;
    var isDown = false;

    this.getValue = function() {
        return dataList[_this.curIndex];
    };


    this.setData = function(data) {
        divOpt.empty();
        _this.initTouchEvents();
        _this.initView();
        _this.addEventListener();
        dataList = data;
        for (var i = 0; i < dataList.length; i++) {
            dataPanel.append('<div class="dataBar">' + dataList[i] + '</div>');
        };

        dataBar = divOpt.find('.dataBar');
        dataBar.height(divOpt.height() / 5);
        dataBar.css('line-height', divOpt.height() / 5 + 'px');
        _this.selectIndex(dataList.length - 1);

    };

    this.addEventListener = function() {
        dataPanel.bind(touchEvents.start, function(event) {
            event.preventDefault();
            mY = _this.getMousePos(event).y;
            dY = dataPanel.position().top;
            isDown = true;
        });
        dataPanel.bind(touchEvents.move, function(event) {
            event.preventDefault();
            var y = _this.getMousePos(event).y;
            if (isDown) {
                _this.setTop(y - mY + dY);
            };
        });
        dataPanel.bind(touchEvents.end, function(event) {
            event.preventDefault();
            isDown = false;
            _this.setRightTop();
        });
    };

    this.setRightTop = function() {
        var topValue = dataPanel.position().top;
        if (topValue >= 0) {
            if ((topValue % oneHeight) <= (oneHeight / 2)) {
                index = -parseInt(topValue / oneHeight) + 2;
            } else {
                index = -parseInt(topValue / oneHeight) + 1;
            };
            if (topValue >= oneHeight * 2) {
                index = 0;
            };
        } else {
            if ((-topValue % oneHeight) <= (oneHeight / 2)) {
                index = parseInt(-topValue / oneHeight) + 2;
            } else {
                index = parseInt(-topValue / oneHeight) + 3;
            };
            if (topValue <= -oneHeight * (dataList.length - 3)) {
                index = dataList.length - 1;
            };

        };
        _this.selectIndex(index);
    };


    this.changeFunction = function() {};

    this.selectIndex = function(index) {
        if (index >= dataList.length) {
            _this.selectIndex(dataList.length - 1);
            return;
        };
        var val = oneHeight * 2 - index * oneHeight;
        _this.setTop(val);
        _this.curIndex = index;
        _this.changeFunction();
    };


    this.setTop = function(value) {
        dataPanel.css('top', value);
    };

    this.setWidth = function(value) {
        divOpt.css('width', value);
    };

    this.initView = function(event) {

        divOpt.addClass('qfScroll');
        divOpt.html(
            '<div class="dataPanel"></div>' +
            '<div class="selectedBar"></div>'
        );
        dataPanel = divOpt.find('.dataPanel');
        selectedBar = divOpt.find('.selectedBar');

        divOpt.css({
            "background": "#fcfcfc",
            "display": "inline-block",
            "min-width": "100px",
            "height": "250px",
            "overflow": "hidden",
            "position": "relative",
            "z-index": "0"
        });
        dataPanel.css({
            "text-align": "center",
            "position": "absolute",
            "width": "100%",
            "top": "0",
            "left": "0",
            "font-size": "20px",
            "color": "#333",
            "z-index": "80"
        });

        selectedBar.css({
            "position": "absolute",
            "top": "40%",
            "left": "0",
            "width": "100%",
            "height": "20%",
            "border-top": "1px solid #e5e5e5",
            "border-bottom": "1px solid #e5e5e5",
            "z-index": "50"
        });
        oneHeight = divOpt.height() / 5;
    };

    this.initTouchEvents = function(event) {
        if (_this.isPC()) {
            touchEvents = {
                start: "mousedown",
                move: "mousemove",
                end: "mouseup",
                leave: "mouseleave"
            }
        } else {
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
};
