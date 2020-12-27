var KEY_F1 = 0x70;
var KEY_F2 = 0x71;
var KEY_F3 = 0x72;
var KEY_F4 = 0x73;
var KEY_F5 = 0x74;
var KEY_F6 = 0x75;
var KEY_F7 = 0x76;
var KEY_F8 = 0x77;
var KEY_F9 = 0x78;
var KEY_F10 = 0x79;
var KEY_F11 = 0x7A;
var KEY_F12 = 0x7B;
var KEY_ESC = 0x1B;

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var KEY_F2_VALID = true; // Default 'true'이며 F2 Key 사용여부

// 일반 KEY의 ASCII 코드값을 선언한다.
var KEY_TAB = 0x09;
var KEY_ENTER = 0x0D;
var KEY_SPACE = 0x20;
var KEY_BACKSPACE = 0x08;
var KEY_DELETE = 0x2E;

var browser = (function() {
	var s = navigator.userAgent.toLowerCase();
	var match = /(webkit)[ \/](\w.]+)/.exec(s) || /(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) || /(msie) ([\w.]+)/.exec(s) || /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) || [];
	return {
		name : match[1] || "",
		version : match[2] || "0"
	};
}());

var defaultArray = [{id:'*', value:'전체'}];

(function() {
	if (!window['console']) {
		window['console'] = {
			log : function() {
			}
		};
	}

	if (!window['initPage']) {
		window['initPage'] = function() {
			//console.log(initPage);
		}
	}
	
	// CSS 에서 브라우저 구분용 html[data-useragent*='MSIE 9.0'] #element
	document.documentElement.setAttribute('data-useragent', navigator.userAgent);  

	console.log("funcion initialize");
})();

var listener = {
	select : {
		change : function() {
		}
	},
	
	monthpicker : {
		select : function() {
//			console.log("monthpicker.select ", arguments);
		}
	},

	gridRow : {
		itemClick : function(rowId, colId, record, grid) {
//			console.log("gridRow.itemClick default", rowId, colId, record, grid);
		},

		click : function(record, grid) {
//			console.log("gridRow.click default", record, grid);
		},

		dblclick : function(record, grid) {
//			console.log("gridRow.dblclick default", record, grid);
		},

		callback : function(gridId, rowIdx, columnIdx) {
//			console.log("gridRow.callback default", gridId, rowIdx, columnIdx);
		}
	},

	gridEditor : {
		keydown : function(grid, state, editor, evt) {
//			console.log("gridEditor.keydown default", grid, state, editor, evt);
		},

		changed : function(grid, state, editor, ignore) {
//			console.log("gridEditor.changed default", grid, state, editor, ignore);
		},
		beforeEditStart : function(grid, record, curCol) {
//			console.log("gridEditor.beforeEditStart default", grid, record, curCol);
			return true;
		},
		checked : function(grid, row, column, state) {
//			console.log("gridEditor checked", grid, row, column, state);
		},
		selectchanged : function(colId, $el){
//			console.log("gridEditor.selectchanged default", oSel);
		}
	},

	editor : {
		keydown : function($el) {
//			console.log("editor.keydown", $el);
		},
		change : function($el) {
//			console.log("editor.change", $el);
		}
	},

	button : {
		"init" : {click : function() {/*console.log("button.init.click default", arguments);*/}},
		"new" : {click : function() {/*console.log("button.new.click default", arguments);*/}},
		"search" : {click : function() {/*console.log("button.search.click default", arguments);*/}},
		"save" : {click : function() {/*console.log("button.save.click default", arguments);*/}},
		"del" : {click : function() {/*console.log("button.del.click default", arguments);*/}},
		"addRow" : {click : function() {/*console.log("button.addRow.click default", arguments);*/}},
		"removeRow" : {click : function() {/*console.log("button.removeRow.click default", arguments);*/}},
		"add_row" : {click : function() {/*console.log("button.add_row.click default", arguments);*/}},
		"remove_row" : {click : function() {/*console.log("button.remove_row.click default", arguments);*/}},
		"copy" : {click : function() {/*console.log("button.copy.click default", arguments);*/}},
		"calc" : {click : function() {/*console.log("button.calc.click default", arguments);*/}},
		"calc_cancel" : {click : function() {/*console.log("button.calc_cancel.click default", arguments);*/}},
		"reCalc" : {click : function() {/*console.log("button.reCalc.click default", arguments);*/}},
		"reCalc_cancel" : {click : function() {/*console.log("button.reCalc_cancel.click default", arguments);*/}},
		"help" : {callback : function() {/*console.log("listener.button.help.callback default", arguments);*/}},
		"confirm" : {click : function() {/*console.log("listener.button.confirm.click default", arguments);*/}},
		"confirm_cancel" : {click : function() {/*console.log("listener.button.confirm_cancel.click default", arguments);*/}},
		"apply" : {click : function() {/*console.log("listener.button.apply.click default", arguments);*/}},
		"close" : {click : function() {/*console.log("listener.button.close.click default", arguments);*/}},
		"browse" : {change : function() {/*console.log("listener.button.browse.change default", arguments);*/}},
		"fileDown" : {click : function() {/*console.log("listener.button.fileDown.click default", arguments);*/}},
		"fileDownAll" : {click : function() {/*console.log("listener.button.fileDownAll.click default", arguments);*/}},
		"fileDelete" : {click : function() {/*console.log("listener.button.fileDelete.click default", arguments);*/}},
		"fileDeleteAll" : {click : function() {/*console.log("listener.button.fileDeleteAll.click default", arguments);*/}},
		"excelDown" : {click : function() {/*console.log("button.excelDown.click default", arguments);*/}},
		"renew" : {click : function() {/*console.log("button.renew.click default", arguments);*/}},
		"yearMarginRate" : {click : function() {/*console.log("button.yearMarginRate.click default", arguments);*/}},
		"fileAttach" : {click : function() {/*console.log("button.fileAttach.click default", arguments);*/}},
		"print" : {click : function() {/*console.log("button.print.click default", arguments);*/}},
		"select" : {click : function() {/*console.log("button.select.click default", arguments);*/}},
		"etc1Btn" : {click : function() {/*console.log("button.etc1Btn.click default", arguments);*/}},
		"etc2Btn" : {click : function() {/*console.log("button.etc2Btn.click default", arguments);*/}},
		"etc3Btn" : {click : function() {/*console.log("button.etc3Btn.click default", arguments);*/}},
		"etc4Btn" : {click : function() {/*console.log("button.etc4Btn.click default", arguments);*/}},
		"etc5Btn" : {click : function() {/*console.log("button.etc5Btn.click default", arguments);*/}}
	}
};

/*******************************************************************************
 * function isValidKey() : 현재 입력된 키가 처리해야될 키인지 체크하여 여부를 반환한다.
 * 
 * 반환값 : 처리해야될 키일 경우 true를 반환하고, 그렇지 않으면 false를 반환한다.
 * 
 * 처리 이벤트 : onKeyUp 이벤트에서 호출되는 함수내에서 사용가능하다.
 ******************************************************************************/
function isValidKey(evt) {
	if (evt == null)
		return false;

	// 키 이벤트가 발생하지 않았을 경우
	if (evt.which == 0x00)
		return true;

	// 기타 Function Key가 눌러졌을 경우
	if (evt.which == KEY_F12 || evt.which == KEY_F9 || evt.which == KEY_F5 || evt.which == KEY_F11) {
		return true;
	}

	// ALT, CTRL KEY가 눌러졌을 경우
	if (evt.altKey || evt.ctrlKey) {
		if (evt.which == 86 || evt.which == 88) {// CTRL+V,CTRL+X 를 유효한
			// evt로 처리하기 위해서
			return true;
		} else {
			return false;
		}
	}

	// 특수키(SPACE,DELETE,BACKSPACE)일 경우)
	if (evt.which == KEY_SPACE || evt.which == KEY_BACKSPACE || evt.which == KEY_DELETE)
		return true;

	// 숫자키(0~9)일 경우
	if (evt.which >= 0x30 && evt.which <= 0x39)
		return true;

	// 문자키(A~Z)일 경우
	if (evt.which >= 0x41 && evt.which <= 0x5A)
		return true;

	// 기호키(-=\,./;'[])일 경우
	if ((evt.which >= 0xBA && evt.which <= 0xBF) || (evt.which >= 0xDB && evt.which <= 0xDE))
		return true;

	// 키패드에 존재하는 키일 경우
	if ((evt.which >= 0x60 && evt.which <= 0x6B) || (evt.which >= 0x6D && evt.which <= 0x6F))
		return true;

	return false;
}

/*******************************************************************************
 * function isValidKey2() : 현재 입력된 키가 처리해야될 키인지 체크하여 여부를 반환한다. (isValidKey()와
 * 차이점은 Enter Key를 유효한 key로 return한다는 점이다.)
 * 
 * 반환값 : 처리해야될 키일 경우 true를 반환하고, 그렇지 않으면 false를 반환한다.
 * 
 * 처리 이벤트 : onKeyUp 이벤트에서 호출되는 함수내에서 사용가능하다.
 ******************************************************************************/
function isValidKey2(evt) {
	if (evt == null)
		return false;

	if (evt.which == KEY_F1 || evt.which == KEY_F2 || evt.which == KEY_F3 || evt.which == KEY_F4) {
		return false;
	}
	if (evt.which == KEY_F5 || evt.which == KEY_F6 || evt.which == KEY_F7 || evt.which == KEY_F8) {
		return false;
	}
	if (evt.which == KEY_F9 || evt.which == KEY_F10 || evt.which == KEY_F11 || evt.which == KEY_F12) {
		return false;
	}
	// shift, alt, ctrl
	if (evt.which == 16 || evt.which == 17 || evt.which == 18) {
		return false;
	}

	// Enter Key를 눌렀을 경우에 유효한 key로 true를 return한다.
	if (evt.which == KEY_ENTER || evt.which == KEY_BACKSPACE || evt.which == KEY_DELETE)
		if (evt.which == KEY_ENTER) {
			evt.preventDefault();
			return true;
		}

	return isValidKey(evt);
}

function disableAllControl(disabled) {
	if (disabled) {
		$(':input').each(function() {
			var $this = $(this);
			$this.prop('orgDisabled', $this.prop('disabled'));
			$this.prop('disabled', true);
		});
	} else {
		$(':input').each(function() {
			var $this = $(this);
			$this.prop('disabled', $this.prop('orgDisabled'));
		});
	}
	if (disabled) {
		$('.webix_dtable').each(function() {
			var $this = $(this);
			$this.parent().webix_datatable().disable();
		});
	} else {
		$('.webix_dtable').each(function() {
			var $this = $(this);
			$this.parent().webix_datatable().enable();
		});
	}
}

function isValidCondition(formSelector) {
	var $notValidCondList = $(formSelector + ' .has-error');
	if ($notValidCondList.length != 0) {
		alertModal($notValidCondList.first().find('.cond-input').attr('placeholder') + ' 을(를) 확인하세요.', '경고', function() {
			$notValidCondList.first().find('.cond-input').focus();
		});
		return false;
	}
	return true;
}

function gridGroupBy(gridObj, columndId) {
	var columns = gridObj.config.columns;
	var header = null;
	for (var i = 0; i < columns.length; i++) {
		header = columns[i].header;
		for (var j = 0; j < header.length; j++) {
			if (header[j] && header[j]['content'] == 'masterCheckbox') {
				$(document).ready(function() {
					columns[i] = $.extend(columns[i], {
						template : function(obj, common, value) {
							if (obj.$level == 1)
								return '';
							else
								return common.checkbox(obj, common, value, {
									checkValue : true
								});
						}
					});
				});
			}
		}
	}

	for (var i = 0; i < columns.length; i++) {
		if (columns[i]['id'] == columndId) {
			$(document).ready(function() {
				columns[i] = $.extend(columns[i], {
					template : function(obj, common) {
						if (obj.$level == 1)
							return common.icon(obj, common) + obj.value;
						else
							return obj[columndId];
					}
				});
			});
		}
	}

	var newMap = {};

	var footer = null;
	var summeryType = '';
	var footerId = '';
	for (var i = 0; i < columns.length; i++) {
		footer = columns[i].footer;
		for (var j = 0; j < footer.length; j++) {
			if (columns[i] != columndId && footer[j] && footer[j]['content'] && footer[j]['content'] != '') {
				footerId = columns[i]['id'];
				summeryType = null;
				if (footer[j]['content'] == 'summColumn' || footer[j]['content'] == 'sum') {
					summeryType = 'sum';
				} else if (footer[j]['content'] == 'maxColumn' || footer[j]['content'] == 'max') {
					summeryType = 'max';
				} else if (footer[j]['content'] == 'minColumn' || footer[j]['content'] == 'min') {
					summeryType = 'min';
				} else if (footer[j]['content'] == 'avgColumn' || footer[j]['content'] == 'avg') {
					summeryType = 'avg';
				} else if (footer[j]['content'] == 'cntColumn' || footer[j]['content'] == 'count') {
					summeryType = 'count';
				}
				if (summeryType) {
					newMap[footerId] = [
							footerId, summeryType
					];
					columns[i] = $.extend(columns[i], {
						template : function(obj, common) {
							if (obj.$level == 1) {
								return '<span style="width:100%;display:block;text-align:right">' + obj[footerId] + '</span>'
							} else
								return obj[footerId];
						}
					});
				}
			}
		}
	}

	return {
		scheme : {
			by : columndId,
			map : newMap
		}
	};
}

function getGroupConfig(config, columnId) {
	var columns = config.columns;
	var header = null;
	for (var i = 0; i < columns.length; i++) {
		header = columns[i].header;
		for (var j = 0; j < header.length; j++) {
			if (header[j] && header[j]['content'] == 'masterCheckbox') {
				columns[i] = $.extend(columns[i], {
					template : function(obj, common, value) {
						if (obj.$level == 1)
							return '';
						else
							return common.checkbox(obj, common, value, {
								checkValue : true
							});
					}
				});
			}
		}
	}

	for (var i = 0; i < columns.length; i++) {
		if (columns[i]['id'] == columnId) {
			columns[i] = $.extend(columns[i], {
				template : function(obj, common) {
					if (obj.$level == 1)
						return common.icon(obj, common) + obj.value;
					else
						return obj[columnId];
				}
			});
		}
	}

	var newMap = {};

	var footer = null;
	var summeryType = '';
	var footerId = '';
	for (var i = 0; i < columns.length; i++) {
		footer = columns[i].footer;
		for (var j = 0; j < footer.length; j++) {
			if (columns[i] != columnId && footer[j] && footer[j]['content'] && footer[j]['content'] != '') {
				footerId = columns[i]['id'];
				summeryType = null;
				if (footer[j]['content'] == 'summColumn' || footer[j]['content'] == 'sum') {
					summeryType = 'sum';
				} else if (footer[j]['content'] == 'maxColumn' || footer[j]['content'] == 'max') {
					summeryType = 'max';
				} else if (footer[j]['content'] == 'minColumn' || footer[j]['content'] == 'min') {
					summeryType = 'min';
				} else if (footer[j]['content'] == 'avgColumn' || footer[j]['content'] == 'avg') {
					summeryType = 'avg';
				} else if (footer[j]['content'] == 'cntColumn' || footer[j]['content'] == 'count') {
					summeryType = 'count';
				}
				if (summeryType) {
					formatter = columns[i].format || function(obj) {
						return obj;
					};
					newMap[footerId] = [
							footerId, summeryType
					];
					columns[i] = $.extend(columns[i], {
						template : function(obj, common) {
							if (obj.$level == 1) {
								return '<span style="width:100%;display:block;text-align:right">' + formatter(obj[footerId]) + '</span>'
							} else
								return formatter(obj[footerId]);
						}
					});
				}
			}
		}
	}

	return {
		by : columnId,
		map : newMap
	};
}

function checkFormValidation($formObj) {
	var $notValidCondList = $formObj.find('.has-error');
	if ($notValidCondList.length != 0) {
		alertModal($notValidCondList.first().find('.cond-input').attr('placeholder') + ' 을(를) 확인하세요.', '경고');
		$notValidCondList.first().find('.cond-input').focus();
		return false;
	} else {
		return true;
	}
}

/*
 * 자바스크립트 Date format()
 * //2011년 09월 11일 오후 03시 45분 42초
 * console.log(new Date().format("yyyy년 MM월 dd일 a/p hh시 mm분 ss초"));
 * //2011-09-11
 * console.log(new Date().format("yyyy-MM-dd"));
 * //'11 09.11
 * console.log(new Date().format("'yy MM.dd"));
 * //2011-09-11 일요일
 * console.log(new Date().format("yyyy-MM-dd E"));
 * //현재년도 : 2011
 * console.log("현재년도 : " + new Date().format("yyyy"));
 */
Date.prototype.format = function(f) {
	if (!this.valueOf())
		return " ";

	var weekName = [
			"일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"
	];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
		case "yyyy":
			return d.getFullYear();
		case "yy":
			return (d.getFullYear() % 1000).zf(2);
		case "MM":
			return (d.getMonth() + 1).zf(2);
		case "dd":
			return d.getDate().zf(2);
		case "E":
			return weekName[d.getDay()];
		case "HH":
			return d.getHours().zf(2);
		case "hh":
			return ((h = d.getHours() % 12) ? h : 12).zf(2);
		case "mm":
			return d.getMinutes().zf(2);
		case "ss":
			return d.getSeconds().zf(2);
		case "a/p":
			return d.getHours() < 12 ? "오전" : "오후";
		default:
			return $1;
		}
	});
};

String.prototype.string = function(len) {
	var s = '', i = 0;
	while (i++ < len) {
		s += this;
	}
	return s;
};
String.prototype.zf = function(len) {
	return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len) {
	return this.toString().zf(len);
};

function toQueryString(obj) {
	var result = "";
	
	try {
		for (var key in obj) {
			result += "&" + key + "=" + encodeURIComponent(obj[key]);
			//console.log(key, result);
		}
	} catch (e) {
		console.log(e);
	}
	
	//console.log(result);
	
	return result;
}

function isNull(data) {
	if (typeof data !== "undefined" && data !== null) {
		return false;
	} else {
		return true;
	}
}

function checkNull(val, rep) {
	if (isNull(val)) {
		return rep;
	} else {
		return val;
	}
}

function isEmpty(val) {
	if (typeof(val) == "string" || typeof(val) == "number") {
		if (isNull(val) || val == "") {
			return true;
		} else {
			return false;
		}
	} else if (typeof(val) == "array" || typeof(val) == "object") {
		if (val.length == 0) {
			return true;
		}
		
		return false;
	} else {
		return true;
	}
}

function checkEmpty(val, rep) {
	if (isNull(val) || val == "") {
		return rep;
	} else {
		return val;
	}
}

var telRegExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$/;
var timeRegExp = /^(0[0-9]|1[0-9]|2[0-3]):?([0-5][0-9])$/;
var positiveIntRegExp = /^0$|^[1-9][0-9]*$/;
var negativeIntRegExp = /^0$|^-[1-9][0-9]*$/;
var intRegExp = /^0$|^-?[1-9][0-9]*$/;
var positivePercentRegExp = /^0( ?%)?$|^[1-9][0-9]*%?$/;
var negativePercentRegExp = /^0( ?%)?$|^-[1-9][0-9]*%?$/;
var percentRegExp = /^0( ?%)?$|^-?[1-9][0-9]*%?$/;
var positiveNumberRegExp = /^0$|^0.[0-9]*[1-9]$|^[1-9][0-9]*(.[0-9]*[1-9])?$/;
var negativeNumberRegExp = /^0$|^-0.[0-9]*[1-9]$|-[1-9][0-9]*(.[0-9]*[1-9])?$/;
var numberRegExp = /^-?[0-9]+(.[0-9]*[1-9])?$/;
var yearMonthRegExp = /^([\d]{4})-?(0[1-9]|1[0-2])$/;
var dateRegExp = /^(19[0-9][0-9]|20\d{2})-?(0[0-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])$/;

function getSelectList(code, param, total) {
	var selectList = null;
	var callback = new Callback(function(result) {
		//console.log("result selectlist", result);
		selectList = JSON.parse(result);
	});
	
	callback.async = false;
	CodeService.getSelectList("HELP", code, param, total, callback);
	
	return selectList
}

function downloadForm(PGMID) {
	var frame = $('<iframe class="downloadFrame" style="display: none;"></iframe>');
	frame.attr('src', "/jsp/common/downloadForm.jsp?PGMID=" + PGMID);
	$("body").after(frame);
	
	setTimeout(function() {
		$("iframe.downloadFrame").remove();
	}, 1000);
}


/*
function check(){
	$$("dt").getHeaderContent("mc1").check();
};
function uncheck(){
	$$("dt").getHeaderContent("mc1").uncheck();
};
function isChecked(){
	var state = $$("dt").getHeaderContent("mc1").isChecked();
	webix.message(state?"checked":"unchecked");
};
*/

function rpad(value, length, str) {
	var addLen = length - value.length;
	for (var i = 0; i < addLen; i++) {
		value += str;
	}
	return value;
}

function lpad(value, len, str) {
	var v = value + "";
	var size = len - v.length;

	if (v.length < len) {
		for (var i = 0; i < size; i++) {
			v = str + v;
		}
	}

	return v;
}

function getQuarter(strDate) {
	var result = "";
	
	if (isEmpty(strDate)) {
		strDate = new Date().format("yyyy-MM");
	}
	
	var month = Number(strDate.substring(5, 7));
	
	if (month > 12 || month < 1) {
		month =  Number(new Date().format("yyyy-MM").substring(5, 7));
	}
	
	if (month >= 1 && month <= 3) {
		result = "1";
	} else if (month >= 4 && month <= 6) {
		result = "2";
	} else if (month >= 7 && month <= 9) {
		result = "3";
	} else if (month >= 10 && month <= 12) {
		result = "4";
	}
	
	return result;
}

Array.prototype.remove = function(idx) {
	this.splice(idx, 1);
}

function httpRequest(url, params, callback, async) {
	$.ajax({
		type : 'post',
		dataType : 'json',
		url : url,
		data : params,
		async : async,
		success : function(response) {
			if (callback) {
				callback(response);
			}
		},
		error : function(response) {
			consoleLog("E", "server-side failure with response: ", response);
		},
	});
}

function ckRegPwd(val){
	var regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{10,20}/;
	
	return regex.test(val);
}