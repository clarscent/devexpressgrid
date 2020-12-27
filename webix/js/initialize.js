var popup = {
	help : {
		show : function() {
			top.popup.help.show.apply(top.popup.help, arguments);
		},
		hide : function() {
			top.popup.help.hide.apply(top.popup.help, arguments);
		}
	}
};

/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com), Edited by Genie. */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

datepicker.regional['ko'] = {
	closeText: '닫기',
	prevText: '이전달',
	nextText: '다음달',
	currentText: '오늘',
	monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
	monthNamesShort: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
	dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
	dayNamesShort: ['일','월','화','수','목','금','토'],
	dayNamesMin: ['일','월','화','수','목','금','토'],
	weekHeader: '주',
	dateFormat: 'yy-mm-dd',
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: true,
	yearSuffix: '년'};
datepicker.setDefaults(datepicker.regional['ko']);

return datepicker.regional['ko'];

}));

(function($) {
	// Number Onry
	$.fn.allowOnlyNumeric = function() {

		/**
		 * The interval code is commented as every 250 ms onchange of the textbox
		 * gets fired.
		 */

		// var createDelegate = function(context, method) {
		// return function() { method.apply(context, arguments); };
		// };
		/**
		 * Checks whether the key is only numeric.
		 */
		var isValid = function(key) {
			var validChars = "0123456789.-";
			var validChar = validChars.indexOf(key) != -1;
			return validChar;
		};

		/**
		 * Fires the key down event to prevent the control and alt keys
		 */
		var keydown = function(evt) {
			if (evt.ctrlKey || evt.altKey) {
				evt.preventDefault();
			}
		};

		/**
		 * Fires the key press of the text box
		 */
		var keypress = function(evt) {
			if ($(this).prop('readOnly')) return;
			var scanCode;
			// scanCode = evt.which;
			if (evt.charCode) { // For ff
				scanCode = evt.charCode;
			} else { // For ie
				scanCode = evt.which;
			}

			if (scanCode && scanCode >= 0x20 /* space */) {
				var c = String.fromCharCode(scanCode);
				if (!isValid(c)) {
					evt.preventDefault();
				}
			}
		};

		/**
		 * Fires the lost focus event of the textbox
		 */
		var onchange = function() {
			var result = [];
			var enteredText = $(this).val();
			for (var i = 0; i < enteredText.length; i++) {
				var ch = enteredText.substring(i, i + 1);
				if (isValid(ch)) {
					result.push(ch);
				}
			}
			var resultString = result.join('');
			if (enteredText != resultString) {
				$(this).val(resultString);
			}

		};

		// var _filterInterval = 250;
		// var _intervalID = null;

		// var _intervalHandler = null;

		/**
		 * Dispose of the textbox to unbind the events.
		 */
		this.dispose = function() {
			$(this).die('change', onchange);
			$(this).die('keypress', keypress);
			$(this).die('keydown', keydown);
			// window.clearInterval(_intervalHandler);
		};

		$(this).on('change', '', onchange);
		$(this).on('keypress', '', keypress);
		$(this).on('keydown', '', keydown);
		// _intervalHandler = createDelegate(this, onchange);
		// _intervalID = window.setInterval(_intervalHandler, _filterInterval);
		return this;
	}

	$(window).on('load', function() {
		$('[data-format=number]').each(function() {
			var $spy = $(this)
			$spy.allowOnlyNumeric()
		})
	});
})(jQuery);


(function($) {
// Upper Case Only
	$.fn.allowOnlyUpperCase = function() {

		var keypress = function(evt) {
			if (evt.which == 0) return;
			
			if ($(this).prop('readOnly')) return;

			if (evt.target.value.length >= evt.target.maxLength && evt.target.maxLength != -1) {
				if (evt.target.selectionStart == evt.target.selectionEnd) {
					evt.preventDefault();
					return;
				}
			}

			var stNum = evt.target.selectionStart;
			var endNum = evt.target.selectionEnd;

			var curValue = evt.target.value;

			var leftValue = curValue.substring(0, stNum);
			var rightValue = curValue.substring(endNum);

			var keyChar = String.fromCharCode(evt.which);

			if (keyChar >= 'a' && keyChar <= 'y') {
				evt.target.value = leftValue + String.fromCharCode(Number(evt.which) - 32) + rightValue;
				evt.preventDefault();
			} else if (keyChar >= 'A' && keyChar <= 'Z') {
				evt.target.value = leftValue + String.fromCharCode(evt.which) + rightValue;
				evt.preventDefault();
			} else if (keyChar >= '0' && keyChar <= '9') {
				evt.target.value = leftValue + String.fromCharCode(evt.which) + rightValue;
				evt.preventDefault();
			} else if (keyChar == '*') {
				evt.target.value = leftValue + '*' + rightValue;
				evt.preventDefault();
			}

			evt.target.selectionStart = stNum + 1;
			evt.target.selectionEnd = stNum + 1;
		};

		this.dispose = function() {
			$(this).off('keypress', keypress);
		};

		$(this).on('keypress', keypress);

		//$(this).css('text-transform', 'uppercase');
		return this;
	}

	$(window).on('load', function() {
		$('[data-format=upper]').each(function() {
			var $spy = $(this)
			$spy.allowOnlyUpperCase()
		})
	});
})(jQuery);

var initializeConfig = {
	addGridResizeEvent: function () {
		$(window).resize(function () {
			$('.webix_dtable').each(function () {
				var $this = $(this);
				var _dataTable = $$($this.parent().attr("id"));

				if (!_dataTable._viewobj) {
					return false;
				}

				var x = _dataTable._viewobj.parentNode.offsetWidth || 0;
				var y = _dataTable._viewobj.parentNode.offsetHeight || 0;

				var sizes = _dataTable.$getSize(0, 0);

				//minWidth
				if (sizes[0] > x) x = sizes[0];
				//minHeight
				if (sizes[2] > y) y = sizes[2];

				//maxWidth rule
				if (x > sizes[1]) x = sizes[1];
				//maxHeight rule
				if (y > sizes[3]) y = sizes[3];

				var y2 = y - 2;

				_dataTable.$setSize(x, y2);

				//_dataTable.adjust();
			});
		});
	},
}

$(document).ready(function() {
	$("input[readonly]").on("focus", function() {
		//$(this).blur();
	});

	initializeConfig.addGridResizeEvent();
	
	webix.ready(function() {
		setTimeout(initPage, 1);
	});
});

$(function() {
	var w = window;
	if (w.frameElement != null && w.frameElement.nodeName === "IFRAME" && w.parent.jQuery) {
		w.parent.jQuery(w.parent.document).trigger("iframeready", w.frameElement.id);
	}
});