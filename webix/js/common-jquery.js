
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
		$('[data-restrict=numeric]').each(function() {
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
		$('[data-restrict=uppercase]').each(function() {
			var $spy = $(this)
			$spy.allowOnlyUpperCase()
		})
	});
})(jQuery);


+function($) {
	'use strict';

	// DROPDOWN CONDITION CLASS DEFINITION
	// ==========================

	function DropdownCondition(element, options) {

		this.options = $.extend({}, DropdownCondition.DEFAULTS, options)

		var ulWidthStr = "";
		if (!isNull(this.options.width) && !(/^[0123456789]*$/g).test(this.options.width)) {
			ulWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				ulWidthStr += 'px';
			}
			ulWidthStr += '"';
		}

		var liWidthStr = "";
		if (!isNull(this.options.width)) {
			liWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				liWidthStr += 'px';
			}
			liWidthStr += '"';
		}

		var tagTemplate = '';
		tagTemplate += '<ul id="' + options.id + 'Container" class="nav navbar-nav search-nav cond-wrapper" ' + ulWidthStr + ' >';
		tagTemplate += '<li class="cond-li" ' + liWidthStr + ' >';
		tagTemplate += '	<div class="form-group" style="width:100%">';
		if (options.required) {
			tagTemplate += '		<label class="cond-label" for="' + options.id + '">*' + options.label + '</label>';
		} else {
			tagTemplate += '		<label class="cond-label" for="' + options.id + '">' + options.label + '</label>';
		}
		tagTemplate += '	<div id="' + options.id + 'Group" class="input-group has-normal input-append date" style="width:100%">';
		tagTemplate += '			<input id="' + options.id + '" name="' + options.id + '" type="text" class="navbar-btn form-control cond-input cond-default"';
		if (options.required) {
			tagTemplate += '					placeholder="*' + options.label + '">';
		} else {
			tagTemplate += '					placeholder="' + options.label + '">';
		}
		tagTemplate += '			<span class="input-group-btn" style="width: auto">';
		tagTemplate += '				<button id="' + this.options.id + 'Button" class="btn btn-default navbar-btn form-control" type="button"><span class="glyphicon glyphicon-chevron-down"></span></button>';
		tagTemplate += '			</span>';
		tagTemplate += '		</div>';
		tagTemplate += '		<div id="' + options.id + 'ListDiv" class="cond-dropdown dropdown">';
		tagTemplate += '			<ul id="' + options.id + 'List" class="dropdown-menu" style="max-height: 300px; overflow: auto"></ul>';
		tagTemplate += '		</div>';
		tagTemplate += '	</div>';
		tagTemplate += '</li></ul>';
		
		var self = this;

		this.$container = $(tagTemplate);

		$(element).replaceWith(this.$container);

		var $element = this.$element = this.$container.find('#' + self.options.id);
		
		$element.data('sjinc.dropdownCondition', this);

		var focusNextElement = function($pElement) {
			var $form = $pElement.parents('form');
			var $wrapper = $pElement.parents('.cond-wrapper');
			var $allWrapper = $form.find('.cond-wrapper');
			var isFound= false;
			var isFocused = false;
			
			$allWrapper.each(function() {
				var $self = $(this);
				if (isFound) {
					var $el = $self.find('*:input:first:not(:disabled):not([readonly])');
					if ($el.length > 0) {
						$el.focus();
						isFocused = true;
						return false;
					} else {
						return true;
					}
				}
				if ($self.get(0) == $wrapper.get(0)) {
					isFound = true;
				}
			});
			
			if (!isFocused) {
				try {
					if ($pElement.parents('form[name=search-form],form.search-form').length > 0) {
						_btnSearchClick();
					}
					$(':focus').blur();
				} catch (ex) {
					alert(ex);
				}
			}

		};

		var checkboxClickHandler = function(evt) {
			var options = self.options;
			if (!$element.prop('disabled')) {
				$element.val('');
				$element.prop('val', '');
				var dataList = [];
				var selectorStr = '';
				if (options.multiSelect) {
					selectorStr = '#' + options.id + 'List *:input:checked:not(*[data-value=\\*])';
				} else {
					selectorStr = '#' + options.id + 'List *:input:checked';
				}
				$(selectorStr).each(function() {
					var $this = $(this);
					var data = eval('(' + $this.data('tag') + ')');
					dataList.push(data);
				});
				$element.val(convertDataListToDisplay(dataList, options.returnCodeMapping, options.returnNameMapping));
				$element.prop('val', convertDataListToCode(dataList, options.returnCodeMapping, options.returnNameMapping));
				$element.prop('dataList', dataList);
				if (dataList.length == 0) {
					if (options.required) {
						$('#' + options.id + 'Container .input-group').addClass('has-error');
						$('#' + options.id + 'Container .input-group').removeClass('has-normal');
					} else {
						$('#' + options.id + 'Container .input-group').removeClass('has-error');
						$('#' + options.id + 'Container .input-group').addClass('has-normal');
					}
				} else {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
				$element.change();
				if (!options.multiSelect) {
					$('#' + options.id + 'ListDiv').removeClass('open');
					$element.focus().select();
				}
			}
		};
		
		var checkboxKeydownHandler = function(evt) {
			var options = self.options;
			var handled = false;
			var next = false;
			if (evt.which == KEY_DOWN) {
				handled = true;
				var $inputList = $('#' + options.id + 'List *:input');
				next = false;
				for (var i = 0; i < $inputList.length; i++) {
					if (next) {
						$inputList.get(i).focus();
						break;
					} else if ($inputList.get(i) == this) {
						next = true;
					}
				}
			} else if (evt.which == KEY_UP) {
				handled = true;
				var $inputList = $('#' + options.id + 'List *:input');
				next = false;
				for (var i = $inputList.length - 1; i >= 0; i--) {
					if (next) {
						$inputList.get(i).focus();
						break;
					} else if ($inputList.get(i) == this) {
						next = true;
					}
				}
			} else if (evt.which == KEY_ESC) {
				handled = true;
				$('#' + options.id + 'ListDiv').removeClass('open');
				$element.focus();
			} else if (evt.which == KEY_ENTER) {
				handled = true;
				$('#' + options.id + 'ListDiv').removeClass('open');
				$element.focus();
			}
			
			if (handled) {
				evt.preventDefault();
				evt.stopPropagation()
				evt.stopImmediatePropagation()
				return false;
			}
		};


		var depedentChangeHandler = function($element) {
			var data = $element.data('sjinc.dropdownCondition');
			var options = data.options;

			var param = $.extend({}, options.defaultParam);
			var depValid = true;
			if (options.dependentConditions != '') {
				var dependentConditionsStrList = options.dependentConditions.split(',');
				for (var i = 0; i < dependentConditionsStrList.length; i++) {
					var depConditionStr = dependentConditionsStrList[i].trim();
					var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));

					if (((/\[.*\]/g).exec(depConditionStr) + "").indexOf('*') > -1) {
						if ($depCondition.prop('val') == '' || !$depCondition.parents('.input-group').hasClass('has-normal')) {
							depValid = false;
						}
					} else {
						if (!$depCondition.parents('.input-group').hasClass('has-normal')) {
							depValid = false;
						}
					}

					var mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
					param[mappingName] = $depCondition.prop('val');
				}
			}

			$('#' + options.id + 'List').html('');
			
			if (depValid) {
				try {
					param = $.extend(param, options.listQueryParam);
					if (options.allSelect) {
						var labelStr = '';
						var inputStr = '';
						var divStr = '';

						if (options.multiSelect) {
							divStr = '<div class="checkbox"></div>';
						} else {
							divStr = '<div class="radio"></div>';
						}
						var tmpData = {};
						tmpData[options.returnCodeMapping] = '*';
						tmpData[options.returnNameMapping] = '전체';
						if (options.multiSelect) {
							inputStr += '	<input type="checkbox" name="' + options.id + '" data-value="' + tmpData[options.returnCodeMapping] + '" data-tag="' + JSON.stringify(tmpData).replace(/"/g, "'") + '">';
						} else {
							inputStr += '	<input type="radio" name="' + options.id + '" data-value="' + tmpData[options.returnCodeMapping] + '" data-tag="' + JSON.stringify(tmpData).replace(/"/g, "'") + '">';
						}
						labelStr += '	<label>';
						labelStr += convertDataToDisplay(tmpData, options.returnCodeMapping, options.returnNameMapping);
						labelStr += '	</label>';
						
						var $label = $(labelStr);
						var $div = $(divStr);
						var $input = $(inputStr);
						var $tmp = $('<li style="padding-left: 10px"></li>');
						$input.on('keydown', checkboxKeydownHandler)
						if (options.multiSelect) {
							$input.on('click', function(evt) {
								var self = this;
								$('#' + options.id + 'List :input').each(function() {
									if (this != self) {
										$(this).prop('checked', $(self).prop('checked'));
										checkboxClickHandler();
									}
								});
							});
						} else {
							$input.on('click', checkboxClickHandler);
						}
						$label.append($input);
						$div.append($label);
						$tmp.append($div);
						$('#' + options.id + 'List').append($tmp);
						$('#' + options.id + 'List').append($('<li role="presentation" class="divider"></li>'));
					}
									
					window[options.serviceName][options.methodName](param, {
						callback: function(pValue) {
							if (pValue && pValue['ISERROR'] == 'N' && pValue['DATA'].length > 0) {
								for (var i = 0; i < pValue['DATA'].length; i++) {
									var labelStr = '';
									var inputStr = '';
									var divStr = '';

									if (options.multiSelect) {
										divStr = '<div class="checkbox"></div>';
									} else {
										divStr = '<div class="radio"></div>';
									}
									if (options.multiSelect) {
										inputStr += '	<input type="checkbox" name="' + options.id + '" data-value="' + pValue['DATA'][i][options.returnCodeMapping] + '" data-tag="' + JSON.stringify(pValue['DATA'][i]).replace(/"/g, "'") + '">';
									} else {
										inputStr += '	<input type="radio" name="' + options.id + '" data-value="' + pValue['DATA'][i][options.returnCodeMapping] + '" data-tag="' + JSON.stringify(pValue['DATA'][i]).replace(/"/g, "'") + '">';
									}
									labelStr += '	<label>';
									labelStr += convertDataToDisplay(pValue['DATA'][i], options.returnCodeMapping, options.returnNameMapping);
									labelStr += '	</label>';
									
									var $label = $(labelStr);
									var $div = $(divStr);
									var $input = $(inputStr);
									var $tmp = $('<li style="padding-left: 10px"></li>');
									$input.on('click', checkboxClickHandler).on('keydown', checkboxKeydownHandler);
									$label.append($input);
									$div.append($label);
									$tmp.append($div);
									$('#' + options.id + 'List').append($tmp);
								}
							} else if (pValue['ISERROR'] != 'N') {
								alert(JSON.stringify(pValue));
							}
						}
						, async: false
					});
				} catch (ex) {
				}
			}
		}


		
		$element.on('keyup', function(evt) {
			if (__popupId == '') {
				try {
					parent.popover('show', $(this));
				} catch (ex) {}
			} else {
				$element.popover({
					content: $element.attr('placeholder'),
					trigger: 'manual',
					placement: 'top',
					container: 'body'
				});
				var elementOffset = $element.offset();
				//$element.popover('tip').css('left', "-100px");
				$element.popover('show');
			}

			if (evt.which == KEY_ESC) {
				$('#' + self.options.id + 'Button').click();
				evt.preventDefault();
				evt.stopPropagation()
				evt.stopImmediatePropagation()
				return;
			}
			if (isValidKey(evt)) $element.prop('val', '');
			var handled = false;
			if ($element.prop('val') == '') {
				if (evt.which == KEY_ENTER) {
					handled = true;
					if (self.options.required && $(this).val() == '') {
						$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
						$('#' + self.options.id + 'Container .input-group').addClass('has-error');
					}
				} else {
					if ($element.val() != '') {
						$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
						$('#' + self.options.id + 'Container .input-group').addClass('has-error');
					} else {
						if (options.required) {
							$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
							$('#' + self.options.id + 'Container .input-group').addClass('has-error');
						} else {
							$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
							$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
						}
					}
				}
			}
			
			if (handled) {
				evt.preventDefault();
			}
		});
		
		$element.on('keydown', function(evt) {
			if ($element.prop('disabled') || $element.prop('readOnly')) {
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				return;
			}
			if (!isValidKey2(evt)) return;

			var handled = false;
			if (evt.which == KEY_ENTER) {
				handled = true;
				if ($element.prop('val') && $element.prop('val') != '') {
					focusNextElement($element);
				} else if (self.options.required && $(this).val() == '') {
					alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) 필수입니다.', '경고', function(result) {
						$element.focus();
					});
				} else if ($element.val() == '') {
					focusNextElement($element);
				} else if ($element.val() == '*' && self.options.allSelect) {
					if (self.options.validLength != -1 && $element.val().length != self.options.validLength) {
						alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) ' + self.options.validLength + ' 글자를 입력하셔야 합니다.', '경고', function(result) {
							$element.focus();
						});
						return;
					}
					var data = {}
					data[self.options.returnCodeMapping] = '*';
					data[self.options.returnNameMapping] = 	'전체';
					$element.val(convertDataToDisplay(data, self.options.returnCodeMapping, self.options.returnNameMapping));
					$element.prop('val', '*');
					$element.prop('dataList', [data]);

					$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
					$('#' + self.options.id + 'Container .input-group').addClass('has-normal');

					focusNextElement($element);
				} else {
					var depValid = true;
					if (self.options.dependentConditions != '') {
						var dependentConditionsStrList = self.options.dependentConditions.split(',');
						for (var i = 0; i < dependentConditionsStrList.length; i++) {
							var depConditionStr = dependentConditionsStrList[i].trim();
							if (((/\[.*\]/g).exec(depConditionStr) + "").indexOf('*') > -1) {
								var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
								if ($depCondition.prop('val') == '') {
									alertModal($depCondition.attr('placeholder').replace(/\*/g, "") + ' 을(를) 확인하세요.', '경고', function(result) {
										$depCondition.focus();
									});
									depValid = false;
									break;
								}
							}
						}
					}
					if (depValid) {

						try {
							var param = $.extend({}, self.options.defaultParam);
							if (self.options.dependentConditions != '') {
								var mappingName = null;
								var dependentConditionsStrList = self.options.dependentConditions.split(',');
								for (var i = 0; i < dependentConditionsStrList.length; i++) {
									var depConditionStr = dependentConditionsStrList[i].trim();
									var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
									mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
									param[mappingName] = $depCondition.prop('val');
								}
							}

							for (var i = 0; i < self.options.paramMappingList.length; i++) {
								param[self.options.paramMappingList[i]] = $element.val();
							}
							param = $.extend(param, self.options.codeQueryParam);
							window[self.options.serviceName][self.options.methodName](param, {
								callback: function(pValue) {
									if (pValue && pValue['ISERROR'] == 'N') {
										if (pValue['DATA'].length > 0) {
											if (pValue['DATA'].length > 1 && !self.options.multiSelect) {
												alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 을(를) 확인하세요.', '경고', function(result) {
													$element.focus();
												});
												return;
											}
											$element.val(convertDataListToDisplay(pValue['DATA'], self.options.returnCodeMapping, self.options.returnNameMapping));
											$element.prop('val', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
											$element.prop('dataList', pValue['DATA']);

											$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
											$('#' + self.options.id + 'Container .input-group').addClass('has-normal');

											$element.change();
											focusNextElement($element);
										} else {
											alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 을(를) 확인하세요.', '경고', function(result) {
												$element.focus();
											});
										}
									} else {
										alertModal('에러가 발생했습니다. 전산실로 문의하세요.\n' + pValue['ERROR_MSG'], '경고', function(result) {
											$element.focus();
										});
									}
								}
								, async: false
							});
						} catch (ex) {
							console.log(ex);
						}
					}
				}
			} else {
				$element.change();
				$element.prop('val', '');
				$element.keyup();
				$('#' + self.options.id + 'ListDiv').removeClass('open');
			}
			
			if (handled) {
				evt.preventDefault();
			}
		});
		
		$element.on('focus', function() {
			var $this = $(this);
			$this.keyup();
			setTimeout(function() {
				$this.select();
			}, 1);
		});
		
		$element.on('change', function() {
			if ($element.prop('val') == '') {
				if (self.options.required && $(this).val() == '') {
					$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
					$('#' + self.options.id + 'Container .input-group').addClass('has-error');
				}
			}
		});

		$element.on('blur', function() {
			if (__popupId == '') {
				try {
					parent.popover('hide', $(this));
				} catch (ex) {}
			} else {
				if ($element.data('bs.popover')) {
					$element.popover('destroy');
				}
			}
		});
		
		$('#' + self.options.id + 'Button').on('click', function() {
			if ($element.is(':disabled')) return;
			var $this = $(this);
			
			if ($('#' + self.options.id + 'ListDiv').hasClass('open')) {
				$('#' + self.options.id + 'ListDiv').removeClass('open');
			} else {
				var depValid = true;
				if (self.options.dependentConditions != '') {
					var dependentConditionsStrList = self.options.dependentConditions.split(',');
					for (var i = 0; i < dependentConditionsStrList.length; i++) {
						var depConditionStr = dependentConditionsStrList[i].trim();
						if (((/\[.*\]/g).exec(depConditionStr) + "").indexOf('*') > -1) {
							var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
							if ($depCondition.prop('val') == '') {
								alertModal($depCondition.attr('placeholder').replace(/\*/g, "") + ' 을(를) 확인하세요.', '경고', function(result) {
									$depCondition.focus();
								});
								depValid = false;
								break;
							}
						}
					}
				}
				if (depValid) {
					try {
					$('#' + self.options.id + 'ListDiv :input').prop('checked', false);
					$('#' + self.options.id + 'ListDiv').addClass('open');
					var codeListStr = $element.prop('val');
					if (codeListStr && codeListStr != '') {
						var codeList = codeListStr.split(__codeFieldDelim);
						for (var i = 0; i < codeList.length; i++) {
							$('#' + self.options.id + 'ListDiv :input[data-value=' + (codeList[i] == '*' ? '\\' + codeList[i] : codeList[i]) + ']').prop('checked', true);
						}
					}
					$('#' + self.options.id + 'ListDiv :input:first').focus();
					} catch (ex) {
						alert(ex);
					}
				}
			}
			try {
				parent.resizeHandler();
			} catch (ex) {
				console.log(ex);
			}
		});

		$(document).ready(function() {
			if (self.options.dependentConditions != '') {
				var dependentConditionsStrList = self.options.dependentConditions.split(',');
				for (var i = 0; i < dependentConditionsStrList.length; i++) {
					var depConditionStr = dependentConditionsStrList[i].trim();
					var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
					$depCondition.on('change', function(evt) {
						$element.val('');
						$element.prop('val', '');
						$element.change();
						depedentChangeHandler($element);
					});
					$depCondition.on('keyup', function(evt) {
						if (!isValidKey2(evt)) return;
						$element.val('');
						$element.prop('val', '');
						$element.change();
						depedentChangeHandler($element);
					});
					$depCondition.change();
				}
			}
		
			if (self.options.preload && self.options.dependentConditions == '') {
				depedentChangeHandler($element);
			}
			
			$element.val(self.options.text);
			$element.prop('val', self.options.val);
			$element.prop('defaultVal', self.options.val);
			$element.prop('defaultText', self.options.text);
			
			if (self.options.val != '') {
				if (self.options.val == '*' && self.options.allSelect && !self.options.multiSelect) {
					var data = {}
					data[self.options.returnCodeMapping] = '*';
					data[self.options.returnNameMapping] = 	'전체';
					$element.val(convertDataToDisplay(data, self.options.returnCodeMapping, self.options.returnNameMapping));
					$element.prop('val', '*');
					$element.prop('dataList', [data]);
					$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
					$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
				} else if (self.options.val == '*' && self.options.multiSelect) {
					$('#' + self.options.id + 'List :input').each(function() {
						if ($(this).attr('data-value') != '*') {
							$(this).prop('checked', true);
							checkboxClickHandler();
						}
					});
				} else {
					var param = $.extend({}, self.options.defaultParam);
					for (var i = 0; i < self.options.paramMappingList.length; i++) {
						param[self.options.paramMappingList[i]] = self.options.val;
					}
					try {
						param = $.extend(param, self.options.codeQueryParam);
						if (self.options.dependentConditions != '') {
							var mappingName = null;
							var dependentConditionsStrList = self.options.dependentConditions.split(',');
							for (var i = 0; i < dependentConditionsStrList.length; i++) {
								var depConditionStr = dependentConditionsStrList[i].trim();
								var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
								mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
								param[mappingName] = $depCondition.prop('val');
							}
						}
						window[self.options.serviceName][self.options.methodName](param, {
							callback: function(pValue) {
								if (pValue && pValue['ISERROR'] == 'N' && pValue['DATA'].length > 0) {
									$element.val(convertDataListToDisplay(pValue['DATA'], self.options.returnCodeMapping, self.options.returnNameMapping));
									$element.prop('val', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
									$element.prop('dataList', pValue['DATA']);
									$element.prop('defaultVal', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
									$element.prop('defaultDataList', pValue['DATA']);
									$element.prop('defaultText', $element.val());
									$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
									$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
								}
							}
							, async: false
						});
					} catch (ex) {
						console.log(ex);
					}
				}
			}

			if (self.options.required && $element.prop('val') == '') {
				$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
				$('#' + self.options.id + 'Container .input-group').addClass('has-error');
			}
			
			$('#' + self.options.id + 'List').css('max-height', Math.min($(document).height() - $('.cond-container').outerHeight(true) - 10, 300) + 'px');
		});
	}
	

	DropdownCondition.DEFAULTS = {
		required: false,
		val: '',
		text: '',
		paramMappingList: ['코드', '코드명'],
		returnCodeMapping: '코드',
		returnNameMapping: '코드명',
		serviceName: 'codeService',
		methodName: 'getCodeList',
		defaultParam: {},
		dependentConditions: '',
		multiSelect: false,
		allSelect: false,
		preload: false,
		validLength: -1,
		width: 160
	}

	DropdownCondition.prototype.val = function(pValue) {
		if (!isNull(pValue)) {
			if (pValue == '') {
				this.$element.val('');
				this.$element.prop('val', '');
				if (this.options.required && this.$element.val() == '') {
					$('#' + this.options.id + 'Container .input-group').removeClass('has-normal');
					$('#' + this.options.id + 'Container .input-group').addClass('has-error');
				} else {
					$('#' + this.options.id + 'Container .input-group').removeClass('has-error');
					$('#' + this.options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (this.options.allSelect && pValue == '*') {
				var data = {}
				data[this.options.returnCodeMapping] = '*';
				data[this.options.returnNameMapping] = 	'전체';
				this.$element.val(convertDataToDisplay(data, this.options.returnCodeMapping, this.options.returnNameMapping));
				this.$element.prop('val', '*');
				this.$element.prop('dataList', [data]);
			} else {
				var self = this;
				var param = $.extend({}, self.options.defaultParam);
				param = $.extend(param, self.options.codeQueryParam);
				if (self.options.dependentConditions != '') {
					var mappingName = null;
					var dependentConditionsStrList = self.options.dependentConditions.split(',');
					for (var i = 0; i < dependentConditionsStrList.length; i++) {
						var depConditionStr = dependentConditionsStrList[i].trim();
						var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
						mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
						param[mappingName] = $depCondition.prop('val');
					}
				}
				for (var i = 0; i < self.options.paramMappingList.length; i++) {
					param[self.options.paramMappingList[i]] = pValue;
				}
				try {
					window[self.options.serviceName][self.options.methodName](param, {
						callback: function(pValue) {
							if (pValue && pValue['ISERROR'] == 'N' && pValue['DATA'].length > 0) {
								self.$element.val(convertDataListToDisplay(pValue['DATA'], self.options.returnCodeMapping, self.options.returnNameMapping));
								self.$element.prop('val', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
								self.$element.prop('dataList', pValue['DATA']);
								$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
								$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
								self.$element.change();
							}
						}
						, async: false
					});
				} catch (ex) {
					console.log(ex);
				}
			}
		} else {
			return [this.$element.prop('val')];
		}
	};

	DropdownCondition.prototype.dataList = function(pValue) {
		return [this.$element.prop('dataList')];
	};

	// DROPDOWN CONDITION PLUGIN DEFINITION
	// ===========================

	var old = $.fn.dropdownCondition

	$.fn.dropdownCondition = function(option, param) {
		var returnArray = [];
		var internal_return;
		this.each(function() {
			var $this = $(this);
			var data = $this.data('sjinc.dropdownCondition');
			var options = typeof option == 'object' && option;
			if (!data) {
				$this.data('sjinc.dropdownCondition', (data = new DropdownCondition(this, options)))
				returnArray.push(data.$element.get(0));
			}
			if (typeof option == 'string') {
				internal_return = data[option](param);
				returnArray.push($this.get(0));
			}
		})
		if (!isNull(internal_return)) {
			return internal_return[0];
		} else {
			return $(returnArray);
		}
	}

	$.fn.dropdownCondition.Constructor = DropdownCondition 

	// DROPDOWN CONDITION NO CONFLICT
	// =====================

	$.fn.dropdownCondition.noConflict = function() {
		$.fn.dropdownCondition = old
		return this
	}

	/*
	// DROPDOWN CONDITION DATA-API
	// ==================

	$(window).on('load', function() {
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this)
			$spy.scrollspy($spy.data())
		})
	})
	*/

}(jQuery);


+function($) {
	'use strict';

	// CODELIST CONDITION CLASS DEFINITION
	// ==========================

	var focusNextElement = function($pElement) {
		var $form = $pElement.parents('form');
		var $wrapper = $pElement.parents('.cond-wrapper');
		var $allWrapper = $form.find('.cond-wrapper');
		var isFound= false;
		var isFocused = false;
		
		$allWrapper.each(function() {
			var $self = $(this);
			if (isFound) {
				var $el = $self.find('*:input:first:not(:disabled):not([readonly])');
				if ($el.length > 0) {
					$el.focus();
					isFocused = true;
					return false;
				} else {
					return true;
				}
			}
			if ($self.get(0) == $wrapper.get(0)) {
				isFound = true;
			}
		});
		
		if (!isFocused) {
			try {
				if ($pElement.parents('form[name=search-form],form.search-form').length > 0) {
					_btnSearchClick();
				}
				$(':focus').blur();
			} catch (ex) {
				alert(ex);
			}
		}

	};

	var depedentChangeHandler = function($element) {
		$element.val('');
		$element.prop('val', '');
		$element.change();
	}

	function CodeListCondition(element, options) {

		this.options = $.extend({}, CodeListCondition.DEFAULTS, options)

		var ulWidthStr = "";
		if (!isNull(this.options.width) && !(/^[0123456789]*$/g).test(this.options.width)) {
			ulWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				ulWidthStr += 'px';
			}
			ulWidthStr += '"';
		}

		var liWidthStr = "";
		if (!isNull(this.options.width)) {
			liWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				liWidthStr += 'px';
			}
			liWidthStr += '"';
		}

		var tagTemplate = '';
		tagTemplate += '<ul id="' + this.options.id + 'Container" class="nav navbar-nav search-nav cond-wrapper" ' + ulWidthStr + ' >';
		tagTemplate += '<li class="cond-li" ' + liWidthStr + ' >';
		tagTemplate += '	<div class="form-group" style="width:100%">';
		if (options.required) {
			tagTemplate += '		<label class="cond-label" for="' + this.options.id + '">*' + this.options.label + '</label>';
		} else {
			tagTemplate += '		<label class="cond-label" for="' + this.options.id + '">' + this.options.label + '</label>';
		}
		tagTemplate += '	<div id="' + options.id + 'Group" class="input-group has-normal input-append date" style="width:100%">';
		tagTemplate += '			<input id="' + options.id + '" name="' + this.options.id + '" type="text" class="navbar-btn form-control cond-input cond-default"';
		if (options.required) {
			tagTemplate += '					placeholder="*' + this.options.label + '">';
		} else {
			tagTemplate += '					placeholder="' + this.options.label + '">';
		}
		tagTemplate += '			<span class="input-group-btn" style="width: auto">';
		tagTemplate += '				<button id="' + this.options.id + 'Button" class="btn btn-default navbar-btn form-control" type="button"><span class="glyphicon glyphicon-question-sign"></span></button>';
		tagTemplate += '			</span>';
		tagTemplate += '		</div>';
		tagTemplate += '	</div>';
		tagTemplate += '</li></ul>';
		
		var self = this;

		this.$container = $(tagTemplate);

		$(element).replaceWith(this.$container);

		var $element = this.$element = this.$container.find('#' + self.options.id);
		
		$element.data('sjinc.codeListCondition', this);
		
		$element.on('keyup', function() {
			if (__popupId == '') {
				try {
					parent.popover('show', $(this));
				} catch (ex) {}
			} else {
				$element.popover({
					content: $element.attr('placeholder'),
					trigger: 'manual',
					placement: 'top',
					container: 'body'
				});
				var elementOffset = $element.offset();
				//$element.popover('tip').css('left', "-100px");
				$element.popover('show');
			}
		});
		
		$element.on('keyup', function(evt) {
			if (isValidKey(evt)) $element.prop('val', '');
			var handled = false;
			if ($element.prop('val') == '') {
				if (evt.which == KEY_ENTER) {
					handled = true;
					if (self.options.required && $(this).val() == '') {
						$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
						$('#' + self.options.id + 'Container .input-group').addClass('has-error');
					}
				} else if (evt.which == KEY_ESC) {
					handled = true;
					$('#' + self.options.id + 'Button').click();
				} else {
					if ($element.val() != '') {
						$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
						$('#' + self.options.id + 'Container .input-group').addClass('has-error');
					} else {
						if (options.required) {
							$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
							$('#' + self.options.id + 'Container .input-group').addClass('has-error');
						} else {
							$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
							$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
						}
					}
				}
			}
			
			if (handled) {
				evt.preventDefault();
			}
		});
		
		$element.on('keydown', function(evt) {
			if ($element.prop('disabled') || $element.prop('readOnly')) {
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				return;
			}
			if (!isValidKey2(evt)) return;
			var handled = false;
			if (evt.which == KEY_ENTER) {
				handled = true;
				if ($element.prop('val') && $element.prop('val') != '') {
					focusNextElement($element);
				} else if (self.options.required && $(this).val() == '') {
					alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) 필수입니다.', '경고', function(result) {
						$element.focus();
					});
				} else if ($element.val() == '') {
					focusNextElement($element);
				} else if ($element.val() == '*' && self.options.allSelect) {
					if (self.options.validLength != -1 && $element.val().length != self.options.validLength) {
						alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) ' + self.options.validLength + ' 글자를 입력하셔야 합니다.', '경고', function(result) {
							$element.focus();
						});
						return;
					}
					var data = {}
					data[self.options.returnCodeMapping] = '*';
					data[self.options.returnNameMapping] = 	'전체';
					$element.val(convertDataToDisplay(data, self.options.returnCodeMapping, self.options.returnNameMapping));
					$element.prop('val', '*');
					$element.prop('dataList', [data]);

					$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
					$('#' + self.options.id + 'Container .input-group').addClass('has-normal');

					focusNextElement($element);
				} else {
					if (self.options.validLength != -1 && $element.val().length != self.options.validLength) {
						alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) ' + self.options.validLength + ' 글자를 입력하셔야 합니다.', '경고', function(result) {
							$element.focus();
						});
						return;
					}
					var depValid = true;
					if (self.options.dependentConditions != '') {
						var dependentConditionsStrList = self.options.dependentConditions.split(',');
						for (var i = 0; i < dependentConditionsStrList.length; i++) {
							var depConditionStr = dependentConditionsStrList[i].trim();
							if (((/\[.*\]/g).exec(depConditionStr) + "").indexOf('*') > -1) {
								var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
								if ($depCondition.prop('val') == '') {
									alertModal($depCondition.attr('placeholder').replace(/\*/g, "") + ' 을(를) 확인하세요.', '경고', function(result) {
										$depCondition.focus();
									});
									depValid = false;
									break;
								}
							}
						}
					}
					if (depValid) {

						try {
							var param = $.extend({}, self.options.defaultParam);
							if (self.options.dependentConditions != '') {
								var dependentConditionsStrList = self.options.dependentConditions.split(',');
								var mappingName = null;
								for (var i = 0; i < dependentConditionsStrList.length; i++) {
									var depConditionStr = dependentConditionsStrList[i].trim();
									var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
									mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
									param[mappingName] = $depCondition.prop('val');
								}
							}
							
							for (var i = 0; i < self.options.paramMappingList.length; i++) {
								param[self.options.paramMappingList[i]] = $element.val();
							}
							param = $.extend(param, self.options.codeQueryParam);
							window[self.options.serviceName][self.options.methodName](param, {
								callback: function(pValue) {
									if (pValue && pValue['ISERROR'] == 'N') {
										if (pValue['DATA'].length > 0) {
											if (pValue['DATA'].length > 1 && !self.options.multiSelect) {
												$('#' + self.options.id + 'Button').click();
											} else {
												$element.val(convertDataListToDisplay(pValue['DATA'], self.options.returnCodeMapping, self.options.returnNameMapping));
												$element.prop('val', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
												$element.prop('dataList', pValue['DATA']);

												$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
												$('#' + self.options.id + 'Container .input-group').addClass('has-normal');

												$element.change();
												focusNextElement($element);
											}
										} else {
											alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 을(를) 확인하세요.', '경고', function(result) {
												$element.focus();
											});
										}
									} else {
										alertModal('에러가 발생했습니다. 전산실로 문의하세요.\n' + pValue['ERROR_MSG'], '경고', function(result) {
											$element.focus();
										});
									}
								}
								, async: false
							});
						} catch (ex) {
							console.log(ex);
						}
					}
				}
			} else {
				$element.change();
				$element.prop('val', '');
				$('#' + self.options.id + 'ListDiv').removeClass('open');
				try {
					parent.resizeHandler();
				} catch (ex) {
					console.log(ex);
				}
			}
			
			if (handled) {
				evt.preventDefault();
			}
		});
		
		$element.on('change', function() {
			if ($element.prop('val') == '') {
				if (self.options.required && $(this).val() == '') {
					$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
					$('#' + self.options.id + 'Container .input-group').addClass('has-error');
				}
			}
		});
		
		$element.on('focus', function() {
			var $this = $(this);
			$this.keyup();
			setTimeout(function() {
				$this.select();
			}, 1);
		});

		$element.on('blur', function() {
			if (__popupId == '') {
				try {
					parent.popover('hide', $(this));
				} catch (ex) {}
			} else {
				if ($element.data('bs.popover')) {
					$element.popover('destroy');
				}
			}
		});
		
		$('#' + self.options.id + 'Button').on('click', function() {
			if ($element.is(':disabled')) return;

			var depValid = true;
			if (self.options.dependentConditions != '') {
				var dependentConditionsStrList = self.options.dependentConditions.split(',');
				for (var i = 0; i < dependentConditionsStrList.length; i++) {
					var depConditionStr = dependentConditionsStrList[i].trim();
					if (((/\[.*\]/g).exec(depConditionStr) + "").indexOf('*') > -1) {
						var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
						if ($depCondition.prop('val') == '') {
							alertModal($depCondition.attr('placeholder').replace(/\*/g, "") + ' 을(를) 확인하세요.', '경고', function(result) {
								$depCondition.focus();
							});
							depValid = false;
							break;
						}
					}
				}
			}
			if (depValid) {
				var param = $.extend({}, self.options.defaultParam);
				if (self.options.dependentConditions != '') {
					var dependentConditionsStrList = self.options.dependentConditions.split(',');
					var mappingName = null;
					for (var i = 0; i < dependentConditionsStrList.length; i++) {
						var depConditionStr = dependentConditionsStrList[i].trim();
						var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
						mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
						param[mappingName] = $depCondition.prop('val');
					}
				}
				
				if (!self.options.extendedCondition || !$.isArray(self.options.extendedCondition)) {
					self.options.extendedCondition = [];
				}
				
				var isPreload = self.options.preload || (!isNull($element.prop('val')) && $element.prop('val') != '') || $element.val() != '';
				showCommonCodeList(
						self.options.label,
						{
							'conditionList': $.merge($.merge([], self.options.extendedCondition), [
								{ 'id': self.options.paramMappingList[0],
									'label': self.options.gridTitleList[0] + " / " + self.options.gridTitleList[1],
									type: 'blankCondition',
									paramMappingList: self.options.paramMappingList,
									val: $element.prop('val') || $element.val(),
									text: $element.prop('val') || $element.val(),
									required: !isPreload,
								},
							]),
							'defaultParam': $.extend(self.options.defaultParam, self.options.listQueryParam, param),
							'gridColumns': [
								{ id: self.options.returnCodeMapping, header: self.options.gridTitleList[0] },
								{ id: self.options.returnNameMapping, header: self.options.gridTitleList[1] }
							],
							preload: isPreload
						},
						function(rowData) {
							if (rowData) {
								$element.val(convertDataListToDisplay(rowData, self.options.returnCodeMapping, self.options.returnNameMapping));
								$element.prop('val', convertDataListToCode(rowData, self.options.returnCodeMapping));
								$element.prop('dataList', rowData);
								$element.change();
								$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
								$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
							}
						});
			}
		});

		$(document).ready(function() {
			if (self.options.dependentConditions != '') {
				var dependentConditionsStrList = self.options.dependentConditions.split(',');
				for (var i = 0; i < dependentConditionsStrList.length; i++) {
					var depConditionStr = dependentConditionsStrList[i].trim();
					var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
					$depCondition.on('change', function(evt) {
						$element.prop('val', '');
						$element.val('');
						$element.change();
						depedentChangeHandler($element);
					});
					$depCondition.on('keyup', function(evt) {
						if (!isValidKey2(evt)) return;
						$element.prop('val', '');
						$element.val('');
						$element.change();
						depedentChangeHandler($element);
					});
					$depCondition.change();
				}
			}
		
			if (self.options.preload && self.options.dependentConditions == '') {
				depedentChangeHandler($element);
			}
			
			$element.val(self.options.text);
			$element.prop('val', self.options.text);
			$element.prop('defaultVal', self.options.text);
			$element.val(self.options.text);
			$element.prop('defaultText', self.options.text);
			
			if (self.options.val != '') {
				if (self.options.val == '*' && self.options.allSelect) {
					var data = {}
					data[self.options.returnCodeMapping] = '*';
					data[self.options.returnNameMapping] = 	'전체';
					$element.val(convertDataToDisplay(data, self.options.returnCodeMapping, self.options.returnNameMapping));
					$element.prop('val', '*');
					$element.prop('dataList', [data]);
					$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
					$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
				} else {
					var param = $.extend({}, self.options.defaultParam);
					for (var i = 0; i < self.options.paramMappingList.length; i++) {
						param[self.options.paramMappingList[i]] = self.options.val;
					}
					try {
						param = $.extend(param, self.options.codeQueryParam);
						if (self.options.dependentConditions != '') {
							var mappingName = null;
							var dependentConditionsStrList = self.options.dependentConditions.split(',');
							for (var i = 0; i < dependentConditionsStrList.length; i++) {
								var depConditionStr = dependentConditionsStrList[i].trim();
								var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
								mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
								param[mappingName] = $depCondition.prop('val');
							}
						}
						window[self.options.serviceName][self.options.methodName](param, {
							callback: function(pValue) {
								if (pValue && pValue['ISERROR'] == 'N' && pValue['DATA'].length > 0) {
									$element.val(convertDataListToDisplay(pValue['DATA'], self.options.returnCodeMapping, self.options.returnNameMapping));
									$element.prop('val', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
									$element.prop('dataList', pValue['DATA']);
									$element.prop('defaultVal', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
									$element.prop('defaultDataList', pValue['DATA']);
									$element.prop('defaultText', $element.val());
									$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
									$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
								}
							}
							, async: false
						});
					} catch (ex) {
						console.log(ex);
					}
				}
			}

			if (self.options.required && $element.prop('val') == '') {
				$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
				$('#' + self.options.id + 'Container .input-group').addClass('has-error');
			}
			
			$('#' + self.options.id + 'List').css('max-height', Math.min($(document).height() - $('.cond-container').outerHeight(true) - 10, 300) + 'px');
		});
		
	}
	

	CodeListCondition.DEFAULTS = {
		required: false,
		val: '',
		text: '',
		paramMappingList: ['코드', '코드명'],
		returnCodeMapping: '코드',
		returnNameMapping: '코드명',
		serviceName: 'codeService',
		methodName: 'getCodeList',
		defaultParam: {},
		dependentConditions: '',
		multiSelect: false,
		allSelect: false,
		preload: false,
		width: 160,
		validLength: -1
	}

	CodeListCondition.prototype.val = function(pValue) {
		if (!isNull(pValue)) {
			if (pValue == '') {
				this.$element.val('');
				this.$element.prop('val', '');
				if (this.options.required && this.$element.val() == '') {
					$('#' + this.options.id + 'Container .input-group').removeClass('has-normal');
					$('#' + this.options.id + 'Container .input-group').addClass('has-error');
				} else {
					$('#' + this.options.id + 'Container .input-group').removeClass('has-error');
					$('#' + this.options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (pValue == '*' && this.options.allSelect) {
				var data = {}
				data[this.options.returnCodeMapping] = '*';
				data[this.options.returnNameMapping] = 	'전체';
				this.$element.val(convertDataToDisplay(data, this.options.returnCodeMapping, this.options.returnNameMapping));
				this.$element.prop('val', '*');
				this.$element.prop('dataList', [data]);
			} else {
				var self = this;
				var param = $.extend({}, self.options.defaultParam);
				param = $.extend(param, self.options.codeQueryParam);
				if (self.options.dependentConditions != '') {
					var mappingName = null;
					var dependentConditionsStrList = self.options.dependentConditions.split(',');
					for (var i = 0; i < dependentConditionsStrList.length; i++) {
						var depConditionStr = dependentConditionsStrList[i].trim();
						var $depCondition = $(depConditionStr.replace(/\[.*\]/g, ''));
						mappingName = ((/\[.*\]/g).exec(depConditionStr) + "").replace(/[\*\[\]]/g, "");
						param[mappingName] = $depCondition.prop('val');
					}
				}
				for (var i = 0; i < self.options.paramMappingList.length; i++) {
					param[self.options.paramMappingList[i]] = pValue;
				}
				try {
					window[self.options.serviceName][self.options.methodName](param, {
						callback: function(pValue) {
							if (pValue && pValue['ISERROR'] == 'N' && pValue['DATA'].length > 0) {
								self.$element.val(convertDataListToDisplay(pValue['DATA'], self.options.returnCodeMapping, self.options.returnNameMapping));
								self.$element.prop('val', convertDataListToCode(pValue['DATA'], self.options.returnCodeMapping));
								self.$element.prop('dataList', pValue['DATA']);
								$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
								$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
								self.$element.change();
							}
						}
						, async: false
					});
				} catch (ex) {
					console.log(ex);
				}
			}
		} else {
			return [this.$element.prop('val')];
		}
	}
	
	CodeListCondition.prototype.dataList = function(pValue) {
		return [this.$element.prop('dataList')];
	};
	

	// DROPDOWN CONDITION PLUGIN DEFINITION
	// ===========================

	var old = $.fn.codeListCondition

	$.fn.codeListCondition = function(option, param) {
		var returnArray = [];
		var internal_return;
		this.each(function() {
			var $this = $(this)
			var data = $this.data('sjinc.codeListCondition')
			var options = typeof option == 'object' && option

			if (!data) {
				$this.data('sjinc.codeListCondition', (data = new CodeListCondition(this, options)))
				returnArray.push(data.$element.get(0));
			}
			if (typeof option == 'string') {
				internal_return = data[option](param);
				returnArray.push($this.get(0));
			}
		})
		if (!isNull(internal_return)) {
			return internal_return[0];
		} else {
			return $(returnArray);
		}
	}

	$.fn.codeListCondition.Constructor = CodeListCondition 

	// CODELIST CONDITION NO CONFLICT
	// =====================

	$.fn.codeListCondition.noConflict = function() {
		$.fn.codeListCondition = old
		return this
	}

	/*
	// CODELIST CONDITION DATA-API
	// ==================

	$(window).on('load', function() {
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this)
			$spy.scrollspy($spy.data())
		})
	})
	*/

}(jQuery);


+function($) {
	'use strict';

	// DATE CONDITION CLASS DEFINITION
	// ==========================

	function checkValidDate(pDateStr) {
		if (pDateStr && pDateStr.replace(/-/g, '').length == 8) {
			pDateStr = pDateStr.replace(/-/g, '');
			var year = Number(pDateStr.substring(0, 4));
			var month = Number(pDateStr.substring(4, 6));
			var day = Number(pDateStr.substring(6, 8));

			var dd = day / 0;

			 
			if( month<1 || month>12 ) {
					return false;
			}
			 
			var maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var maxDay = maxDaysInMonth[month-1];
			 
			// 윤년 체크
			if( month==2 && ( year%4==0 && year%100!=0 || year%400==0 ) ) {
					maxDay = 29;
			}
			 
			if( day<=0 || day>maxDay ) {
					return false;
			}
			return true;
		} else if (pDateStr == '') {
			return true;
		}
	}

	var focusNextElement = function($pElement) {
		var $form = $pElement.parents('form');
		var $wrapper = $pElement.parents('.cond-wrapper');
		var $allWrapper = $form.find('.cond-wrapper');
		var isFound= false;
		var isFocused = false;
		
		$allWrapper.each(function() {
			var $self = $(this);
			if (isFound) {
				var $el = $self.find('*:input:first:not(:disabled):not([readonly])');
				if ($el.length > 0) {
					$el.focus();
					isFocused = true;
					return false;
				} else {
					return true;
				}
			}
			if ($self.get(0) == $wrapper.get(0)) {
				isFound = true;
			}
		});
		
		if (!isFocused) {
			try {
				if ($pElement.parents('form[name=search-form],form.search-form').length > 0) {
					_btnSearchClick();
				}
				$(':focus').blur();
			} catch (ex) {
				alert(ex);
			}
		}

	};

	function DateCondition(element, options) {

		this.options = $.extend({}, DateCondition.DEFAULTS, options)
		
		var ulWidthStr = "";
		if (!isNull(this.options.width) && !(/^[0123456789]*$/g).test(this.options.width)) {
			ulWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				ulWidthStr += 'px';
			}
			ulWidthStr += '"';
		}

		var liWidthStr = "";
		if (!isNull(this.options.width)) {
			liWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				liWidthStr += 'px';
			}
			liWidthStr += '"';
		}
		
		var tagTemplate = '';
		tagTemplate += '<ul id="' + options.id + 'Container" class="nav navbar-nav search-nav cond-wrapper" ' + ulWidthStr + '>';
		tagTemplate += '<li class="cond-li" ' + liWidthStr + ' >';
		tagTemplate += '	<div class="form-group" style="width:100%">';
		if (options.required) {
			tagTemplate += '		<label class="cond-label" for="' + options.label + '">*' + options.label + '</label>';
		} else {
			tagTemplate += '		<label class="cond-label" for="' + options.label + '">' + options.label + '</label>';
		}
		tagTemplate += '		<div id="' + options.id + 'Group" class="input-group has-normal input-append date" style="width:100%">';
		tagTemplate += '			<input id="' + options.id + '" name="' + options.id + '" type="text" class="navbar-btn form-control cond-input cond-default"';
		if (options.required) {
			tagTemplate += '					placeholder="*' + options.label + '">';
		} else {
			tagTemplate += '					placeholder="' + options.label + '">';
		}
		tagTemplate += '			<span class="input-group-btn add-on" style="width: auto">';
		tagTemplate += '				<button id="' + this.options.id + 'Button" class="btn btn-default navbar-btn form-control" type="button"><span class="glyphicon glyphicon-th"></span></button>';
		tagTemplate += '			</span>';
		tagTemplate += '		</div>';
		tagTemplate += '	</div>';
		tagTemplate += '	<div id="' + options.id + 'ListDiv" class="cond-dropdown dropdown">';
		tagTemplate += '		<ul id="' + options.id + 'List" class="dropdown-menu" style="max-height: 300px; overflow: auto"></ul>';
		tagTemplate += '	</div>';
		tagTemplate += '</li></ul>';

		var self = this;

		this.$container = $(tagTemplate);

		$(element).replaceWith(this.$container);

		var $element = this.$element = this.$container.find('#' + self.options.id);
		
		$element.data('sjinc.dateCondition', this);
		
		$('#' + self.options.id + 'Group').datepicker({
			format: 'yyyy-mm-dd'
			, language: 'kr'
			, keyboardNavigation: false
			, autoclose: true
			, todayHighlight: true
		}).on('changeDate', function(evt) {
			if (self.options.required && $element.val() == '') {
				$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
				$('#' + self.options.id + 'Container .input-group').addClass('has-error');
			} else {
				if (checkValidDate($element.val().trim())) {
					var dateStr = $element.val().replace(/-/g, '');
					var year = dateStr.substring(0, 4);
					var month = dateStr.substring(4, 6);
					var day = dateStr.substring(6, 8);
					var newDateStr = year + '-' +month + '-' + day;
					$('#' + self.options.id + 'Group').datepicker('update', newDateStr);
					if (!$element.prop('readOnly') && !$element.prop('disabled')) {
						$element.prop('val', $element.val().replace(/-/g, ''));
						$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
						$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
					}
				} else {
					if (!$element.prop('readOnly') && !$element.prop('disabled')) {
						$element.prop('val', '');
						$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
						$('#' + self.options.id + 'Container .input-group').addClass('has-error');
					}
				}
			}
		}).on('show', function(evt) {
			try {
				parent.resizeHandler();
			} catch (ex) {
			}
		});

		$element.on('keyup', function(evt) {
			if (__popupId == '') {
				try {
					parent.popover('show', $(this));
				} catch (ex) {}
			} else {
				$element.popover({
					content: $element.attr('placeholder'),
					trigger: 'manual',
					placement: 'top',
					container: 'body'
				});
				$element.popover('show');
			}
			var handled = false;
			if (!$element.prop('readOnly')) {
				var dateStr = $element.val().replace(/-/g, '');
				var year = dateStr.substring(0, 4);
				var month = dateStr.substring(4, 6);
				var day = dateStr.substring(6, 8);
				var newDateStr = year + '-' +month + '-' + day;
				if (checkValidDate(dateStr)) {
					if (dateStr.replace(/-/g, '').length == 8) {
						$('#' + self.options.id + 'Group').datepicker('update', newDateStr);
						$element.val(dateStr.replace(/-/g, ''));
					}
					$element.prop('val', dateStr);
				} else {
					$element.prop('val', '');
				}
			}
			if (handled) {
				evt.preventDefault();
				evt.stopImmediatePropagation();
				evt.stopPropagation();
			}
		});

		$element.on('keydown', function(evt) {
			if ($element.prop('disabled') || $element.prop('readOnly')) {
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				return;
			}
			if (!isValidKey2(evt)) return;
			var handled = false;
			if (evt.which == KEY_ENTER) {
				handled = true;
				if (self.options.required && $(this).val() == '') {
					alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) 필수입니다.', '경고', function(result) {
						$element.focus();
					});
				} else if ($element.val() != '') {
					if (checkValidDate($element.val())) {
						$('#' + self.options.id + 'Group').datepicker('hide');
						focusNextElement($element);
					}
				} else {
					$('#' + self.options.id + 'Group').datepicker('hide');
					focusNextElement($element);
				}
			}

			if (handled) {
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
			}
		});
		
		$element.on('focus', function() {
			var $this = $(this);
			if (__popupId == '') {
				try {
					parent.popover('show', $(this));
				} catch (ex) {}
			} else {
				$element.popover({
					content: $element.attr('placeholder'),
					trigger: 'manual',
					placement: 'top',
					container: 'body'
				});
				$element.popover('show');
			}
			setTimeout(function() {
				if (!$element.prop('disabled')) {
					$this.val($this.val().replace(/-/g, ''));
				}
				$this.select();
			}, 100);
		});
		
		$element.on('blur', function() {
			var $this = $(this);
			if (__popupId == '') {
				try {
					parent.popover('hide', $this);
				} catch (ex) {}
			} else {
				if ($element.data('bs.popover')) {
					$element.popover('destroy');
				}
			}
		});
		
		$element.on('change', function(evt) {
			if (self.options.required && $element.val() == '') {
				$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
				$('#' + self.options.id + 'Container .input-group').addClass('has-error');
			} else {
				if (checkValidDate($element.val().trim())) {
					$('#' + self.options.id + 'Container .input-group').removeClass('has-error');
					$('#' + self.options.id + 'Container .input-group').addClass('has-normal');
				} else {
					$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
					$('#' + self.options.id + 'Container .input-group').addClass('has-error');
				}
			}
		});
		
		$element.val(self.options.text);
		$element.prop('defaultText', self.options.text);
		$element.prop('val', self.options.text);
		$element.prop('defaultVal', self.options.text);

		$('#' + self.options.id + 'Group').datepicker('update');
		$('#' + self.options.id + 'Group').datepicker('hide')
		//$element.blur();

		if (self.options.required && $element.prop('val') == '') {
			$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
			$('#' + self.options.id + 'Container .input-group').addClass('has-error');
		}
		
		$('#' + self.options.id + 'List').css('max-height', Math.min($(document).height() - $('.cond-container').outerHeight(true) - 10, 300) + 'px');
		
	}
	

	DateCondition.DEFAULTS = {
		required: false,
		val: '',
		text: '',
		width: 160 
	}

	DateCondition.prototype.val = function(pValue) {
		if (!isNull(pValue)) {
			this.$element.val(pValue.replace(/-/g, ''));
			this.$element.change();
			if (this.options.required && this.$element.val() == '') {
				$('#' + this.options.id + 'Container .input-group').removeClass('has-normal');
				$('#' + this.options.id + 'Container .input-group').addClass('has-error');
			} else {
				if (checkValidDate(this.$element.val().trim())) {
					var dateStr = this.$element.val();
					var year = dateStr.substring(0, 4);
					var month = dateStr.substring(4, 6);
					var day = dateStr.substring(6, 8);
					var newDateStr = year + '-' +month + '-' + day;
					$('#' + this.options.id + 'Group').datepicker('update', newDateStr);
					this.$element.prop('val', this.$element.val().replace(/-/g, ''));
					$('#' + this.options.id + 'Container .input-group').removeClass('has-error');
					$('#' + this.options.id + 'Container .input-group').addClass('has-normal');
				} else {
					this.$element.prop('val', '');
					$('#' + this.options.id + 'Container .input-group').removeClass('has-normal');
					$('#' + this.options.id + 'Container .input-group').addClass('has-error');
				}
			}
		} else {
			return [this.$element.prop('val')];
		}
	};
	
	// DATE CONDITION PLUGIN DEFINITION
	// ===========================

	var old = $.fn.dateCondition

	$.fn.dateCondition = function(option, param) {
		var returnArray = [];
		var internal_return;
		this.each(function() {
			var $this = $(this)
			var data = $this.data('sjinc.dateCondition')
			var options = typeof option == 'object' && option

			if (!data) {
				$this.data('sjinc.dateCondition', (data = new DateCondition(this, options)))
				returnArray.push(data.$element.get(0));
			}
			if (typeof option == 'string') {
				internal_return = data[option](param);
				returnArray.push($this.get(0));
			}
		})
		if (!isNull(internal_return)) {
			return internal_return[0];
		} else {
			return $(returnArray);
		}
	}

	$.fn.dateCondition.Constructor = DateCondition 

	// DATE CONDITION NO CONFLICT
	// =====================

	$.fn.dateCondition.noConflict = function() {
		$.fn.dateCondition = old
		return this
	}

	/*
	// DATE CONDITION DATA-API
	// ==================

	$(window).on('load', function() {
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this)
			$spy.scrollspy($spy.data())
		})
	})
	*/

}(jQuery);

+function($) {
	'use strict';

	// BLANK CONDITION CLASS DEFINITION
	// ==========================

	var focusNextElement = function($pElement) {
		var $form = $pElement.parents('form');
		var $wrapper = $pElement.parents('.cond-wrapper');
		var $allWrapper = $form.find('.cond-wrapper');
		var isFound= false;
		var isFocused = false;
		
		$allWrapper.each(function() {
			var $self = $(this);
			if (isFound) {
				var $el = $self.find('*:input:first:not(:disabled):not([readonly])');
				if ($el.length > 0) {
					$el.focus();
					isFocused = true;
					return false;
				} else {
					return true;
				}
			}
			if ($self.get(0) == $wrapper.get(0)) {
				isFound = true;
			}
		});
		
		if (!isFocused) {
			try {
				if ($pElement.parents('form[name=search-form],form.search-form').length > 0) {
					_btnSearchClick();
				}
				$(':focus').blur();
			} catch (ex) {
				alert(ex);
			}
		}

	};
	
	var checkValid = function($pElement, options) {
		$('#' + options.id + 'Container .input-group').removeClass('has-normal');
		$('#' + options.id + 'Container .input-group').addClass('has-error');

		if (!options.required || $pElement.val() != '') {
			if (options.type == "email") {
				if ($pElement.val() == "" || webix.rules.isEmail($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "tel") {
				if ($pElement.val() == "" || telRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "time") {
				if ($pElement.val() == "" || timeRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "yearMonth") {
				if ($pElement.val() == "" || yearMonthRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "positiveInt") {
				if ($pElement.val() == "" || positiveIntRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "negativeInt") {
				if ($pElement.val() == "" || negativeIntRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "int") {
				if ($pElement.val() == "" || intRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "positivePercent") {
				if ($pElement.val() == "" || positivePercentRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "negativePercent") {
				if ($pElement.val() == "" || negativePercentRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "percent") {
				if ($pElement.val() == "" || percentRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "positiveNumber") {
				if ($pElement.val() == "" || positiveNumberRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "negativeNumber") {
				if ($pElement.val() == "" || negativeNumberRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "number") {
				if ($pElement.val() == "" || numberRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else {
				$('#' + options.id + 'Container .input-group').removeClass('has-error');
				$('#' + options.id + 'Container .input-group').addClass('has-normal');
			}
		}
	};

	function BlankCondition(element, options) {

		this.options = $.extend({}, BlankCondition.DEFAULTS, options)

		var ulWidthStr = "";
		if (!isNull(this.options.width) && !(/^[0123456789]*$/g).test(this.options.width)) {
			ulWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				ulWidthStr += 'px';
			}
			ulWidthStr += '"';
		}

		var liWidthStr = "";
		if (!isNull(this.options.width)) {
			liWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				liWidthStr += 'px';
			}
			liWidthStr += '"';
		}

		var tagTemplate = '';
		tagTemplate += '<ul id="' + options.id + 'Container" class="nav navbar-nav search-nav cond-wrapper" ' + ulWidthStr + ' >';
		tagTemplate += '<li class="cond-li" ' + liWidthStr + ' >';
		tagTemplate += '	<div class="form-group" style="width:100%">';
		if (options.required) {
			tagTemplate += '		<label class="cond-label" for="' + options.id + '">*' + options.label + '</label>';
		} else {
			tagTemplate += '		<label class="cond-label" for="' + options.id + '">' + options.label + '</label>';
		}
		tagTemplate += '		<div id="' + options.id + 'Group" class="input-group has-normal input-append date" style="width:100%">';
		tagTemplate += '			<input id="' + options.id + '" name="' + options.id + '" type="text" class="navbar-btn form-control cond-input cond-default"';
		if (options.required) {
			tagTemplate += '					placeholder="*' + options.label + '">';
		} else {
			tagTemplate += '					placeholder="' + options.label + '">';
		}
		tagTemplate += '		</div>';
		tagTemplate += '	</div>';
		tagTemplate += '	<div id="' + options.id + 'ListDiv" class="cond-dropdown dropdown">';
		tagTemplate += '		<ul id="' + options.id + 'List" class="dropdown-menu" style="max-height: 300px; overflow: auto"></ul>';
		tagTemplate += '	</div>';
		tagTemplate += '</li></ul>';

		var self = this;
		
		this.$container = $(tagTemplate);
		
		if (this.options.type == 'password') {
			this.$container.find('input').attr('type', this.options.type);
		}

		$(element).replaceWith(this.$container);

		var $element = this.$element = this.$container.find('#' + self.options.id);
		
		if (this.options.type == 'positiveInt') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'negativeInt') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'positiveNumber') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'negativeNumber') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'int') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'number') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'positivePercent') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'negativePercent') {
			$element.css('text-align', 'right');
		} else if (this.options.type == 'percent') {
			$element.css('text-align', 'right');
		}
		
		$element.data('sjinc.blankCondition', this);
		
		$element.on('keyup', function() {
			if (__popupId == '') {
				try {
					parent.popover('show', $(this));
				} catch (ex) {}
			} else {
				$element.popover({
					content: $element.attr('placeholder'),
					trigger: 'manual',
					placement: 'top',
					container: 'body'
				});
				$element.popover('show');
			}
		});
		
		$element.on('change', function(evt) {
			checkValid($element, self.options);
		});

		$element.on('keyup', function(evt) {
			if (!$element.prop('disabled')) {
				$element.prop('val', '');
				if (self.options.type == 'tel') {
					$element.prop('val', $element.val().replace(/-/g, ''));
				} else if (self.options.type == 'time') {
					$element.prop('val', $element.val().replace(/:/g, ''));
				} else if (self.options.type == 'yearMonth') {
					$element.prop('val', $element.val().replace(/-/g, ''));
				} else if (self.options.type == 'positiveInt'
					|| self.options.type == 'negativeInt'
					|| self.options.type == 'positiveNumber'
					|| self.options.type == 'int'
					|| self.options.type == 'number'
					|| self.options.type == 'negativeNumber') {
					$element.prop('val', $element.val().replace(/,/g, ''));
				} else if (self.options.type == 'positivePercent'
					|| self.options.type == 'negativePercent'
					|| self.options.type == 'percent') {
					$element.prop('val', $element.val().replace(/[, %]/g, ''));
				} else {
					$element.prop('val', $element.val());
				}
				checkValid($element, self.options);
			}
		});

		$element.on('keydown', function(evt) {
			if ($element.prop('disabled') || $element.prop('readOnly')) {
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				return;
			}
			var handled = false;
			if (evt.which == KEY_ENTER) {
				handled = true;
				if ($element.prop('val') && $element.prop('val') != '') {
					$element.change();
					focusNextElement($element);
				} else if (self.options.required && $(this).val() == '') {
					alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) 필수입니다.', '경고', function(result) {
						$element.focus();
					});
				} else if ($(this).val() == '') {
					$element.change();
					focusNextElement($element);
				}
			} else {
				$('#' + self.options.id + 'ListDiv').removeClass('open');
			}
			
			if (handled) {
				evt.preventDefault();
			}
		});

		$element.on('focus', function() {
			var $this = $(this);
			$this.keyup();
			setTimeout(function() {
				if (self.options.type == 'tel') {
					$this.val($this.val().replace(/-/g, ''));
				} else if (self.options.type == 'time') {
					$this.val($this.val().replace(/:/g, ''));
				} else if (self.options.type == 'yearMonth') {
					$this.val($this.val().replace(/-/g, ''));
				} else if (self.options.type == 'positiveInt'
					|| self.options.type == 'negativeInt'
					|| self.options.type == 'positiveNumber'
					|| self.options.type == 'int'
					|| self.options.type == 'number'
					|| self.options.type == 'negativeNumber') {
					$this.val($this.val().replace(/,/g, ''));
				} else if (self.options.type == 'positivePercent'
					|| self.options.type == 'negativePercent'
					|| self.options.type == 'percent') {
					$this.val($this.val().replace(/[, %]/g, ''));
				}
				$this.select();
			}, 1);
		});

		$element.on('blur', function() {
			if (__popupId == '') {
				try {
					parent.popover('hide', $(this));
				} catch (ex) {}
			} else {
				if ($element.data('bs.popover')) {
					$element.popover('destroy');
				}
			}
			if (self.options.type == 'tel') {
				if ($element.val() != "" && telRegExp.test($element.val())) {
					var res = telRegExp.exec($element.val());
					$element.val(res[1] + '-' + res[2] + '-' + res[3]);
				}
			} else if (self.options.type == 'positiveInt') {
				if ($element.val() != "" && positiveIntRegExp.test($element.val())) {
					var res = positiveIntRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalSize: 0, groupSize: 3, groupDelimiter: ',' }));
				}
			} else if (self.options.type == 'negativeInt') {
				if ($element.val() != "" && negativeIntRegExp.test($element.val())) {
					var res = negativeIntRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalSize: 0, groupSize: 3, groupDelimiter: ',' }));
				}
			} else if (self.options.type == 'int') {
				if ($element.val() != "" && intRegExp.test($element.val())) {
					var res = intRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalSize: 0, groupSize: 3, groupDelimiter: ',' }));
				}
			} else if (self.options.type == 'positivePercent') {
				if ($element.val() != "" && positivePercentRegExp.test($element.val())) {
					var res = positivePercentRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalSize: 0, groupSize: 3, groupDelimiter: ',' }) + ' %');
				}
			} else if (self.options.type == 'negativePercent') {
				if ($element.val() != "" && negativePercentRegExp.test($element.val())) {
					var res = negativePercentRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalSize: 0, groupSize: 3, groupDelimiter: ',' }) + ' %');
				}
			} else if (self.options.type == 'percent') {
				if ($element.val() != "" && percentRegExp.test($element.val())) {
					var res = percentRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalSize: 0, groupSize: 3, groupDelimiter: ',' }) + ' %');
				}
			} else if (self.options.type == 'positiveNumber') {
				if ($element.val() != "" && positiveNumberRegExp.test($element.val())) {
					var res = positiveNumberRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalDelimiter: '.', decimalSize: 2, groupSize: 3, groupDelimiter: ',' }));
				}
			} else if (self.options.type == 'negativeNumber') {
				if ($element.val() != "" && negativeNumberRegExp.test($element.val())) {
					var res = negativeNumberRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalDelimiter: '.', decimalSize: 2, groupSize: 3, groupDelimiter: ',' }));
				}
			} else if (self.options.type == 'number') {
				if ($element.val() != "" && numberRegExp.test($element.val())) {
					var res = numberRegExp.exec($element.val());
					$element.val(webix.Number.format(Number(res[0]), { decimalDelimiter: '.', decimalSize: 2, groupSize: 3, groupDelimiter: ',' }));
				}
			} else if (self.options.type == 'time') {
				if ($element.val() != "" && timeRegExp.test($element.val())) {
					var res = timeRegExp.exec($element.val());
					$element.val(res[1] + ':' + res[2]);
				}
			} else if (self.options.type == 'yearMonth') {
				if ($element.val() != "" && yearMonthRegExp.test($element.val())) {
					var res = yearMonthRegExp.exec($element.val());
					$element.val(res[1] + '-' + res[2]);
				}
			}
		});
		
		$element.val(self.options.text);
		$element.prop('defaultText', self.options.text);
		$element.prop('val', self.options.val);
		$element.prop('defaultVal', self.options.val);
		$element.blur();

		if (self.options.required && $element.prop('val') == '') {
			$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
			$('#' + self.options.id + 'Container .input-group').addClass('has-error');
		}
		
		$('#' + self.options.id + 'List').css('max-height', Math.min($(document).height() - $('.cond-container').outerHeight(true) - 10, 300) + 'px');
		
	}
	

	BlankCondition.DEFAULTS = {
		required: false,
		val: '',
		text: '',
		type: 'text',
		width: 160
	}

	BlankCondition.prototype.val = function(pValue) {
		if (!isNull(pValue)) {
			this.$element.val(pValue);
			this.$element.prop('val', pValue);
			checkValid(this.$element, this.options);
			this.$element.change();
			this.$element.blur();
		} else {
			return [this.$element.prop('val')];
		}
	}

	// BLANK CONDITION PLUGIN DEFINITION
	// ===========================

	var old = $.fn.blankCondition

	$.fn.blankCondition = function(option, param) {
		var returnArray = [];
		var internal_return;
		this.each(function() {
			var $this = $(this)
			var data = $this.data('sjinc.blankCondition')
			var options = typeof option == 'object' && option

			if (!data) {
				$this.data('sjinc.blankCondition', (data = new BlankCondition(this, options)))
				returnArray.push(data.$element.get(0));
			}
			if (typeof option == 'string') {
				internal_return = data[option](param);
				returnArray.push($this.get(0));
			}
		})
		if (!isNull(internal_return)) {
			return internal_return[0];
		} else {
			return $(returnArray);
		}
	}

	$.fn.blankCondition.Constructor = BlankCondition 

	// BLANK CONDITION NO CONFLICT
	// =====================

	$.fn.blankCondition.noConflict = function() {
		$.fn.blankCondition = old
		return this
	}

	/*
	// BLANK CONDITION DATA-API
	// ==================

	$(window).on('load', function() {
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this)
			$spy.scrollspy($spy.data())
		})
	})
	*/

}(jQuery);

+function($) {
	'use strict';

	// MANUAL CONDITION CLASS DEFINITION
	// ==========================

	var focusNextElement = function($pElement) {
		var $form = $pElement.parents('form');
		var $wrapper = $pElement.parents('.cond-wrapper');
		var $allWrapper = $form.find('.cond-wrapper');
		var isFound= false;
		var isFocused = false;
		
		$allWrapper.each(function() {
			var $self = $(this);
			if (isFound) {
				var $el = $self.find('*:input:first:not(:disabled):not([readonly])');
				if ($el.length > 0) {
					$el.focus();
					isFocused = true;
					return false;
				} else {
					return true;
				}
			}
			if ($self.get(0) == $wrapper.get(0)) {
				isFound = true;
			}
		});
		
		if (!isFocused) {
			try {
				if ($pElement.parents('form[name=search-form],form.search-form').length > 0) {
					_btnSearchClick();
				}
				$(':focus').blur();
			} catch (ex) {
				alert(ex);
			}
		}

	};
	
	var checkValid = function($pElement, options) {
		$('#' + options.id + 'Container .input-group').removeClass('has-normal');
		$('#' + options.id + 'Container .input-group').addClass('has-error');

		if (!options.required || $pElement.val() != '') {
			if (options.type == "email") {
				if ($pElement.val() == "" || webix.rules.isEmail($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "tel") {
				if ($pElement.val() == "" || telRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "time") {
				if ($pElement.val() == "" || timeRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "yearMonth") {
				if ($pElement.val() == "" || yearMonthRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "positiveInt") {
				if ($pElement.val() == "" || positiveIntRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "negativeInt") {
				if ($pElement.val() == "" || negativeIntRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "int") {
				if ($pElement.val() == "" || intRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "positivePercent") {
				if ($pElement.val() == "" || positivePercentRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "negativePercent") {
				if ($pElement.val() == "" || negativePercentRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "percent") {
				if ($pElement.val() == "" || percentRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "positiveNumber") {
				if ($pElement.val() == "" || positiveNumberRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "negativeNumber") {
				if ($pElement.val() == "" || negativeNumberRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else if (options.type == "number") {
				if ($pElement.val() == "" || numberRegExp.test($pElement.val())) {
					$('#' + options.id + 'Container .input-group').removeClass('has-error');
					$('#' + options.id + 'Container .input-group').addClass('has-normal');
				}
			} else {
				$('#' + options.id + 'Container .input-group').removeClass('has-error');
				$('#' + options.id + 'Container .input-group').addClass('has-normal');
			}
		}
	};

	function ManualCondition(element, options) {

		this.options = $.extend({}, ManualCondition.DEFAULTS, options)

		var ulWidthStr = "";
		if (!isNull(this.options.width) && !(/^[0123456789]*$/g).test(this.options.width)) {
			ulWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				ulWidthStr += 'px';
			}
			ulWidthStr += '"';
		}

		var liWidthStr = "";
		if (!isNull(this.options.width)) {
			liWidthStr = ' style="width:' + this.options.width;
			if ((/^[0123456789]*$/g).test(this.options.width)) {
				liWidthStr += 'px';
			}
			liWidthStr += '"';
		}

		var tagTemplate = '';
		tagTemplate += '<ul id="' + options.id + 'Container" class="nav navbar-nav search-nav cond-wrapper" ' + ulWidthStr + ' >';
		tagTemplate += '<li class="cond-li" ' + liWidthStr + ' >';
		tagTemplate += '	<div class="form-group" style="width:100%">';
		if (options.required) {
			tagTemplate += '		<label class="cond-label" for="' + options.id + '">*' + options.label + '</label>';
		} else {
			tagTemplate += '		<label class="cond-label" for="' + options.id + '">' + options.label + '</label>';
		}
		tagTemplate += '		<div id="' + options.id + 'Group" class="input-group has-normal input-append date" style="width:100%">';
		tagTemplate += '			<input id="' + options.id + '" name="' + options.id + '" type="text" class="navbar-btn form-control cond-input cond-default"';
		if (options.required) {
			tagTemplate += '					placeholder="*' + options.label + '">';
		} else {
			tagTemplate += '					placeholder="' + options.label + '">';
		}
		tagTemplate += '			<span class="input-group-btn" style="width: auto">';
		tagTemplate += '				<button id="' + this.options.id + 'Button" class="btn btn-default navbar-btn form-control" type="button"><span class="glyphicon glyphicon-question-sign"></span></button>';
		tagTemplate += '			</span>';
		tagTemplate += '		</div>';
		tagTemplate += '	</div>';
		tagTemplate += '</li></ul>';

		var self = this;
		
		this.$container = $(tagTemplate);
		
		if (this.options.type == 'password') {
			this.$container.find('input').attr('type', this.options.type);
		}

		$(element).replaceWith(this.$container);

		var $element = this.$element = this.$container.find('#' + self.options.id);
		
		$element.data('sjinc.manualCondition', this);
		
		$element.on('keyup', function() {
			if (__popupId == '') {
				try {
					parent.popover('show', $(this));
				} catch (ex) {}
			} else {
				$element.popover({
					content: $element.attr('placeholder'),
					trigger: 'manual',
					placement: 'top',
					container: 'body'
				});
				$element.popover('show');
			}
		});
		
		$element.on('change', function(evt) {
			checkValid($element, self.options);
		});

		$element.on('keyup', function(evt) {
			if (!isValidKey(evt)) return;
			$element.prop('val', '');
			checkValid($element, self.options);
			if (!$element.prop('disabled')) {
				if (self.options.type == 'tel') {
					$element.prop('val', $element.val().replace(/-/g, ''));
				} else {
					$element.prop('val', $element.val());
				}
			}
		});

		$element.on('keydown', function(evt) {
			if ($element.prop('disabled') || $element.prop('readOnly')) {
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				return;
			}
			var handled = false;
			if (evt.which == KEY_ENTER) {
				handled = true;
				if ($element.prop('val') && $element.prop('val') != '') {
					$element.change();
					focusNextElement($element);
				} else if (self.options.required && $(this).val() == '') {
					alertModal($element.attr('placeholder').replace(/\*/g, "") + ' 은(는) 필수입니다.', '경고', function(result) {
						$element.focus();
					});
				} else if ($(this).val() == '') {
					$element.change();
					focusNextElement($element);
				} else {
					if (self.options.getCodeName) {
						if (self.options.getCodeName(evt, $element)) {
							focusNextElement($element);
						}
					}
				}
			} else {
				$element.change();
				$('#' + self.options.id + 'ListDiv').removeClass('open');
			}
			
			if (handled) {
				evt.preventDefault();
			}
		});

		$element.on('focus', function() {
			var $this = $(this);
			$this.keyup();
			setTimeout(function() {
				if (self.options.type == 'tel') {
					$this.val($this.val().replace(/-/g, ''));
				} else if (self.options.type == 'time') {
					$this.val($this.val().replace(/:/g, ''));
				} else if (self.options.type == 'yearMonth') {
					$this.val($this.val().replace(/-/g, ''));
				}
				$this.select();
			}, 1);
		});

		$element.on('blur', function() {
			if (__popupId == '') {
				try {
					parent.popover('hide', $(this));
				} catch (ex) {}
			} else {
				if ($element.data('bs.popover')) {
					$element.popover('destroy');
				}
			}
			if (self.options.type == 'tel') {
				if ($element.val() != "" && telRegExp.test($element.val())) {
					var res = telRegExp.exec($element.val());
					$element.val(res[1] + '-' + res[2] + '-' + res[3]);
				}
			} else if (self.options.type == 'time') {
				if ($element.val() != "" && timeRegExp.test($element.val())) {
					var res = timeRegExp.exec($element.val());
					$element.val(res[1] + ':' + res[2]);
				}
			} else if (self.options.type == 'yearMonth') {
				if ($element.val() != "" && yearMonthRegExp.test($element.val())) {
					var res = yearMonthRegExp.exec($element.val());
					$element.val(res[1] + '-' + res[2]);
				}
			}
		});

		$('#' + self.options.id + 'Button').on('click', function(evt) {
			if ($element.is(':disabled')) return;
			if (self.options.showCodeList) self.options.showCodeList(evt, $element);
		});
		
		$element.val(self.options.text);
		$element.prop('defaultText', self.options.text);
		$element.prop('val', self.options.val);
		$element.prop('defaultVal', self.options.val);
		$element.blur();

		if (self.options.required && $element.prop('val') == '') {
			$('#' + self.options.id + 'Container .input-group').removeClass('has-normal');
			$('#' + self.options.id + 'Container .input-group').addClass('has-error');
		}
		
		$('#' + self.options.id + 'List').css('max-height', Math.min($(document).height() - $('.cond-container').outerHeight(true) - 10, 300) + 'px');
		
	}
	

	ManualCondition.DEFAULTS = {
		required: false,
		val: '',
		text: '',
		type: 'text',
		width: 160
	}

	ManualCondition.prototype.val = function(pValue) {
		if (!isNull(pValue)) {
			this.$element.val(pValue);
			this.$element.prop('val', pValue);
			checkValid(this.$element, this.options);
			this.$element.change();
			this.$element.blur();
		} else {
			return [this.$element.prop('val')];
		}
	}

	// MANUAL CONDITION PLUGIN DEFINITION
	// ===========================

	var old = $.fn.manualCondition

	$.fn.manualCondition = function(option, param) {
		var returnArray = [];
		var internal_return;
		this.each(function() {
			var $this = $(this)
			var data = $this.data('sjinc.manualCondition')
			var options = typeof option == 'object' && option

			if (!data) {
				$this.data('sjinc.manualCondition', (data = new ManualCondition(this, options)))
				returnArray.push(data.$element.get(0));
			}
			if (typeof option == 'string') {
				internal_return = data[option](param);
				returnArray.push($this.get(0));
			}
		})
		if (!isNull(internal_return)) {
			return internal_return[0];
		} else {
			return $(returnArray);
		}
	}

	$.fn.manualCondition.Constructor = ManualCondition 

	// MANUAL CONDITION NO CONFLICT
	// =====================

	$.fn.manualCondition.noConflict = function() {
		$.fn.manualCondition = old
		return this
	}

	/*
	// MANUAL CONDITION DATA-API
	// ==================

	$(window).on('load', function() {
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this)
			$spy.scrollspy($spy.data())
		})
	})
	*/

}(jQuery);

(function($) {
	if (isNull(top['__uid_counter'])) top['__uid_counter'] = 0;

	$.uid = function() {
		// Increment the counter
		top['__uid_counter']++;

		// Return a unique ID
		return "element-" + top['__uid_counter'];
	}

})(jQuery);

;(function($, undefined){
	"use strict";
	$.sjincfn = $.sjincfn || {};
	$.extend($.sjincfn,{
		getAccessor : function(obj, expr) {
			var ret,p,prm = [], i;
			if( typeof expr === 'function') { return expr(obj); }
			ret = obj[expr];
			if(ret===undefined) {
				try {
					if ( typeof expr === 'string' ) {
						prm = expr.split('.');
					}
					i = prm.length;
					if( i ) {
						ret = obj;
						while (ret && i--) {
							p = prm.shift();
							ret = ret[p];
						}
					}
				} catch (e) {}
			}
			return ret;
		},
		getMethod: function (name) {
	        return this.getAccessor($.fn.modalpopup, name);
		},
		extend : function(methods) {
			$.extend($.fn.modalpopup,methods);
		},
		showModalPopup : function(param){
			var defaultBody = "";
			var defaultFooter = $(document.createElement("button")).addClass('btn btn-default').attr('data-dismiss','modal').text('닫기');
			var defaultPgmData = {프로그램ID:"",프로그램명:"",프로그램경로:"",조회권한:"Y",수정권한:"Y", 출력권한:""};
			var defaultParam = {};
			
			var option = $.extend(true,{
				type: "msg",
				title: "title",
				width: "99%",
				body: {content:defaultBody, pgmData:defaultPgmData, paramData:defaultParam},
				footer: {content:defaultFooter},
				callback: ''
			}, param || {});
			var $modal = $(document.createElement("div")).attr("id","modal-popup").addClass('modal fade').append(
				$(document.createElement("div")).addClass('modal-dialog').css("width",option.width).append(
					$(document.createElement("div")).addClass('modal-content').append(
						$(document.createElement("div")).addClass('modal-header').append(
							$(document.createElement("button")).addClass("close").attr("type","button").attr("data-dismiss", "modal").append(
								$(document.createElement("span")).addClass("glyphicon glyphicon-remove")
							)
						).append(
							$(document.createElement("h4")).addClass('modal-title').text(option.title)
						)
					)
				)
			).on("shown.bs.modal", function(e){
				if(option.type == "program"){
					var programId = option.body.pgmData.프로그램ID;
					var programUrl = option.body.pgmData.프로그램경로;
					var $form = $(document.createElement('form')).attr({ method: "post", action: programUrl, target: "modal-iframe" });
					$form.append($(document.createElement('input')).attr({ name: "programId", value: programId }));
					$form.append($(document.createElement('input')).attr({ name: 'searchAuth', value: option.body.pgmData.조회권한 }));
					$form.append($(document.createElement('input')).attr({ name: 'modifyAuth', value: option.body.pgmData.수정권한}));
					$form.append($(document.createElement('input')).attr({ name: 'printAuth', value: option.body.pgmData.출력권한 }));
					for (var k in option.body.paramData) {
						$form.append($(document.createElement('input')).attr("type","hidden").attr({ name: k, value: option.body.paramData[k] }));
					}
					$("body").append($form);
					$form.submit();
					$form.remove();
				}
			}).on("hidden.bs.modal", function(e){
				$modal.remove();
				if($.isFunction(option.callback)){
					option.callback.call(e);
				}
			});
			
			var $modalcontent = $modal.find(".modal-content");
			
			if(option.body){
				$modalcontent.append($(document.createElement("div")).addClass('modal-body'));
				var $modalbody = $modalcontent.find(".modal-body");
				if(option.type == "msg"){
					$modalbody.append($(document.createElement("p")).append(option.body.content));
				}else if(option.type == "program"){
					$modalbody.append(
						$(document.createElement("iframe")).addClass("iframetab").attr("name", "modal-iframe").on("load", function(obj){
							var iframeHeight= this.contentWindow.document.body.scrollHeight;
							$(this).css("height", iframeHeight);
						})
					);
				}
			}
			if(option.footer){
				$modalcontent.append(
					$(document.createElement("div")).addClass('modal-footer').append(option.footer.content)					
				);
			}
			$modal.modal('show');	
		}
	});
	/*$.fn.modalpopup = function(pin) {
		if (typeof pin === 'string') {
			var fn = $.sjincfn.getMethod(pin);
			if (!fn) {
				throw ("modalpopup - No such method: " + pin);
			}
			var args = $.makeArray(arguments).slice(1);
			return fn.apply(this,args);
		}
		
		return this.each( function() {
		});
	};
	
	$.sjincfn.extend({
	});*/
})(jQuery);


;(function(undefined){

	this.JSON = this.JSON || {};
	
	if (typeof JSON.parseMap !== 'function') {
    JSON.parseMap = function(data){
  		var temp = data.replace(/([/.a-zA-Z0-9\uac00-\ud7af]+)=([/.a-zA-Z0-9\uac00-\ud7af]+)/g, '"$1":"$2"');
  		return JSON.parse(temp);
    };
  }
}());
