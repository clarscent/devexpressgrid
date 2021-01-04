var Listener = {
	grid: {
		onCellClick: function (gridID, text, value, rowIndex, dataField, rowData, row, column, columnIndex, instance, event) {
			//console.log("onCellClick", gridID, text, value, rowIndex, dataField, rowData, row, column, columnIndex, instance, event);
		},
		onContentReady: function (gridID, instance) {
			//console.log("onCententReady", gridID, instance);
		},
		onEditingStart: function (gridID, value, rowIndex, dataField, rowData, instance) {
			//console.log("onEditingStart", gridID, value, rowIndex, dataField, rowData, instance)
		},
		onFocusedCellChanging: function (gridID, prevRowIndex, prevDataField, newRowIndex, newDataField, instance, event) {
			//console.log("onFocusedCellChanging", gridID, prevRowIndex, prevDataField, newRowIndex, newDataField, instance, event);
		},
		onFocusedCellChanged: function (gridID, rowIndex, dataField, instance) {
			//console.log("onFocusedCellChanged", gridID, rowIndex, dataField, instance);
		},
		onFocusedRowChanged: function (gridID, rowIndex, rowData) {
			//console.log("onFocusedRowChanged", gridID, rowIndex, rowData);
		},
		onInitialized: function (gridID) {
			console.log("onInitialized", gridID);
		},
		onKeyDown: function (gridID, rowIndex, columnIndex, dataField, value, keyCode, rowData, event) {
			//console.log("onKeyDown", gridID, rowIndex, columnIndex, dataField, value, keyCode, rowData, event);
		},
		onRowClick: function (gridID, rowIndex, rowData, rowKey, columns, rowType) {
			//console.log("onRowClick", gridID, rowIndex, rowData, rowKey, columns, rowType)
		},
		onRowDblClick: function (gridID, rowIndex, rowData, columnIndex, dataField) {
			//console.log("onRowDblClick", gridID, rowIndex, rowData, columnIndex, dataField);
		},
		onRowInserted: function (gridID, rowIndex, rowData) {
			//console.log("onRowInserted", gridID, rowIndex, rowData);
		},
		onCellUpdating: function (gridID, value, rowIndex, dataField) {
			console.log("onCellUpdating", gridID, value, rowIndex, dataField);
		},
		onCellUpdated: function (gridID, rowIndex, columnIndex, dataField, columnValue, rowData) {
			console.log("onCellUpdated", gridID, rowIndex, columnIndex, dataField, columnValue, rowData);
		},
		onSelectionChanged: function (gridID, currentSelectedRowKeys, currentDeselectedRowKeys, selectedRowsData) {
			//console.log("onSelectionChanged", gridID, currentSelectedRowKeys, selectedRowsData)
		},
	},
};

$(document).ready(function () {
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
		});
	});
})

webix.csv.escape = true;
var delTmpList = []; //grid 삭제된 데이타 temp List

webix.i18n.locales["ko-KR"] = {	 //"es-ES" - the locale name, the same as the file name
	groupDelimiter: ",",				 //a mark that divides numbers with many digits into groups
	groupSize: 3,								//the number of digits in a group
	decimalDelimeter: ".",			 //the decimal delimiter
	decimalSize: 2,							//the number of digits after the decimal mark

	dateFormat: "%Y-%m-%d",			//applied to columns with 'format:webix.i18n.dateFormatStr'
	dateFormatMD: "%m-%d",			//applied to columns with 'format:webix.i18n.dateFormatStr'
	timeFormat: "%H:%i",				 //applied to columns with 'format:webix.i18n.dateFormatStr'
	longDateFormat: "%Y년%F%d일",	//applied to columns with 'format:webix.i18n.longDateFormatStr'
	fullDateFormat: "%Y-%m-%d %H:%i",//applied to cols with 'format:webix.i18n.fullDateFormatStr'

	priceSettings: {
		groupDelimiter: ",",
		groupSize: 3,
		decimalDelimeter: ".",
		decimalSize: 0
	},
	price: "{obj}",//EUR - currency name. Applied to cols with 'format:webix.i18n.priceFormat'
	calendar: {
		monthFull: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		monthShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		dayFull: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
		dayShort: ["일", "월", "화", "수", "목", "금", "토"]
	}
};

webix.i18n.setLocale("ko-KR");
webix.editors.traditional_text = webix.editors.text;
webix.editors.text = {
	focus: function () {
		this.getInputNode(this.node).focus();
		this.getInputNode(this.node).select();
	},
	getValue: function () {
		return this.getInputNode(this.node).value;
	},
	setValue: function (value) {
		this.getInputNode(this.node).value = value;
	},
	getInputNode: function () {
		return this.node.firstChild;
	},
	render: function () {
		$editor = this;
		var maxLengthStr = '';
		if (this.config.option && this.config.option.maxlength) {
			maxLengthStr = ' maxlength="' + this.config.option.maxlength + '" ';
		}
		var el = webix.html.create("div", {
			"class": "webix_dt_editor"
		}, "<input type='text' " + maxLengthStr + ">");

		if (this.config && this.config.option) {
			if (this.config.option.type == 'code'
				|| this.config.option.type == 'uppercase') {
				$(el).allowOnlyUpperCase();
			}

			if (this.config.option.type == 'positiveNumber'
				|| this.config.option.type == 'negativeNumber'
				|| this.config.option.type == 'number') {
				$(el).allowOnlyNumeric();
			}
		}

		return el;
	}
}

webix.GroupMethods.median = function (prop, data) {
	if (!data.length) {
		return 0;
	}

	var summ = 0;

	for (var i = data.length - 1; i >= 0; i--) {
		summ += prop(data[i]) * 1;
	}

	return summ / data.length;
};

webix.protoUI({
	name: "datagrid",
	delTmpList: [],
	getData: function () {
		this.editStop();
		var tmpList = this.serialize();
		var resultList = [];
		while (tmpList.length != 0) {
			var item = tmpList.shift();
			if (item.data && Array.isArray(item.data) && item.data.length > 0) {
				for (var i = 0; i < item.data.length; i++) {
					tmpList.push(item.data[i]);
				}
			} else {
				resultList.push(item);
			}
		}
		return resultList;
	},
	editNext:function(next, from){
		next = next !== false; //true by default
		if (this._in_edit_mode == 1 || from) {
			//only if one editor is active
			var editor_next = this._find_cell_next((this._last_editor || from), function (id) {
				if (this._get_editor_type(id))
					return true;
				return false;
			}, next);

			if (this.editStop()) {	//if we was able to close previous editor
				if (editor_next) {	//and there is a new target
					this.edit(editor_next);	//init new editor
					this._after_edit_next(editor_next);
				} else {
					var columns = this.config.columns;
					var emptyObj = {};

					columns.forEach(function(col) {
						console.log("col", col);
						emptyObj[col.id] = "";
					});

					this.addRow(emptyObj);
				}
				return false;
			}
		}
	},
	getCheckedData: function (checkboxId) {
		var resultList = this.getData();
		var config = this.getColumnConfig(checkboxId);
		var ckVal = checkEmpty(config.checkValue, "");

		resultList = resultList.filter(function (value) {
			if (isEmpty(ckVal) ? (value[checkboxId]) : (ckVal == value[checkboxId]))
				return true;
			else
				return false;
		});
		return resultList;
	},
	getRowStatusModified: function () {
		var returnResult = false;
		var resultList = this.getData();
		var delLen = this.delTmpList.length;
		resultList = resultList.filter(function (value) {
			if (value["rowStatus"] == "C" || value["rowStatus"] == "U") {
				returnResult = true;
			}
		});
		if (delLen > 0) returnResult = true;
		return returnResult;
	},
	updateCell: function (rowIndex, dataField, value) {
		var gridID = this.config.id;
		var rowId = this.getIdByIndex(rowIndex);
		var record = this.getItem(rowId);
		var columnIndex = this.getColumnIndex(dataField);

		var bool = Listener.grid.onCellUpdating(gridID, value, rowIndex, dataField);

		if (bool === false) {
			return;
		}

		record[dataField] = value;
		this.updateItem(rowId, value);
		Listener.grid.onCellUpdated(gridID, rowIndex, columnIndex, dataField, value, record);
	},
	updateRow: function (rowIdx, data) {
		var rowId = this.getIdByIndex(rowIndex);
		this.updateItem(rowId, data);
	},
	getNextEditableColumn: function (rowId, columnId) {
		var nextRowId = rowId;
		var lastColIdx = this.getColumnIndex(columnId);
		if (columnId == null) {
			lastColIdx = -1;
		}
		var cnt = 0;
		var nextColIdx = (lastColIdx + 1) % this.config.columns.length;

		if (nextColIdx < lastColIdx) {
			try {
				nextRowId = this.getNextId(nextRowId);
			} catch (ex) {
				nextRowId = null;
			}
		}

		while (!this.config.columns[nextColIdx].editor || this.config.columns[nextColIdx].hidden) {
			lastColIdx = nextColIdx;
			nextColIdx = (lastColIdx + 1) % this.config.columns.length;
			if (nextColIdx < lastColIdx) {
				cnt++
				try {
					nextRowId = this.getNextId(nextRowId);
				} catch (ex) {
					nextRowId = null;
				}
			}
			if (cnt > this.data.count()) {
				nextColIdx = null;
				nextRowId = null;
				break;
			}
		}
		var nextColId = null;
		if (nextColIdx) {
			nextColId = this.config.columns[nextColIdx].id
		}
		return {
			rowId: nextRowId,
			colId: nextColId
		};
	},
	checkValidation: function () {
		this.editStop();

		var isValid = true;
		for (var rowId in this.invalidCellMap) {
			for (var columnId in this.invalidCellMap[rowId]) {
				var columnIndex = this.getColumnIndex(columnId);
				var self = this;
				var maxlength = (this.config.columns[columnIndex].option) ? this.config.columns[columnIndex].option.maxlength : null;
				var value = this.getItem(rowId)[columnId];

				// 길이 확인
				if (maxlength && getByteSize(value) > parseInt(maxlength)) {
					var msg = $(this.getHeaderNode(columnId)).text() + '을(를) 확인하세요. 데이터 길이가 ' + maxlength + 'Byte를 초과할 수 없습니다.(현재: ' + getByteSize(value) + 'Byte)';
					popup.alert.show(msg, function () {
						self.select(rowId, columnId);
						if (self.config.editable) {
							self.editCell(rowId, columnId, false, true);
						}
					});
				} else {
					popup.alert.show($(this.getHeaderNode(columnId)).text() + '을(를) 확인하세요.', function () {
						self.select(rowId, columnId);
						if (self.config.editable) {
							self.editCell(rowId, columnId, false, true);
						}
					});
				}
				self.select(rowId);
				self.editCell(rowId);
				self.showCell(rowId);
				isValid = false;
				break;
			}
		}
		return isValid;
	},
	clearData: function () {
		this.invalidCellMap = {};
		this.editStop();
		this.blockEvent();
		this.clearAll();
		this.unblockEvent();
		this.delTmpList = [];
		this._spans_pull = {};
	},
	setData: function (data) {
		this.clearData();
		this.parse(data, 'json');
	},
	showLoadingMsg: function (msg) {
		this.__oldEnabled = this.isEnabled();
		this.disable();
		this.showOverlay(msg);
	},
	hideLoadingMsg: function () {
		this.hideOverlay();
		if (this.__oldEnabled) {
			this.enable();
		}
	},
	addRow: function (rowObj, rowIndex) {
		this.editStop();
		var id = this.add(rowObj, rowIndex);

		if (id) {
			this.select(id);
			var editableColNm = "";
			var columnArr = this.config.columns;
			for (var i = 0; i < columnArr.length; i++) {
				var column = columnArr[i];
				if (column.editor) {
					editableColNm = column.id;
					break;
				}
			}
			this.editCell(id, editableColNm);
			this.showCell(id);
		}
	},

	addRows: function (rows) {
		this.editStop();
		var id;

		for (var i = 0; i < rows.length; i++) {
			id = this.add(checkEmpty(rows[i], {}));
		}

		if (id) {
			this.select(id);
			this.editCell(id);
		}
	},

	removeRow: function (row) {
		if (!isNull(row) && !isNull(row["id"])) {
			this.blockEvent();
			this.editStop();

			var focusId = this.getPrevId(row["id"], 1);

			if (isNull(focusId)) {
				focusId = this.getNextId(row["id"], 1);
			}

			if (row["id"]) {
				delete this.invalidCellMap[row["id"]];
				this.remove(row["id"]);
			}

			this.unblockEvent();
		}
	},
	removeRowByIndex: function (row) {
		if (!isNull(row) && !isNull(row["id"])) {
			this.blockEvent();
			this.editStop();

			var focusId = this.getPrevId(row["id"], 1);

			if (isNull(focusId)) {
				focusId = this.getNextId(row["id"], 1);
			}

			if (row["id"]) {
				delete this.invalidCellMap[row["id"]];
				this.remove(row["id"]);
			}

			this.unblockEvent();
		}
	},

	removeRows: function (rows) {
		this.blockEvent();
		this.editStop();

		if (rows && rows[0] && rows[0]["id"]) {
			var focusId = this.getPrevId(rows[0]["id"], 1);

			if (isNull(focusId)) {
				focusId = this.getNextId(rows[rows.length - 1]["id"], 1);
			}

			for (var i = 0; i < rows.length; i++) {
				delete this.invalidCellMap[row[i]["id"]];
				this.remove(rows[i]["id"]);
			}

			this.unblockEvent();

			if (!isNull(focusId)) {
				this.select(focusId);
			}
		}
	},

	removeSelectedRow: function () {
		var focusId = this.getPrevId(this.getSelectedId(), 1);

		if (isNull(focusId)) {
			focusId = this.getNextId(this.getSelectedId(), 1);
		}

		if (this.getSelectedId()) {
			this.blockEvent();
			this.editStop();
			var selectedId = this.getSelectedId();
			var resultList = this.getData();
			var record = this.getItem(selectedId);

			while (resultList.length != 0) {
				var item = resultList.shift();
				if (item.id == selectedId && record["rowStatus"] != "C") this.delTmpList.push(item);
			}

			delete this.invalidCellMap[this.getSelectedId()];
			this.remove(this.getSelectedId());

			this.unblockEvent();

			if (focusId) {
				this.select(focusId);
			}
		}
	},

	delDataAdd: function (REGUSERID, REGIP, param) {
		while (this.delTmpList.length != 0) {
			var item = this.delTmpList.shift();
			item["REGUSERID"] = REGUSERID;
			item["REGIP"] = REGIP;
			item["rowStatus"] = "D";
			param.push(item);
		}
	},

	defaults: {
		leftSplit: 0,
		rightSplit: 0,
		columnWidth: 100,
		minColumnWidth: 20,
		minColumnHeight: 26,
		prerender: false,
		autoheight: false,
		autowidth: false,
		header: true,
		fixedRowHeight: false,
		scrollAlignY: true,
		datafetch: 50,

		'export': true,
		dragColumn: false,
		resizeColumn: true,
		editable: true,
		checkboxRefresh: true,
		scrollY: true,
		scrollX: true,
		footer: false,
		blockselect: false,
		clipboard: false,
		select: 'row',
		navigation: true,
		tooltip: true,
		autoselect: true,
		enablerowclick: false,
		liveEdit: true,

		on: {
			onStructureLoad: function (a,b,c,d) {
				console.log("onStructureLoad",a,b,c,d, event, window.event);
				Listener.grid.onInitialized(this.config.id);
			},
			onStructureUpdate: function(a,b,c,d) {
				console.log("onStructureUpdate",a,b,c,d, event, window.event);
			},
			onValidationSuccess: function (id, value, columnNames) {
				delete this.invalidCellMap[id];
			},
			onValidationError: function (id, value, columnNames) {
				this.invalidCellMap[id] = columnNames;
			},
			onAfterLoad: function () {
				if (!this.count() && !this.config.editable) {
					this.showOverlay("표시할 데이터가 없습니다.");
				}

				if (window['onGridDataLoaded']) {
					onGridDataLoaded(this.config.id);
				}

				if (this.config && this.config.view === "datagrid" && !isNull(this.getFirstId()) && this.config.autoselect) {
					this.select(this.getFirstId());
				}

				// webix.delay(function () {
				// 	this.adjustRowHeight("Position", true);
				// 	this.render();
				// }, this);

				var gridID = this.config.id; //gridID
				var instance = this;

				Listener.grid.onContentReady(gridID, instance);
			},
			onColumnResize: function () {
				//this.adjustRowHeight("Position", true);
				//this.render();
			},
			onHeaderClick: function (id, e, target) {
				var state = this.getState().sort;

				if (state !== null && state !== undefined) {
					if (id.column === state.id) {
						if (state.dir === "desc") {
							this.sort("id", "asc");
							this.markSorting();
							return false;
						}
					}
				}
			},
			onBeforeAdd: function () {
				this.hideOverlay();
			},
			onBeforeEditStart: function (target) {
				var evt = event || window.event;

				if (evt.defaultPrevented) {
					return false;
				}

				var grid = this;
				var record = grid.getItem(target.row);
				var curCol = grid.getColumnConfig(target.column);

				var gridID = this.config.id; //gridID
				var value = record[target.column]; // value
				var rowIndex = this.getIndexById(target.row); // rowIndex;
				var dataField = target.column; // dataField;

				Listener.grid.onCellUpdating(gridID, value, rowIndex, dataField);
			},
			onAfterEditStart: function (target) {
				console.log("afterEditStart");
				var evt = event || window.event;
				var record = this.getItem(target.row);

				var gridID = this.config.id; //gridID
				var value = record[target.column]; // value
				var rowIndex = this.getIndexById(target.row); // rowIndex;
				var dataField = target.column; // dataField;
				var rowData = record; // rowData;
				var instance = this;
				var value = record[target.column]; // value

				Listener.grid.onEditingStart(gridID, value, rowIndex, dataField, rowData, instance);

				var evt = event || window.event;

				if (evt && evt.type == "click" && evt.srcElement.tagName == "BUTTON" && $(evt.srcElement).hasClass("btnCodeHelpGrid")) {
					this.editStop(null, true, true);
				}
			},
			onBeforeEditStop: function (state, editor, ignore) {
				console.log("beforeEditStop");
				var grid = this;
				var evt = event || window.event;
				var record = grid.getItem(editor.row);
				var rowIndex = this.getIndexById(editor.row);
				var dataField = editor.column;
				var oldVal = state.old;
				var newVal = state.value;
				var column = grid.getColumnConfig(editor.column);
				var option;

				if (column.option) {
					option = column.option;
				}

				var dataSource = option.dataSource;
				var targetDataField = option.codeNameField;

				if (column.dataType === "codeHelp") {
					var targetValue = "";

					dataSource.forEach(function (obj) {
						if (obj["CODE"] === newVal) {
							record[targetDataField] = obj["NAME"];
							grid.updateItem(editor.row, record);
						}
					})

					if (targetDataField !== undefined && targetDataField !== null && targetDataField !== "" && newVal !== "" && record[targetDataField] === "") {
						evt.stopPropagation();
						evt.preventDefault();
						evt.stopImmediatePropagation();

						alert("값을 확인하세요");
						editor.focus();
						this.select(editor.row, false);
						return false;
					}
				}

				// var gridID = this.config.id; //gridID
				// var value = record[target.column]; // value
				// var rowIndex = this.getIndexById(target.row); // rowIndex;
				// var dataField = target.column; // dataField;
				// var rowData = record; // rowData;
				// var row = record; // row
				// var column;
				// var columnIndex;
				//
				// for (var i = 0; i < this.config.columns.length; i++) {
				// 	if (this.config.columns[i].id === editor.column) {
				// 		columnIndex = i;
				//
				// 		break;
				// 	}
				// }
				//
				// onCellUpdated(gridID, rowIndex, columnIndex, dataField, value, rowData)
			},
			onAfterEditStop: function (state, editor, ignore) {
				var grid = this;
				var evt = event || window.event;
				var record = grid.getItem(editor.row);
				var rowIndex = this.getIndexById(editor.row);
				var dataField = editor.column;
				var oldVal = state.old;
				var newVal = state.value;
				var column = grid.getColumnConfig(editor.column);
				var option;

				if (oldVal == null) {
					oldVal = "";
				}

				if (column.option) {
					option = column.option;
				}

				var dataSource = option.dataSource;
				var targetDataField = option.codeNameField;

				if (evt && evt.type == "click" && evt.srcElement.tagName == "BUTTON" && $(evt.srcElement).hasClass("btnCodeHelpGrid")) {
					if (column.dataType !== "codeHelp") {
						return;
					}

					popup.help.show(dataSource, function (data) {
						record[editor.column] = data["CODE"];
						record[targetDataField] = data["NAME"];
						grid.updateItem(editor.row, record);
					});
				}
			},
			onLiveEdit: function (state, editor, keyCode) {
				var grid = this;
				var evt = event || window.event;
				var column = grid.getColumnConfig(editor.column);

				if (column.option.readonly === true) {
					return false;
				}

				var record = grid.getItem(editor.row);

				var gridID = this.config.id; //gridID
				var value = record[editor.column]; // value
				var rowIndex = this.getIndexById(editor.row); // rowIndex;
				var dataField = editor.column; // dataField;
				var rowData = record; // rowData;
				var columnIndex;

				for (var i = 0; i < this.config.columns.length; i++) {
					if (this.config.columns[i].id === editor.column) {
						columnIndex = i;

						break;
					}
				}

				var check = (editor.getValue() != "");


				var option;

				if (column.option) {
					option = column.option;
				} else {
					Listener.grid.onKeyDown(gridID, rowIndex, columnIndex, dataField, value, keyCode, rowData, evt);
					return;
				}

				if (column.dataType === "codeHelp") {
					var targetFieldName = option.codeNameField;

					if (targetFieldName !== undefined && targetFieldName !== null && targetFieldName !== "") {
						record[targetFieldName] = "";
						grid.updateItem(editor.row, record);
					}
				}

				Listener.grid.onKeyDown(gridID, rowIndex, columnIndex, dataField, value, keyCode, rowData, evt);
			},
			onItemClick: function (target, evt, html) {
				var record = this.getItem(target.row);

				var gridID = this.config.id; //gridID
				var text = this.getText(target.row, target.column); // text
				var value = record[target.column]; // value
				var rowIndex = this.getIndexById(target.row); // rowIndex;
				var dataField = target.column; // dataField;
				var rowData = record; // rowData;
				var row = record; // row
				var column;
				var columnIndex;

				for (var i = 0; i < this.config.columns.length; i++) {
					if (this.config.columns[i].id === target.column) {
						column = this.config.columns[i];
						columnIndex = i;

						break;
					}
				}

				var instance = this;
				var columns = this.config.columns;

				var columnConfig = this.getColumnConfig(target.column);
				var option = {};

				if (columnConfig.dataType === "button") {
					if (columnConfig.option && columnConfig.option.callBackFn) {
						var columnInfo = {};
						columnInfo["column"] = column;
						columnInfo["columnIndex"] = columnIndex;
						columnInfo["rowIndex"] = rowIndex;
						columnInfo["data"] = rowData;
						columnInfo["dataField"] = dataField;
						columnInfo["text"] = text;
						columnInfo["value"] = value;

						columnConfig.option.callBackFn(gridID, columnConfig, columnInfo);
					}
				}


				Listener.grid.onCellClick(gridID, text, value, rowIndex, dataField, rowData, row, column, columnIndex, instance, event);
				Listener.grid.onRowClick(gridID, rowIndex, rowData, target.row, columns, "data");
			},
			onItemDblClick: function (target, evt, html) {
				var record = this.getItem(target.row);
				var gridID = this.config.id; //gridID
				var rowIndex = this.getIndexById(target.row); // rowIndex;
				var dataField = target.column; // dataField;
				var rowData = record; // rowData;
				var column;
				var columnIndex;

				for (var i = 0; i < this.config.columns.length; i++) {
					if (this.config.columns[i].id === target.column) {
						column = this.config.columns[i];
						columnIndex = i;

						break;
					}
				}

				Listener.grid.onRowDblClick(gridID, rowIndex, rowData, columnIndex, dataField)
			},
			onBeforeSelect: function (target, preserve) {
				var evt = event || window.event;
				var record = this.getItem(target.row);
				var prevRecord = null;
				var prevRowIndex = null;
				var prevDataField = null;

				if (this.lastSelectedItem !== null) {
					prevRecord = this.getItem(this.lastSelectedItem);
					prevRowIndex = this.getIndexById(this.lastSelectedItem.row);
					prevDataField = this.lastSelectedItem.column;
				}

				var gridID = this.config.id; //gridID
				var rowIndex = this.getIndexById(target.row); // rowIndex;
				var dataField = target.column; // dataField;
				var instance = this;

				Listener.grid.onFocusedCellChanging(gridID, prevRowIndex, prevDataField, rowIndex, dataField, instance, evt);

				if (this.config.autoselect && this.lastSelectedItemId == target.row) {
					this.callEvent("onAfterSelect", [target, preserve, "onBeforeSelect"]);
				}
			},
			onAfterSelect: function (target, prevent, evttype) {
				try {
					var rowData = this.getItem(target.row);
					var gridID = this.config.id; //gridID
					var rowIndex = this.getIndexById(target.row); // rowIndex;
					var dataField = target.column; // dataField;
					var instance = this;

					if (this.lastSelectedItemId != target.row) {
						this.lastSelectedItem = target;
						this.lastSelectedItemId = target.row;

						Listener.grid.onFocusedRowChanged(gridID, rowIndex, rowData);
					} else if (this.lastSelectedItem !== target) {
						this.lastSelectedItem = target;
						Listener.grid.onFocusedCellChanged(gridID, rowIndex, dataField, instance);
					}
				} catch (ex) {
					console.log(ex);
				}
			},
			onCheck: function (row, column, state) {
				var grid = this;
				var record = this.getItem(row);

				this.select(row);
			},
			onSelectChange: function () {
				var evt = event || window.event;

				if (evt && evt.defaultPrevented) {
					return false;
				}

				var gridID = this.config.id; //gridID
				var selectedId = this.getSelectedId(true);
				var selectedData = this.getSelectedItem(true);

				Listener.grid.onSelectionChanged(gridID, selectedId, selectedData);
			},
			onEditorChange: function(target, value) {
				var record = this.getItem(target.row);
				var gridID = this.config.id;
				var rowIndex = this.getIndexById(target.row);
				var columnIndex;

				for (var i = 0; i < this.config.columns.length; i++) {
					if (this.config.columns[i].id === target.column) {
						columnIndex = i;

						break;
					}
				}

				Listener.grid.onCellUpdated(gridID, rowIndex, columnIndex, target.column, value, record);
			},
		},

		rules: {
			$all: function (value, item, columnId) {
				var result = true;
				var columns = this.config.columns;
				var columnIdx = this.getColumnIndex(columnId);
				if (columnIdx > -1) {
					if (columns[columnIdx].option) {
						if (columns[columnIdx].option.required && (isNull(value) || value == "")) {
							result = false;
						}

						// maxlength 확인 (byte 기준)
						if (columns[columnIdx].option.maxlength && getByteSize(value) > parseInt(columns[columnIdx].option.maxlength)) {
							result = false;
						}

						if (columns[columnIdx].option.type == 'positiveNumber') {
							result = value > 0;
						} else if (columns[columnIdx].option.type == 'negativeNumber') {
							result = value < 0;
						}
					} else {
						if (!isEmpty(columns[columnIdx].editor) && columns[columnIdx].required && (isNull(value) || value == "")) {
							result = false;
						}
					}


					if (columns[columnIdx].format == dateFormat) {
						if (!isEmpty(columns[columnIdx].editor) && value && !dateRegExp.test(value)) {
							result = false;
						}
					} else if (columns[columnIdx].format == dateFormatMD) {
						if (!isEmpty(columns[columnIdx].editor) && value && !dateRegExpMD.test(value)) {
							result = false;
						}
					} else if (columns[columnIdx].format == fullDateFormat) {
						if (!isEmpty(columns[columnIdx].editor) && value && !fullDateRegExp.test(value)) {
							result = false;
						}
					} else if (columns[columnIdx].format == telFormat) {
						if (!isEmpty(columns[columnIdx].editor) && value && !telRegExp.test(value)) {
							result = false;
						}
					} else if (columns[columnIdx].format == timeFormat) {
						if (!isEmpty(columns[columnIdx].editor) && value && !timeRegExp.test(value)) {
							result = false;
						}
					} else if (columns[columnIdx].format == mailFormat) {
						if (!isEmpty(columns[columnIdx].editor) && value && !mailRegExp.test(value)) {
							result = false;
						}
					}
				}
				return result;
			}
		}

	},

	lastSelectedItem: null,
	lastSelectedItemId: null,
	invalidCellMap: {},

}, webix.ui.treetable);

webix.GroupMethods = {
	sum: function (property, data) {
		data = data || this;
		var summ = 0;
		for (var i = 0; i < data.length; i++)
			summ += property(data[i]) * 1;

		return summ;
	},
	avg: function (property, data) {
		data = data || this;
		var summ = 0;
		for (var i = 0; i < data.length; i++)
			summ += property(data[i]) * 1;

		return Math.round(summ / data.length);
	},
	min: function (property, data) {
		data = data || this;
		var min = Infinity;

		for (var i = 0; i < data.length; i++)
			if (property(data[i]) * 1 < min) min = property(data[i]) * 1;

		return min * 1;
	},
	max: function (property, data) {
		data = data || this;
		var max = -Infinity;

		for (var i = 0; i < data.length; i++)
			if (property(data[i]) * 1 > max) max = property(data[i]) * 1;

		return max * 1;
	},
	count: function (property, data) {
		return data.length;
	},
	count2: function (property, data) {
		return data.length;
	},
	any: function (property, data) {
		return property(data[0]);
	},
	string: function (property, data) {
		return property.$name;
	}
};

webix.ui.datafilter.summColumn = webix.extend({
	refresh: function (master, node, value) {
		var result = 0;
		master.mapCells(null, value.columnId, null, 1, function (value) {
			value = value * 1;
			if (!isNaN(value))
				result += value;

			return value;
		});

		if (value.format)
			result = value.format(result);
		if (value.template)
			result = value.template({value: result});

		value.text = result;
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right;">' + value.desc + result + '</span>';
	},
	trackCells: true,
	render: function (master, config) {
		if (config.template)
			config.template = webix.template(config.template);
		return "";
	}
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.avgColumn = webix.extend({
	refresh: function (master, node, value) {
		var result = 0;
		master.mapCells(null, value.columnId, null, 1, function (value) {
			value = value * 1;
			if (!isNaN(value))
				result += value;

			return value;
		});

		if (isNaN(result / master.count())) {
			result = 0;
		} else {
			result = Math.round(result / master.count());
		}

		if (value.format)
			result = value.format(result);
		if (value.template)
			result = value.template({value: result});

		value.text = result;
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right">' + value.desc + result + '</span>';
	}
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.maxColumn = webix.extend({
	refresh: function (master, node, value) {
		var result = '';
		master.mapCells(null, value.columnId, null, 1, function (value) {
			value = value * 1;
			if (!isNaN(value)) {
				if (result == '' || value > result) {
					result = value;
				}
			}
			return value;
		});

		if (value.format)
			result = value.format(result);
		if (value.template)
			result = value.template({value: result});

		value.text = result;
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right">' + value.desc + result + '</span>';
	}
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.minColumn = webix.extend({
	refresh: function (master, node, value) {
		var result = '';
		master.mapCells(null, value.columnId, null, 1, function (value) {
			value = value * 1;
			if (!isNaN(value)) {
				if (result == '' || value < result) {
					result = value;
				}
			}
			return value;
		});

		if (value.format)
			result = value.format(result);
		if (value.template)
			result = value.template({value: result});

		value.text = result;
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right">' + value.desc + result + '</span>';
	}
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.cntColumn = webix.extend({
	refresh: function (master, node, value) {
		var result = 0;
		master.mapCells(null, value.columnId, null, 1, function (value) {
			if (value != '') result += 1;
			return value;
		});

		result = intFormat(result);

		value.text = result;
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right">' + value.desc + result + '</span>';
	}
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.cnt2Column = webix.extend({
	refresh: function (master, node, value) {
		var result = 0;
		master.mapCells(null, value.columnId, null, 1, function (value) {
			if (value != '') result += 1;
			return value;
		});

		result = intFormat(result);

		value.text = result + '건';
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right">' + value.desc + result + '건</span>';
	}
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.timeColumn = webix.extend({
	refresh: function (master, node, value) {
		var result = 0;
		master.mapCells(null, value.columnId, null, 1, function (value) {
			value = value * 1;
			if (!isNaN(value))
				result += value;

			return (value + "").toHHMMSS();
		});

		value.text = (result + "").toHHMMSS();
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right;">' + value.desc + (result + "").toHHMMSS();
		+'</span>';
	}
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.textColumn = webix.extend({
	refresh: function (master, node, value) {
		node.firstChild.innerHTML = '<span style="width:100%;display:block;text-align:right">' + value.desc + '</span>';
	}
}, webix.ui.datafilter.summColumn);


// grouping method alias
webix.ui.datafilter.count = webix.ui.datafilter.cntColumn;
webix.ui.datafilter.count2 = webix.ui.datafilter.cnt2Column;
webix.ui.datafilter.min = webix.ui.datafilter.minColumn;
webix.ui.datafilter.max = webix.ui.datafilter.maxColumn;
webix.ui.datafilter.avg = webix.ui.datafilter.avgColumn;
webix.ui.datafilter.sum = webix.ui.datafilter.summColumn;
webix.ui.datafilter.time = webix.ui.datafilter.timeColumn;
webix.ui.datafilter.text = webix.ui.datafilter.textColumn;

// format method alias
var intFormat = function (obj) {
	if (isNull(obj)) {
		return '0';
	} else {
		return webix.i18n.intFormat(obj);
	}
};

var intFormat2 = function (obj) {
	if (isNull(obj)) {
		return '';
	} else {
		return obj == 0 ? '' : webix.i18n.intFormat(obj);
	}
};

var numberFormat = function (obj) {
	if (isNull(obj)) {
		return '0';
	} else {
		return webix.i18n.numberFormat(obj);
	}
};

var priceFormat = function (obj) {
	if (isNull(obj)) {
		return webix.i18n.locales["ko-KR"].price.replace(/{obj}/g, '') + '0';
	} else {
		return webix.i18n.priceFormat(obj);
	}
};

var dateFormat = function (dateStr) {
	if (dateStr == null || dateStr == '' || dateStr.length < 8) return dateStr;
	try {
		dateStr = dateStr.replace(/-/g, '');
		dateStr = dateStr.replace(/\\./g, '');
		var yearStr = dateStr.substring(0, 4);
		var monthStr = dateStr.substring(4, 6);
		var dayStr = dateStr.substring(6, 8);
		return webix.i18n.dateFormatStr(webix.i18n.parseFormatDate(yearStr + '.' + monthStr + '.' + dayStr));
	} catch (ex) {
		return dateStr;
	}
}

var dateFormatMD = function (dateStr) {
	if (isNull(dateStr)) {
		return '';
	} else if (dateStr == '') {
		return '';
	} else {
		var res = dateRegExpMD.exec(dateStr);
		if (!isNull(res)) {
			return res[1] + '-' + res[2];
		} else {
			return dateStr;
		}
	}
}

var longDateFormat = function (dateStr) {
	if (dateStr == null || dateStr == '' || dateStr.length < 8) return '';
	dateStr = dateStr.replace(/-/g, '');
	dateStr = dateStr.replace(/\\./g, '');
	var yearStr = dateStr.substring(0, 4);
	var monthStr = dateStr.substring(4, 6);
	var dayStr = dateStr.substring(6, 8);
	return webix.i18n.longDateFormatMDStr(webix.i18n.parseFormatDate(yearStr + '.' + monthStr + '.' + dayStr));
}

var fullDateFormat = function (dateStr) {
	if (dateStr == null || dateStr == '' || dateStr.length < 12) return '';
	dateStr = dateStr.replace(/-/g, '');
	dateStr = dateStr.replace(/\\./g, '');
	var yearStr = dateStr.substring(0, 4);
	var monthStr = dateStr.substring(4, 6);
	var dayStr = dateStr.substring(6, 8);
	var hourStr = dateStr.substring(8, 10);
	var minStr = dateStr.substring(10, 12);
	return webix.i18n.fullDateFormatStr(webix.i18n.parseFormatDate(yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minStr));
}

var webixDatagridCheckboxHandler = function (gridId, itemId) {
	var $grid = $('*[view_id=' + gridId + '').parent().webix_datagrid();
	var rowData = $grid.getItem(itemId);
	try {
		if ($grid.config.editable
			&& $grid.config.columns
			&& $grid.config.columns[0].header
			&& $grid.config.columns[0].header[0].content
			&& $grid.config.columns[0].header[0].content == 'masterCheckbox') {
			rowData[$grid.config.columns[0].id] = 1;
			$grid.updateItem(itemId, rowData);
		}
	} catch (ex) {
	}
}

var telFormat = function (telStr) {
	if (isNull(telStr)) {
		return '';
	} else if (telStr == '') {
		return '';
	} else {
		var res = telRegExp.exec(telStr);
		if (!isNull(res)) {
			telStr = res[1];
			telStr += res[2] ? "-" + res[2] : "";
			telStr += res[3] ? "-" + res[3] : "";

			return telStr;
		} else {
			return telStr;
		}
	}
}

var telFormat1 = function (telStr) {
	if (isNull(telStr)) {
		return '';
	} else if (telStr == '') {
		return '';
	} else {
		var res = telRegExp.exec(telStr);
		if (!isNull(res)) {
			telStr = res[1];
			telStr += res[2] ? "-" + "*".repeat(res[2].length) : "";
			telStr += res[3] ? "-" + res[3] : "";

			return telStr;
		} else {
			return telStr;
		}
	}
}

var timeFormat = function (timeStr) {
	if (isNull(timeStr)) {
		return '';
	} else if (timeStr == '') {
		return '';
	} else {
		var res = timeRegExp.exec(timeStr);
		if (!isNull(res)) {
			return res[1] + ':' + res[2];
		} else {
			return timeStr;
		}
	}
}

var mailFormat = function (mailStr) {
	if (isNull(mailStr)) {
		return '';
	} else if (mailStr == '') {
		return '';
	} else {
		var res = mailRegExp.exec(mailStr);
		if (!isNull(res)) {
			return res[1] + ':' + res[2];
		} else {
			return mailStr;
		}
	}
}

var column = {
	codehelp: function (obj, id, target) {
		return checkEmpty(obj[id], "") + "<button class='btnCodeHelpGrid' data-target='" + target + "' style='position:absolute; right:0px; z-index:9; border: 1px solid #c8c8c8; margin-top: 1px;'></button>";
	}
};

webix.ready(function () {
	webix.UIManager.addHotKey("up", function (view, evt) {
		if (!view || !view._custom_tab_handler && !view._custom_tab_handler(true, evt)) {
			return false;
		}

		var editor = view.getEditor();

		if (editor) {
			if (editor.config.editor == "select" || editor.config.editor == "combo") {
				var select = editor.getInputNode();
				if ($(select).is(":focus")) {
					return;
				}
			}

			var prevRowId = view.getPrevId(editor.row);
			if (prevRowId) {
				view.editStop();
				view.select(prevRowId);
				view.editCell(prevRowId, editor.column);

				evt.preventDefault();
				evt.stopPropagation()
				evt.stopImmediatePropagation()
				return false;
			}
		}
	});
	webix.UIManager.addHotKey("down", function (view, evt) {
		if (!view || !view._custom_tab_handler && !view._custom_tab_handler(true, evt)) {
			return false;
		}

		var editor = view.getEditor();

		if (editor) {
			if (editor.config.editor == "select" || editor.config.editor == "combo") {
				var select = editor.getInputNode();
				if ($(select).is(":focus")) {
					return;
				}
			}

			var nextRowId = view.getNextId(editor.row);
			if (nextRowId) {
				view.editStop();
				view.select(nextRowId);
				view.editCell(nextRowId, editor.column);

				evt.preventDefault();
				evt.stopPropagation()
				evt.stopImmediatePropagation()
				return false;
			}
		}
	});
	webix.UIManager.removeHotKey("enter");
	webix.UIManager.addHotKey("enter", function (view, evt) {
		if (!view || !view._custom_tab_handler) {
			return false;
		}

		var isNext = false;
		var editor = view.getEditor();

		if (isNull(editor)) {
			return;
		}

		var check = true;
		if (editor.getValue) {
			check = (editor.getValue() != "");
		}

		var column = view.getColumnConfig(editor.column);

		var option;

		if (column && column.option) {
			option = column.option;
		} else {
			option = {};
			isNext = true;
		}

		if (option.type == "code" && check) {
			var isPass = false;

			if (!isPass) {
				editor.focus();
				editor.getInputNode().select();
				view.select(editor.row, false);
				return false;
			} else {
				isNext = true;
			}
		} else {
			isNext = true;
		}

		if (isNext) {
			if (view && view._in_edit_mode) {
				if (view.editNext) {
					var result = view.editNext(true);
					return result;
				}
			}
		}
	});
});

function getExportScheme(view, options) {
	var scheme = [];
	var isTable = view.getColumnConfig;
	var columns = options.columns;
	var raw = !!options.rawValues;

	if (!columns) {
		if (isTable)
			columns = view._columns_pull;
		else {
			columns = webix.copy(view.data.pull[view.data.order[0]]);
			for (var key in columns) columns[key] = true;
			delete columns.id;
		}
	}

	if (options.id)
		scheme.push({
			id: "id", width: 50, header: " ", template: function (obj) {
				return obj.id;
			}
		});

	for (var key in columns) {
		var column = columns[key];
		if (column.noExport) continue;

		if (isTable && view._columns_pull[key])
			column = webix.extend(webix.extend({}, column), view._columns_pull[key]);

		var record = {
			id: column.id,
			template: ((raw ? null : column.template) || function (key) {
				return function (obj) {
					return obj[key];
				};
			}(key)),
			width: ((column.width || 200) * (options._export_mode === "excel" ? 8.43 / 70 : 1)),
			header: (column.header !== false ? (column.header || key) : "")
		};

		if (typeof record.header == "object") {
			record.header = webix.copy(record.header);
			for (var i = 0; i < record.header.length; i++)
				record.header[i] = record.header[i] ? record.header[i].text : "";
		} else
			record.header = [record.header];
		scheme.push(record);
	}
	return scheme;
}

function getExportData(view, options, scheme) {
	var headers = [];
	var filterHTML = !!options.filterHTML;
	var htmlFilter = /<[^>]*>/gi;

	for (var i = 0; i < scheme.length; i++) {
		var header = "";
		if (typeof scheme[i].header === "object") {
			for (var h = 0; h < scheme[i].header.length; h++)
				if (scheme[i].header[h]) {
					header = scheme[i].header[h];
					break;
				}
		} else
			header = scheme[i].header;

		if (typeof header === "string")
			header = header.replace(htmlFilter, "");

		headers.push(header);
	}

	var data = options.header === false ? [] : [headers];

	view.data.each(function (item) {
		var line = [];
		for (var i = 0; i < scheme.length; i++) {
			var value = item[scheme[i].id];
			var config = view.getColumnConfig(scheme[i].id);

			/*
			var cell = scheme[i].template(item, view.type, value, config);
			if (!cell && cell !== 0) cell = "";
			if (filterHTML && typeof cell === "string")
				cell = cell.replace(htmlFilter, "");
			 */
			// html 로 추출하지 않고 value 만 가져옴
			var cell = value;
			line.push(cell);
		}
		data.push(line);
	}, view);

	return data;
}

function getExcelData(data, scheme, spans) {
	var ws = {};
	var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
	for (var R = 0; R != data.length; ++R) {
		for (var C = 0; C != data[R].length; ++C) {
			if (range.s.r > R) range.s.r = R;
			if (range.s.c > C) range.s.c = C;
			if (range.e.r < R) range.e.r = R;
			if (range.e.c < C) range.e.c = C;

			var cell = {v: data[R][C]};
			if (cell.v === null) continue;
			var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

			if (typeof cell.v === 'number') cell.t = 'n';
			else if (typeof cell.v === 'boolean') cell.t = 'b';
			else if (cell.v instanceof Date) {
				cell.t = 'n';
				cell.z = XLSX.SSF[table][14];
				cell.v = excelDate(cell.v);
			} else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

	ws['!cols'] = getColumnsWidths(scheme);
	if (spans.length)
		ws["!merges"] = spans;
	return ws;
}

function getColumnsWidths(scheme) {
	var wscols = [];
	for (var i = 0; i < scheme.length; i++)
		wscols.push({wch: scheme[i].width});

	return wscols;
}

function excelDate(date) {
	return Math.round(25569 + date / (24 * 60 * 60 * 1000));
}

function str2array(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

webix.html = {
	_native_on_selectstart: 0,
	denySelect: function () {
		if (!webix._native_on_selectstart)
			webix._native_on_selectstart = document.onselectstart;
		document.onselectstart = webix.html.stopEvent;
	},
	allowSelect: function () {
		if (webix._native_on_selectstart !== 0) {
			document.onselectstart = webix._native_on_selectstart || null;
		}
		webix._native_on_selectstart = 0;

	},
	index: function (node) {
		var k = 0;
		//must be =, it is not a comparation!
		while ((node = node.previousSibling)) k++;
		return k;
	},
	_style_cache: {},
	createCss: function (rule) {
		var text = "";
		for (var key in rule)
			text += key + ":" + rule[key] + ";";

		var name = this._style_cache[text];
		if (!name) {
			name = "s" + webix.uid();
			this.addStyle("." + name + "{" + text + "}");
			this._style_cache[text] = name;
		}
		return name;
	},
	addStyle: function (rule) {
		var style = this._style_element;
		if (!style) {
			style = this._style_element = document.createElement("style");
			style.setAttribute("type", "text/css");
			style.setAttribute("media", "screen");
			document.getElementsByTagName("head")[0].appendChild(style);
		}
		/*IE8*/
		if (style.styleSheet)
			style.styleSheet.cssText += rule;
		else
			style.appendChild(document.createTextNode(rule));
	},
	create: function (name, attrs, html) {
		attrs = attrs || {};
		var node = document.createElement(name);
		for (var attr_name in attrs)
			node.setAttribute(attr_name, attrs[attr_name]);
		if (attrs.style)
			node.style.cssText = attrs.style;
		if (attrs["class"])
			node.className = attrs["class"];
		if (html)
			node.innerHTML = html;
		return node;
	},
	//return node value, different logic for different html elements
	getValue: function (node) {
		node = webix.toNode(node);
		if (!node) return "";
		return webix.isUndefined(node.value) ? node.innerHTML : node.value;
	},
	//remove html node, can process an array of nodes at once
	remove: function (node) {
		if (node instanceof Array)
			for (var i = 0; i < node.length; i++)
				this.remove(node[i]);
		else if (node && node.parentNode)
			node.parentNode.removeChild(node);
	},
	//insert new node before sibling, or at the end if sibling doesn't exist
	insertBefore: function (node, before, rescue) {
		if (!node) return;
		if (before && before.parentNode)
			before.parentNode.insertBefore(node, before);
		else
			rescue.appendChild(node);
	},
	//return custom ID from html element
	//will check all parents starting from event's target
	locate: function (e, id) {
		var trg;
		if (e.tagName)
			trg = e;
		else {
			e = e || event;
			trg = e.target || e.srcElement;
		}

		while (trg) {
			if (trg.getAttribute) {	//text nodes has not getAttribute
				var test = trg.getAttribute(id);
				if (test) return test;
			}
			trg = trg.parentNode;
		}
		return null;
	},
	//returns position of html element on the page
	offset: function (elem) {
		if (elem.getBoundingClientRect) { //HTML5 method
			var box = elem.getBoundingClientRect();
			var body = document.body;
			var docElem = document.documentElement;
			var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
			var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
			var clientTop = docElem.clientTop || body.clientTop || 0;
			var clientLeft = docElem.clientLeft || body.clientLeft || 0;
			var top = box.top + scrollTop - clientTop;
			var left = box.left + scrollLeft - clientLeft;
			return {y: Math.round(top), x: Math.round(left), width: elem.offsetWidth, height: elem.offsetHeight};
		} else { //fallback to naive approach
			var top = 0, left = 0;
			while (elem) {
				top = top + parseInt(elem.offsetTop, 10);
				left = left + parseInt(elem.offsetLeft, 10);
				elem = elem.offsetParent;
			}
			return {y: top, x: left, width: elem.offsetHeight, height: elem.offsetWidth};
		}
	},
	//returns relative position of event
	posRelative: function (ev) {
		ev = ev || event;
		if (!webix.isUndefined(ev.offsetX))
			return {x: ev.offsetX, y: ev.offsetY};	//ie, webkit
		else
			return {x: ev.layerX, y: ev.layerY};	//firefox
	},
	//returns position of event
	pos: function (ev) {
		ev = ev || event;
		if (ev.touches && ev.touches[0])
			ev = ev.touches[0];

		if (ev.pageX || ev.pageY)	//FF, KHTML
			return {x: ev.pageX, y: ev.pageY};
		//IE
		var d = ((webix.env.isIE) && (document.compatMode != "BackCompat")) ? document.documentElement : document.body;
		return {
			x: ev.clientX + d.scrollLeft - d.clientLeft,
			y: ev.clientY + d.scrollTop - d.clientTop
		};
	},
	//prevent event action
	preventEvent: function (e) {
		if (e && e.preventDefault) e.preventDefault();
		if (e) e.returnValue = false;
		return webix.html.stopEvent(e);
	},
	//stop event bubbling
	stopEvent: function (e) {
		(e || event).cancelBubble = true;
		return false;
	},
	//add css class to the node
	addCss: function (node, name, check) {
		if (!check || node.className.indexOf(name) === -1)
			node.className += " " + name;
	},
	//remove css class from the node
	removeCss: function (node, name) {
		node.className = node.className.replace(RegExp(" " + name, "g"), "");
	},
	getTextSize: function (text, css) {
		var d = webix.html.create("DIV", {"class": "webix_view webix_measure_size " + (css || "")}, "");
		d.style.cssText = "width:1px; height:1px; visibility:hidden; position:absolute; top:0px; left:0px; overflow:hidden; white-space:nowrap;";
		document.body.appendChild(d);

		var all = (typeof text !== "object") ? [text] : text;
		var width = 0;
		var height = 0;

		for (var i = 0; i < all.length; i++) {
			d.innerHTML = all[i];
			width = Math.max(width, d.scrollWidth);
			height = Math.max(height, d.scrollHeight);
		}

		webix.html.remove(d);
		return {width: width, height: height};
	},
	download: function (data, filename) {
		var objUrl = false;

		if (typeof data == "object") {//blob
			if (window.navigator.msSaveBlob)
				return window.navigator.msSaveBlob(data, filename);
			else {
				data = window.URL.createObjectURL(data);
				objUrl = true;
			}
		}
		//data url or blob url
		var link = document.createElement("a");
		link.href = data;
		link.download = filename;
		document.body.appendChild(link);
		link.click();

		webix.delay(function () {
			if (objUrl) window.URL.revokeObjectURL(data);
			document.body.removeChild(link);
			link.remove();
		});
	}
};

webix.toExcel = function (id, options) {
	var view = webix.$$(id);
	options = options || {};

	if (view.$exportView)
		view = view.$exportView(options);

	options._export_mode = "excel";

	var scheme = getExportScheme(view, options);
	var result = getExportData(view, options, scheme);

	var spans = options.spans ? getSpans(view, options) : [];
	var data = getExcelData(result, scheme, spans);

	var wb = {SheetNames: [], Sheets: []};
	var name = options.name || "Data";
	wb.SheetNames.push(name);
	wb.Sheets[name] = data;

	var xls = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
	var filename = (options.filename || name) + ".xlsx";

	var blob = new Blob([str2array(xls)], {type: "application/xlsx"});
	webix.html.download(blob, filename);
};

function getByteSize(str) {
	if (typeof str == "undefined" || str == null || !str) return 0;
	var b, i, c, s = str.toString();
	for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : c >> 7 ? 2 : 1) ; //DB 케릭터셋에 따라 한글 바이트 수 변경(기본 2 byte)
	return b;
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
	if (typeof (val) == "string" || typeof (val) == "number") {
		if (isNull(val) || val == "") {
			return true;
		} else {
			return false;
		}
	} else if (typeof (val) == "array" || typeof (val) == "object") {
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

// webix to dxgrid
function Column(caption, dataField, width, dataType, options) {
	this.id = dataField;
	this.header = caption;
	this.liveEdit = true;

	if (width === "auto") {
		this.fillspace = true;
	} else {
		this.width = Number(width);
	}

	if (options.align) {
		if (dataType === "codeHelp") {
			this.css = {"text-align": options.align, "padding-right": "25px", "box-sizing": "border-box"};
		} else {
			this.css = {"text-align": options.align};
		}
	}

	if (options.cellStyle) {
		var css = options.cellStyle;
		if (css !== "" && css.indexOf(":") > 0) {
			var cssArr = css.split(":");
			var cssObj = {};
			cssObj[cssArr[0]] = cssArr[1];

			this.css = $.extend(this.css, cssObj);
		} else {
			this.css = css;
		}

	}

	this.option = options;

	if (!this.option) {
		this.option = {};
	}

	this.option.maxlength = Number(options.maxLength);

	if (options.visible !== undefined) {
		this.hidden = !options.visible;
	}

	this.dataType = dataType;

	if (dataType === "text") {
		this.editor = "text";
	} else if (dataType === "number") {
		this.editor = "text";
		this.format = intFormat;
	} else if (dataType === "textarea") {
		this.editor = "popup";
	} else if (dataType === "selectBox") {
		this.editor = "select";

		var newArr = [];
		for (var i = 0; i < options.dataSource.length; i++) {
			var obj = options.dataSource[i];
			obj["id"] = obj["CODE"];
			obj["value"] = obj["NAME"];
			newArr.push(obj);
		}

		this.options = new webix.DataCollection({data: webix.toArray(newArr)});
	} else if (dataType === "codeHelp") {
		this.editor = "text";
		this.template = "#" + dataField + "#<button class='btnCodeHelpGrid' style='position:absolute; right:0px; z-index:9; border: 1px solid #c8c8c8;'></button>";
	} else if (dataType === "rowIndex") {
		this.id = "__index";
		this.dataType = "number";
		this.sort = "int";
	} else if (dataType === "button") {
		this.editor = "";
	} else if (dataType === "check") {
		this.checkValue = "Y";
		this.uncheckValue = "N";
		this.template = "{common.checkbox()}";

		if (caption === "") {
			this.header = {content: "masterCheckbox", contentId: "CHK"}
		}

		this.tooltip = false;
	} else  if (dataType === "date") {
		this.format = dateFormat;
	}


	if (options && options.filter === true) {
		this.header = [caption, {content: "multiComboFilter"}];
	}
}

function Footer(dataField, type, text) {
	this.dataField = dataField;
	this.content = type;
	this.desc = text;
}

var dxGrid = {
	initGrid: function (gridID, width, height, columns, option) {
		var leftFixed = 0;
		var rightFixed = 0;

		var cols = [];

		if (option === undefined || option === null) {
			option = {};
		}

		if (option.checkbox === true) {
			cols.push({
				id: "__CHK",
				header: {content: "masterCheckbox", contentId: "mc1"},
				css: "textCenter",
				width: 40,
				template: "{common.checkbox()}",
				tooltip: false,
				checkValue:"Y",
				uncheckValue:"N"
			});
		}

		if (option.showRowIndex === true) {
			cols.push(new Column("", "", "40", "rowIndex", {align: "center", maxLength: "20"}))
		}

		columns.forEach(function (col) {
			if (col.option && col.option.fixed) {
				if (col.option.fixed === "left") {
					leftFixed++;
				} else if (col.option.fixed === "right") {
					rightFixed++;
				}
			}

			if (option.sortable) {
				col.sort = "string";

				if (col.dataType === "number") {
					col.sort = "int";
				}
			} else {
				col.sort = "";
			}

			if (col.dataType === "button") {
				var $btn = $("<button>").html(col.option.btnTxt);
				col.template = $btn.get(0).outerHTML;
			}

			col.tooltip = false;
			cols.push(col);
		})

		if (leftFixed > 0 && option.showRowIndex === true) {
			leftFixed++;
		}

		if (leftFixed > 0 && option.checkbox === true) {
			leftFixed++;
		}

		webix.CustomScroll.init();

		var grid = webix.ui({
			id: gridID,
			container: gridID,
			view: "datagrid",
			editable: option.editable,
			width: width,
			height: height,
			leftSplit: leftFixed,
			rightSplit: rightFixed,
			scrollX: true,
			columns: cols,
			scheme: {
				$init: function (obj) {
					obj["__index"] = this.count() + 1;
				}
			},
		});

		$("#" + gridID).on("contextmenu", function (e) {
			// 그리드 마우스 우클릭 막기
			return false;
		});

		grid.attachEvent("onColumnResize", function (id, newWidth, user_action) {
			var config = grid.getColumnConfig(id);
			var $container = $("div.webix_view.webix_window.webix_popup[view_id*=\"$checksuggest\"]:visible");
			var $inner1 = $("div.webix_view.webix_window.webix_popup[view_id*=\"$checksuggest\"]:visible").find("div[view_id*=\"$checksuggest\"]");
			var $inner2 = $("div.webix_view.webix_window.webix_popup[view_id*=\"$checksuggest\"]:visible").find("div[view_id*=\"$list\"]");

			$container.width(config.width - 25);
			$inner1.width(config.width - 45);
			$inner2.width(config.width - 45);
		});

		return grid;
	},
	setFooter: function (gridID, footers) {
		var grid = $$(gridID);
		var columns = grid.config.columns;

		footers.forEach(function (footer) {
			columns.forEach(function (col) {
				if (col.id === footer.dataField) {
					col.footer = footer;
				}
			});
		})

		grid.editStop();
		grid.config.footer = true;
		grid.refreshColumns();
		//grid.refresh();
	},
	setGridData: function (gridID, data) {
		var grid = $$(gridID);
		grid.setData(data);
	},
	getGridInstance: function (gridID) {
		return $$(gridID);
	},
	getGridData: function (gridID) {
		return $$(gridID).getData();
	},
	getCheckedData: function (gridID, columnName) {
		console.log("checkedData", columnName);

		if (columnName === null || columnName === undefined || columnName === "") {
			columnName = "__CHK";
		}

		return $$(gridID).getCheckedData(columnName);
	},
	getTotalRowCount: function (gridID) {
		return $$(gridID).count();
	},
	addRow: function (gridID, data, rowIndex) {
		var grid = $$(gridID);

		if (data === null || data === undefined) {
			var columns = grid.config.columns;
			var emptyObj = {};

			columns.forEach(function(col) {
				console.log("col", col);
				emptyObj[col.id] = "";
			});

			data = emptyObj;
		}

		grid.addRow(data, rowIndex);
	},
	deleteRow: function (gridID, rowIndex) {
		var grid = $$(gridID);
		grid.remove(grid.getIdByIndex(rowIndex));
	},
	deleteCheckedRow: function (gridID) {
		var grid = $$(gridID);
		var checkedData = dxGrid.getCheckedData(gridID);
		grid.removeRows(checkedData);
	},
	getCellValue: function (gridID, rowIndex, dataField) {
		var grid = $$(gridID);
		return grid.getItem(grid.getIdByIndex(rowIndex))[dataField];
	},
	setCellValue: function (gridID, rowIndex, dataField, value) {
		$$(gridID).updateCell(rowIndex, dataField, value);
	},
	getRowData: function (gridID, rowIndex) {
		var grid = $$(gridID);
		return grid.getItem(grid.getIdByIndex(rowIndex));
	},
	setRowData: function (gridID, rowIndex, rowData) {
		$$(gridID).updateRow(rowIndex, rowData);
	},
	setFocus: function (gridID, rowIndex, dataField) {
		var grid = $$(gridID);
		var rowId = grid.getIdByIndex(rowIndex);
		var columnConfig = grid.getColumnConfig(dataField);

		grid.select(rowId);

		grid.edit({
			row: rowId,
			column: dataField,
		});
		grid.focusEditor({
			row: rowId,
			column: dataField,
		});
	},

	/**
	 * 현재 포커스를 가지고 있는 행의 index 반환
	 *
	 * @param gridID
	 */
	getRowIndex: function (gridID) {
		try {
			var grid = $$(gridID);
			var selectedId = grid.getSelectedId(false);

			return grid.getIndexById(selectedId);
		} catch (e) {
			return -1;
		}
	},
	setEmptyGrid: function (gridID) {
		var grid = $$(gridID);
		grid.editStop();
		grid.clearAll();
	},
	exportToExcel: function (gridID) {
		webix.toExcel($$(gridID));
	},
	setFilter: function (gridID, bool) {
		var grid = $$(gridID);

		grid.config.columns.forEach(function (col) {
			if (bool && col.option && col.option.filter === true) {
				if (col.header.length === 1) {
					col.header.push({content: "multiComboFilter"});
				} else {
					col.header[1] = {content: "multiComboFilter"};
				}
			} else {
				if (col.header.length > 1) {
					col.header = col.header[0].text;
				}
			}
		});

		grid.refreshColumns();
	}
}