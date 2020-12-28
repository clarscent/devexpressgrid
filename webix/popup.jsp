<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%
	request.setCharacterEncoding("utf-8");
%>
<style>
.popupBackground {
	font-family: "맑은 고딕";
	position: absolute;
	left: 0px;
	top: 0px;
	z-index: 999999;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.1);
	text-align: center;
}

#alertPopupWindow, #confirmPopupWindow, #loadingPopupWindow, #helpPopupWindow {
	display: none;
}

#alertContainer, #confirmContainer, #loadingContainer {
	position: absolute;
	width: 300px;
	border-radius: 2px;
	background-color: #f7f7f7;
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
	top: calc(50% - 100px);
	left: calc(50% - 150px);
	padding-bottom: 15px;
}

#loadingContainer {
	top: calc(50% - 75px);
	left: calc(50% - 75px);
}

#alertTitle, #confirmTitle {
	width: 100%;
	line-height: 40px;
	height: 40px;
	font-weight: bold;
	color: #333333;
	font-size: 12pt;
}

#alertText, #confirmText {
	width: 100%;
	color: #666666;
	font-size: 9pt;
	padding: 20px;
	white-space: pre-line;
}

#alertClose, #confirmYes, #confirmNo {
	padding-left: 15px;
	padding-right: 15px;
	height: 32px;
	background-image: -moz-linear-gradient(90deg, #2481cf, #026dc7);
	background-image: -webkit-linear-gradient(90deg, #2481cf, #026dc7);
	background-image: linear-gradient(90deg, #2481cf, #026dc7);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr='#2481cf', endColorstr='#026dc7');
	border-radius: 2px;
	border: 1px solid #1c71b1;
	font-size: 9pt;
	color: #ffffff;
}

#alertClose:focus, #confirmYes:focus, #confirmNo:focus {
	background-image: -moz-linear-gradient(90deg, #3c9ef1, #2392ef);
	background-image: -webkit-linear-gradient(90deg, #3c9ef1, #2392ef);
	background-image: linear-gradient(90deg, #3c9ef1, #2392ef);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr='#3c9ef1', endColorstr='#2392ef');
	border: 1px solid #1c71b1;
	box-shadow: 0 0 5px #07c;
}

#alertClose:hover, #confirmYes:hover, #confirmNo:hover {
	background-image: -moz-linear-gradient(90deg, #0460ae, #0466b7);
	background-image: -webkit-linear-gradient(90deg, #0460ae, #0466b7);
	background-image: linear-gradient(90deg, #0460ae, #0466b7);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr='#0460ae', endColorstr='#0466b7');
	border: 1px solid #1c71b1;
}

#alertClose:active, #confirmYes:active, #confirmNo:active {
	background-image: linear-gradient(#3788b9, #4796c7);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#3788b9', endColorstr='#4796c7');
	border: 1px solid #2376a9;
}

#confirmYes, #confirmNo {
	width: 130px;
}
</style>
<script>
var popup_grid;

var popup = {
	alert: {
		callback: null,
		show: function (text, callback) {
			this.callback = callback;

			$("#alertText").text(text);
			$("#alertPopupWindow").css("display", "block");
			$("#alertClose").focus();
		},

		hide: function () {
			$("#alertPopupWindow").css("display", "none");

			if (this.callback != null) {
				this.callback();
			}
		}
	},

	confirm: {
		callback: null,

		show: function (text, callback) {
			this.callback = callback;

			$("#confirmText").text(text);
			$("#confirmPopupWindow").css("display", "block");
			$("#confirmYes").focus();
			$("#confirmYes").data("isfoucs", "Y");
			$("#confirmNo").data("isfoucs", "N");
		},

		hide: function (val) {
			$("#confirmPopupWindow").css("display", "none");

			if (this.callback != null) {
				this.callback(val);
			}
		}
	},

	loading: {
		cnt: 0,

		show: function () {
			//console.log("show cnt: ", this.cnt, arguments);
			this.cnt++;
			$("#loadingPopupWindow").css("display", "block");
		},
		hide: function () {
			//console.log("hide cnt: ", this.cnt);
			this.cnt--;
			if (this.cnt <= 0) {
				this.cnt = 0;
				$("#loadingPopupWindow").css("display", "none");
			}
		},
	},

	help: {
		callback: null,

		show: function (dataSource, callback) {
			var that = this;
			that.callback = callback;

			$("#helpPopupWindow").css("display", "block");

			_helpcode_reset();
			$("#helpSearchArea").find("input:not([type=hidden]):first").focus();

			var that = this;
			var columns = [];
			columns.push({
				id: "CODE",
				header: "코드",
				editor: "",
				sort: "string",
				css: "textCenter",
				width: 150,
				fillspace: false
			});
			columns.push({
				id: "NAME",
				header: "명",
				editor: "",
				sort: "string",
				css: "textLeft",
				width: 120,
				fillspace: true
			});

			if (popup_grid) {
				popup_grid.destructor();
			}

			webix.ready(function () {
				popup_grid = webix.ui({
					id: "help_popup_grid1",
					container: "help_popup_grid1",
					view: "datagrid",
					columns: columns,
					data: dataSource,
				});

				$("#help_popup_search").click(function () {
					// filter
				});

				$("#help_popup_select").click(function () {
					var grid = $$("help_popup_grid1");
					var record = grid.getItem(grid.getSelectedId());

					that.callback(record);
					that.hide();
				});
			});

			$$("help_popup_grid1").attachEvent("onItemDblClick", function (id, e, node) {
				var record = $$("help_popup_grid1").getItem(id.row);
				that.callback(record);
				that.hide();
			});

			$("#help_popup_code").bind("keydown", function (evt) {
				if (evt.which == 13) {
					__helpcode_popup_search(code, param);
				}
			});
		},
		hide: function () {
			$("#helpPopupWindow").css("display", "none");
			$$("help_popup_grid1").clearData();
		}
	}
}

function __helpcode_popup_search(code, param) {
	param["CODEGB"] = $("#help_popup_code").val();

	var helpcode_callback = new Callback(function (result) {
		$$("help_popup_grid1").setData(result);
	});

	helpcode_callback.setShowLoading(true);
	CodeService.getCodeName("HELP", code, param, helpcode_callback);
}

function _helpcode_reset() {
	$("#help_popup_code").val("");
}

function _confirmKeyEvt(evt) {
	if (evt.keyCode == 13) {
		if ($("#confirmYes").data("isfoucs") == "Y") {
			popup.confirm.hide(true);
		} else {
			popup.confirm.hide(false);
		}
	}

	if (evt.keyCode == 37 || evt.keyCode == 39) {
		if ($("#confirmYes").data("isfoucs") == "Y") {
			$("#confirmYes").data("isfoucs", "N");
			$("#confirmNo").data("isfoucs", "Y");

			$("#confirmNo").focus();
		} else {
			$("#confirmYes").data("isfoucs", "Y");
			$("#confirmNo").data("isfoucs", "N");

			$("#confirmYes").focus();
		}
	}
}

$(document).ready(function () {
	$("#alertContainer").draggable({
		containment: "parent",
		cursor: "move"
	});
	$("#confirmContainer").draggable({
		containment: "parent",
		cursor: "move"
	});
	$("#helpContainer").draggable({
		containment: "parent",
		cursor: "move"
	});
})
</script>
<div id="alertPopupWindow" class="popupBackground" style="z-index:999999999;" onkeydown="if(event.keyCode == 13){popup.alert.hide();}">
	<div id="alertContainer">
		<div id="alertTitle">알 림</div>
		<div id="alertText"></div>
		<button id="alertClose" onclick="popup.alert.hide();">확인</button>
	</div>
</div>
<div id="confirmPopupWindow" class="popupBackground" style="z-index:999999999;" onkeydown="_confirmKeyEvt(event)">
	<div id="confirmContainer">
		<div id="confirmTitle">확 인</div>
		<div id="confirmText"></div>
		<button id="confirmYes" onclick="popup.confirm.hide(true);" data-isfocus="Y">예</button>
		<button id="confirmNo" onclick="popup.confirm.hide(false);" data-isfocus="N">아니오</button>
	</div>
</div>

<div id="loadingPopupWindow" class="popupBackground" style="z-index:99999999;">
	<div id="loadingContainer" style="background-image:url('/img/loading.gif'); width:150px; height:150px; background-repeat:no-repeat; background-position:center 15px; background-color:#ffffff;">
		<div style="position:absolute; bottom:15px; text-align:center; width:100%; font-size:9pt;">잠시만 기다려주세요</div>
	</div>
</div>

<style>
#helpContainer {
	position: absolute;
	border: 1px solid #2a5294;
	background-color: #ffffff;
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
	width: 400px;
	height: 500px;
	top: calc(50% - 250px);
	left: calc(50% - 200px);
}

#helpTitle {
	background-color: #2a5294;
	border-top-radius: 2px;
	color: #ffffff;
	font-weight: bold;
	font-size: 11pt;
	height: 30px;
	padding-top: 8px;
	text-align: left;
	padding-left: 10px;
}

#help_popup_close {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 19px;
	height: 19px;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODM3RUY3MDRGOEM1MTFFNkE3QzRCMUYyODNBQzlDNkEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODM3RUY3MDNGOEM1MTFFNkE3QzRCMUYyODNBQzlDNkEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUUxMThEMjYzOTA5MTFFNjk1RTlCOEM0OUQyRTgxOTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUUxMThEMjczOTA5MTFFNjk1RTlCOEM0OUQyRTgxOTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5R2cKhAAABs0lEQVR42pyUMUgCYRTHP6PuyM26BgMruqBRT5AETRxqKXJurTmopobGCGqKgsZotD2aIlC4FAVR3BqKbq4EEZILh/7v+O64+/oc8sFv8L3v/Q7fx/dCxWKRSWIebIMNsAQ08AlewQO4A5bYNC78ngSnYA9MCLVZzio4AdfgGHy7B8Z8h2fAMziUiMSg+gEweV9ApoB7YLD/hcH7VL/sHKyw0YL6zlzZHJ+RF7FYjBUKBRaJRAJdmqY5+Wg0Kgqpf4Fku+JFGIbBwuEwy+fznpBEuVzOyScSCdlF7pBsTayYpsls22aqqjpCXdcdkaIorN/vs0qlIvu76yRbFLOdToeVy2VPmEqlPFGpVGLdblcmWybZtKxCwna7Hci1Wq1hIoopkn3JKjSjeDweyCWTyT+X4v8+yd5kIv+MqtVqYIZDhC8kexKzmUwmMCPLsgIzTKfTMtkjyW7AwJ+t1+vObPzDdi+l1+uxRqMhiqj/NsS3xgV/a6PGJfW7z+kI1EYU1Xi/9zZ/wBZo/lPU5H22uII+QBZciTOUxICfy/I+6XKkRbfPZ0ibdhPoQzbtu/iFXwEGAKzZj6kJ8IAuAAAAAElFTkSuQmCC);
	background-color: transparent;
	border: 0px;
	cursor: pointer;
}

#help_popup_close:active {
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEUzQkU5NjdGOEM1MTFFNjlCNzhEMzZFOUE2NEQ2MTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEUzQkU5NjZGOEM1MTFFNjlCNzhEMzZFOUE2NEQ2MTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REMzODkyMzgzOTA5MTFFNkEzOTlFMkRGOEVFOEY3REYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REMzODkyMzkzOTA5MTFFNkEzOTlFMkRGOEVFOEY3REYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6gjPeGAAABr0lEQVR42pyUMUjDQBSGr5IYhHaoRigOaltLKHTpUpe66aK4u+osqJODowg6iYKjuLqLk7gUHTp1aGkrrSHOUaeSYtrB/4VLSK7XoX3wUfLevS/kXe9ilUqFSWIF7IFtsAZ08A0+wTN4BF9ikyI8z4ELcAhUobbE2QDn4A6cAcdfMBNavAjewYlEJAbVj8Eb74vIZsETKLLJosj7tLDsCqyz6YL6Ln3ZMp9RELqus1KpxOLxeKQrkUh4+WQyKQqpf5VkB+JGZDIZpmkaKxQKgZBE9Ex5qks2cp9km2Kl2WyywWDAVFX1BKlUyvtVFIW5rstarZbsc7dINvKaXq/HGo1GIMzlcoGoXq8zx3FkMoNkC7IKCS3LiuRM0xwnopgn2Y+sQjNKp9ORXDabHdmUUPySzJSJwjNqt9uRGY4RfpDsVczm8/nIjGzbjszQMAyZ7IVk92AYznY6HW824WH7m9Lv91m32xVF1P8Q47fGNT9r08YN9fvH6RRUpxRVeX9wNl2wC2oTimq870+8gmxQBrfiDCUx5OvKvE96OdK0j/gM6abdob/XmJvWEt/wL8AAklSPdrY34BoAAAAASUVORK5CYII=);
}

#helpSearchArea {
	position: absolute;
	width: 100%;
	padding-left: 12px;
	padding-right: 12px;
	text-align: left;
	top: 48px;
}

#help_popup_search {
	background-image: linear-gradient(#f9f9f9, #e9e9e9);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#f9f9f9', endColorstr='#e9e9e9');
	height: 24px;
	padding-left: 10px;
	padding-right: 10px;
	border-radius: 2px;
	border: 1px solid #cdcdcd;
	font-size: 9pt;
	color: #555555
}

#help_popup_search:hover {
	background-image: linear-gradient(#f9f9f9, #f9f9f9);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#f9f9f9', endColorstr='#f9f9f9');
	border: 1px solid #cdcdcd;
}

#help_popup_search:active {
	background-image: linear-gradient(#c0c0c0, #dfdfdf);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#c0c0c0', endColorstr='#dfdfdf');
	border: 1px solid #b0b0b0;
}

#help_popup_select {
	right: 36px;
	height: 24px;
	padding-left: 10px;
	padding-right: 10px;
	border: 0px none;
	background-image: -moz-linear-gradient(90deg, #2481cf, #026dc7);
	background-image: -webkit-linear-gradient(90deg, #2481cf, #026dc7);
	background-image: linear-gradient(90deg, #2481cf, #026dc7);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr='#2481cf', endColorstr='#026dc7');
	border-radius: 2px;
	border: 1px solid #1c71b1;
	font-size: 9pt;
	color: #ffffff;
}

#help_popup_select:hover {
	background-image: -moz-linear-gradient(90deg, #3c9ef1, #2392ef);
	background-image: -webkit-linear-gradient(90deg, #3c9ef1, #2392ef);
	background-image: linear-gradient(90deg, #3c9ef1, #2392ef);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr='#3c9ef1', endColorstr='#2392ef');
	border: 1px solid #1c71b1;
}

#help_popup_select:active {
	background-image: -moz-linear-gradient(90deg, #0460ae, #0466b7);
	background-image: -webkit-linear-gradient(90deg, #0460ae, #0466b7);
	background-image: linear-gradient(90deg, #0460ae, #0466b7);
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr='#0460ae', endColorstr='#0466b7');
	border: 1px solid #1c71b1;
}

#help_popup_code {
	height: 24px;
	color: #555555;
	padding-left: 5px;
	padding-right: 5px;
	border: 1px solid #c8c8c8;
	width: 215px;
}
</style>
<div id="helpPopupWindow" class="popupBackground" style="">
	<div id="helpContainer" style="">
		<div id="helpTitle" style="">CODE HELP
			<button id="help_popup_close" onclick="popup.help.hide();"></button>
		</div>
		<div id="helpSearchArea">
			<label for="help_popup_code" style="font-size:9pt; color:#333333;">코드/명</label>
			<input type="text" id="help_popup_code" data-field="CODEGB" name="help_popup_code"/>
			<button id="help_popup_search">조회</button>
			<button id="help_popup_select">선택</button>
		</div>
		<div id="help_popup_grid1" style="position:absolute; top:85px; left:12px; width:calc(100% - 24px); height:403px;">
		</div>
	</div>
</div>