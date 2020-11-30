/**
 * DevExtreme
 * Version: 18.2.14
 *
 * 관련 문서 ( official documentation )
 * https://js.devexpress.com/Documentation/18_2/ApiReference/UI_Widgets/dxDataGrid/
 *
 */

// backspace key 눌렀을 때, 뒤로가기 방지
$(document).unbind('keydown').bind('keydown', function (event) {
	if (event.keyCode === 8) {
		var doPrevent = true;
		var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
		var d = $(event.srcElement || event.target);
		var disabled = d.prop("readonly") || d.prop("disabled");
		if (!disabled) {
			if (d[0].isContentEditable) {
				doPrevent = false;
			} else if (d.is("input")) {
				var type = d.attr("type");
				if (type) {
					type = type.toLowerCase();
				}
				if (types.indexOf(type) > -1) {
					doPrevent = false;
				}
			} else if (d.is("textarea")) {
				doPrevent = false;
			}
		}
		if (doPrevent) {
			event.preventDefault();
			return false;
		}
	}
});

// LOGGER
const LOG_LEVEL_ERROR = 1;
const LOG_LEVEL_WARN = 2;
const LOG_LEVEL_INFO = 3;
const LOG_LEVEL_DEBUG = 4;
const Logger = {
	__logLevel: LOG_LEVEL_DEBUG,

	setLogLevel: function(logLevel) {
		Logger.__logLevel = logLevel;
	},

	error: function(title, message) {
		if (Logger.__logLevel >= LOG_LEVEL_ERROR) {
			console.error("[ERROR] " + title, message);
		}
	},
	warn: function(title, message) {
		if (Logger.__logLevel >= LOG_LEVEL_WARN) {
			console.warn("[WARN] " + title, message);
		}
	},
	info: function(title, message) {
		if (Logger.__logLevel >= LOG_LEVEL_INFO) {
			console.info("[INFO] " + title, message);
		}
	},
	debug: function(title, message) {
		if (Logger.__logLevel >= LOG_LEVEL_DEBUG) {
			console.debug("[DEBUG] " + title, message);
		}
	},
};

// 필수 변수
let __focusedCellElement = new Array(2);
let __currentEditingColumn = new Object();

// Event listener
let Listener = {
	grid: {
		onCellClick: function (gridID, text, value, rowIndex, dataField, rowData, row, column, instance, event) {},
		onContentReady: function (gridID, instance) {},
		onEditingStart: function (gridID, value, rowIndex, dataField, rowData, instance) {},
		onFocusedCellChanging: function (gridID, prevRowIndex, prevDataField, newRowIndex, newDataField, instance, event) {},
		onFocusedCellChanged: function (gridID, rowIndex, dataField, instance) {},
		onFocusedRowChanged: function (gridID, rowIndex, rowData) {},
		onInitialized: function (gridID) {},
		onKeyDown: function (gridID, keyCode, event) {},
		onRowClick: function (gridID, rowIndex, rowData, rowKey, columns) {},
		onRowInserted: function (gridID, rowIndex, rowData) {}, // addRow 호출 시 발생
		onCellUpdating: function (gridID, value, rowIndex, dataField) {}, // input change
		onCellUpdated: function (gridID, rowIndex, dataField, rowData) {}, // input blur시
		onSelectionChanged: function (gridID, currentSelectedRowKeys, currentDeselectedRowKeys, selectedRowsData) {},
	},
};

// Class
const Band = function (dataField, columns) {
	this.dataField = dataField;

	if (columns !== null) {
		this.caption = dataField;
		this.columns = columns;
		// 헤더 caption 개행 가능하도록
		this.headerCellTemplate = function (header) {
			header.append(
				$("<div>").html(dataField.replace(/\n/g, "<br/>")).css("text-align", "center")
			);
		};
	}
}

// 처음 컬럼 셋팅할 때 쓰는 객체
const Column = function (caption, dataField, width, dataType, options) {
	this.caption = caption;
	this.dataField = dataField;
	this.width = width;
	this.headerCellTemplate = function (header, info) {
		header.append(
			$("<div>").html(caption.replace(/\n/g, "<br/>")).css("text-align", "center")
		);
	};

	if (dataType === "codeHelp") {
		dataType = "text";
		options.columnType = new dxGrid.CodeHelp(options.dataSource, options.codeNameField);
	} else if (dataType === "selectBox") {
		dataType = "text";
		options.columnType = new dxGrid.SelectBox(options.dataSource, options.parentDataField);
	}

	this.options = options;
	this.dataTypes = dataType;

	let dataTypeObj = dxGrid.method.__getDataFormat(dataType);
	_.merge(this, dataTypeObj);

	//options
	if (options) {
		let readonly = options.readonly;
		let cellStyle = options.cellStyle;
		let headerStyle = options.headerStyle;
		let columnType = options.columnType;
		let maxLength = options.maxLength;
		let alignment = options.align;
		let visible = options.visible;

		if (readonly) {
			this.allowEditing = !readonly;
		}

		if (cellStyle) {
			this.cellTemplate = function ($el, info) {
				let $div = $("<div>").html(info.text);

				let style = "";

				if (typeof cellStyle == "function") {
					style = cellStyle(info.data);
				} else {
					style = cellStyle;
				}

				if (style) {
					const index = style.indexOf(":");

					if (index > 0) {
						const attribute = style.substr(0, index).trim();
						const value = style.substr(index+1).trim();
						$div.css(attribute, value);
					} else {
						$div.addClass(style);
					}
				}
				$el.append($div);
			};
		}

		if (headerStyle) {
			this.headerCellTemplate = function ($el, info) {
				let $div = $("<div>")
					.html(caption.replace(/\n/g, "<br/>"))
					.css("text-align", "center")

				let style = "";

				if (typeof headerStyle == "function") {
					style = headerStyle(info.data);
				} else {
					style = headerStyle;
				}

				if (style) {
					const index = style.indexOf(":");

					if (index > 0) {
						const attribute = style.substr(0, index).trim();
						const value = style.substr(index+1).trim();
						$el.parent().css(attribute, value);
					} else {
						$el.parent().addClass(style);
					}
				}

				$el.append($div);
			};
		}

		if (typeof columnType === "object") {
			_.merge(this, columnType);
		}

		if (alignment) {
			this.alignment = alignment;
		}

		if (visible !== undefined) {
			this.visible = visible;
		}
	}

}

/**
 * Footer 생성 객체
 *
 * @param dataField	: 연산을 할 dataField
 * @param type		 : 'avg' | 'count' | 'max' | 'min' | 'sum'
 * @param text		 : 출력할 text 지정
 * @param dataFormat  : 출력할 value format 지정
 * @param alignment	: 'center' | 'left' | 'right'
 *
 */
const Footer = function (dataField, type, text, dataFormat, alignment) {
	this.column = dataField;
	this.summaryType = type;
	this.displayFormat = text;
	if (dataFormat != undefined && dataFormat != "") {
		let obj = dxGrid.method.__getDataFormat(dataFormat);
		this.valueFormat = obj.format;
	}
	this.alignment = alignment;
};

const dxGrid = {
	initGrid: function (gridID, width, height, option) {
		let instance = $("#" + gridID).dxDataGrid({
			width: width,
			height: height,
			selection: {mode: "multiple"},
			keyExpr: "__rowKey",
			editing: {texts: {confirmDeleteMessage: ""}},
			loadPanel: {enabled: false},
			paging: {enabled: false, pageSize: 0},
			showBorders: false,
			focusedRowEnabled: true,
			dataSource: [],
			// width 조정
			allowColumnResizing: true,
			columnResizingMode: "nextColumn",
			columnMinWidth: 50,

		}).dxDataGrid("instance");

		// 옵션
		if (option) {
			const checkbox = option.checkbox;
			const editable = option.editable;
			const sortable = option.sortable;

			if (checkbox) {
				instance.option("selection.showCheckBoxesMode", "always");
			} else {
				instance.option("selection.showCheckBoxesMode", "none");
				instance.option("selection.mode", "none");
			}

			if (editable) {
				instance.option("onToolbarPreparing", function(e) {
					e.toolbarOptions.visible = false;
				});
				instance.option("editing", {mode:"batch", allowUpdating: editable, allowAdding: editable});
				instance.option("sorting", {mode: "none"});
			}

			if (sortable) {
				instance.option("sorting", {mode: "single"});
				if (sortable !== true) {
					instance.option("sorting", {mode: sortable});
				}
			}
		}

		dxGrid.method.__addEventListener(gridID);
		dxGrid.method.__executeListener("onInitialized", {gridID: gridID}, gridID);
	},

	setColumn: function (gridID, columns, band) {
		let instance = dxGrid.getGridInstance(gridID);

		columns = dxGrid.method.__configColumnType(gridID, columns);

		if (band) {
			columns = dxGrid.method.__setBands(gridID, columns, band);
		}

		instance.option("columns", columns);
		instance.option("onEditorPreparing", function(evt) {
			let maxLength = -1;

			for (let i = 0; i < columns.length; i++) {
				if (columns[i].dataField === evt.dataField && columns[i].options && columns[i].options.maxLength) {
					maxLength = columns[i].options.maxLength;
				}
			}

			if (maxLength && maxLength > 0) {
				evt.editorOptions.maxLength = maxLength;
			}

			if (evt.lookup != undefined) {
				evt.editorOptions.onValueChanged = function (args) {
					evt.setValue(args.value);
					evt.component.refresh();
				};
				evt.editorOptions.placeholder = "";
				evt.editorOptions.searchEnabled = false;

				if (evt.editorOptions.dataSource != null && evt.editorOptions.dataSource.filter != null && evt.editorOptions.dataSource.filter[2] == null) {
					evt.editorOptions.value = null;
				}
			}
		});
		instance.refresh();
	},

	setFooter: function (gridID, footer) {
		let instance = dxGrid.getGridInstance(gridID);
		if (footer != undefined) {
			for (let i = 0 ; i < footer.length ; i++) {
				let elm = footer[i];
				// default: 컬럼 형식대로 valueFormat 설정
				if (elm.valueFormat == undefined) {
					elm.valueFormat = instance.columnOption(elm.column).format;
				}
				elm.customizeText = instance.columnOption(elm.column).customizeText;

				// display format
				if (elm.summaryType !== "text") {
					if (elm.displayFormat == undefined) {
						elm.displayFormat = "{0}";
					} else {
						elm.displayFormat = elm.displayFormat + "{0}";
					}
				} else {
					elm.summaryType = undefined;
				}
			}
		}
		instance.option("summary", {totalItems: footer,});
	},

	setGridData: function (gridID, data) {
		let instance = dxGrid.getGridInstance(gridID);
		let columns = instance.option("columns");

		if (!(data instanceof Array)) {
			data.__rowKey = dxGrid.method.__getKeyString();
			data = [data];
		} else {
			for (let j = 0 ; j < data.length ; j++) {
				data[j].__rowKey = dxGrid.method.__getKeyString();
			}
		}

		// codehelp 코드명
		for (let i = 0 ; i < columns.length ; i++) {
			if (columns[i].__codeHelp && data) {
				let nameTarget = columns[i].__nameTarget;
				if (!data[0].nameTarget) {
					Logger.warn("<codeHelp>", "dataSource에 " + nameTarget + "에 대한 데이터가 없습니다. join 을 통해 값을 가져오십시오.");
				}
			}
		}

		instance.option("dataSource", data);
		instance.option("focusedRowEnabled", true);
		instance.option("focusedRowKey", false);
	},

	setGridDataByUrl: function (gridID, url) {
		$.ajax({
			url: url,
			success: function(data) {
				Logger.debug("[SUCCESS]", data);

				dxGrid.setGridData(gridID, data);
			},
			error: function(e) {
				Logger.error(url, e.responseText);
			}
		});
	},

	getGridInstance: function (id) {
		return $("#" + id).dxDataGrid("instance");
	},

	getGridData: function (gridID) {
		let instance = dxGrid.getGridInstance(gridID);
		dxGrid.saveEditData(gridID);
		return instance.getDataSource() ? instance.getDataSource().items(): undefined;
	},

	/**
	 * 선택한 행들의 데이터와 행의 인덱스를 리턴
	 *
	 * @param gridID
	 * @returns {*}
	 *
	 */
	getCheckedData: function (gridID) {
		let instance = dxGrid.getGridInstance(gridID);
		dxGrid.saveEditData(gridID);
		let rowsData = instance.getSelectedRowsData();
		let rowIndex;

		for (let j = 0 ; j < rowsData.length ; j++) {
			rowIndex = instance.getRowIndexByKey(rowsData[j]["__rowKey"]);
			_.merge(rowsData[j], {__rowIndex: rowIndex});
		}

		return rowsData;
	},

	getRowData: function(gridID, rowIndex) {
		let instance = dxGrid.getGridInstance(gridID);
		let $rowEl = instance.getRowElement(rowIndex);
		let rowData = $rowEl.data("options").data;

		return rowData;
	},

	setRowData: function(gridID, rowIndex, rowData) {
		let instance = dxGrid.getGridInstance(gridID);
		let rowKey = instance.getKeyByRowIndex(rowIndex);

		let store = instance.getDataSource().store();

		store.update(rowKey, rowData).done(function(values) {
			instance.refresh();
		}).fail(function(error) {});
	},

	setCellValue: function(gridID, rowIndex, dataField, value) {
		let rowData = dxGrid.getRowData(gridID, rowIndex);
		rowData[dataField] = value;

		dxGrid.setRowData(gridID, rowIndex, rowData);
	},

	getCellValue: function(gridID, rowIndex, dataField) {
		let rowData = dxGrid.getRowData(gridID, rowIndex)
		return rowData[dataField];
	},

	/**
	 * 새로운 행 추가
	 *
	 * @param gridID
	 * @param data  - 행에 들어갈 데이터를 넣어준다.
	 * @param rowIndex - 행이 들어갈 위치를 지정해준다.
	 *
	 */
	addRow: function (gridID, data, rowIndex) {
		let instance = dxGrid.getGridInstance(gridID);
		let dataSource = instance.getDataSource();
		instance.option("focusedRowEnabled", false);

		if (data == undefined) {
			data = new Object();
		}
		data["__rowKey"] = dxGrid.method.__getKeyString();

		// default 값은 bottom으로 들어가도록
		if (rowIndex == null) {
			rowIndex = dxGrid.getGridData(gridID);
			if (rowIndex != null) {
				rowIndex = rowIndex.length;
			} else {
				rowIndex = 0;
			}
		}
		dataSource.store().insert(data, rowIndex).then( function () {
			dxGrid.method.__executeListener("onRowInserted", {
				"gridID": gridID,
				"rowIndex": rowIndex,
				"rowData": data
			}, gridID, rowIndex, data);
		});
		instance.refresh().done( function () {
			instance.option("focusedRowEnabled", true);
			dxGrid.method.__setFocusOnCell(instance, rowIndex, 1);
		});


	},

	/**
	 * 선택한 행들을 일괄 삭제
	 *
	 * @param gridID
	 *
	 * instance.option("focusedRowEnabled", false), instance.option("focusedRowEnabled", true)
	 * 작동하기 위해서는 두 함수가 반드시 필요함
	 *
	 */
	deleteCheckedRow: function (gridID) {
		let instance = dxGrid.getGridInstance(gridID);
		let checkedData = dxGrid.getCheckedData(gridID);
		instance.option("focusedRowEnabled", false);

		for (let j = 0 ; j < checkedData.length ; j++) {
			instance.deleteRow(checkedData[j].__rowIndex);
			instance.refresh();
		}
		instance.deselectAll();
		instance.option("focusedRowEnabled", true);
		dxGrid.saveEditData(gridID);
	},

	deleteRow: function(gridID, rowIndex) {
		let instance = dxGrid.getGridInstance(gridID);
		instance.option("focusedRowEnabled", false);

		instance.deleteRow(rowIndex);
		instance.refresh();

		instance.option("focusedRowEnabled", true);
		dxGrid.saveEditData(gridID);
	},

	saveEditData: function (gridID) {
		let instance = dxGrid.getGridInstance(gridID);
		instance.saveEditData();
	},

	setFocus: function(gridID, rowIndex, dataField) {
		let instance = dxGrid.getGridInstance(gridID);
		let $cellEl = instance.getCellElement(rowIndex, dataField);
		let colIndex = $cellEl.get(0).cellIndex;

		dxGrid.method.__setFocusOnCell(instance, rowIndex, colIndex);
	},

	method: {
		__setBands: function (gridID, columns, band) {
			for (let j = 0; j < band.length; j++) {
				band[j] = dxGrid.method.__mergeBandAndColumn(band[j], columns);

				if (band[j].columns != null) {
					dxGrid.method.__setBands(gridID, columns, band[j].columns);
				}
			}
			return band;
		},

		__setFocusOnCell: function (instance, rowIndex, colIndex) {
			let columnCount = instance.columnCount();

			if (colIndex > columnCount) {
				colIndex = 1;
				rowIndex += 1;
			}

			let currentCellElement = instance.getCellElement(rowIndex, colIndex);
			instance.focus(currentCellElement);
			$(currentCellElement).trigger("click");
		},

		/**
		 * 랜덤 키 값을 생성해주는 함수.
		 * 각 행의 __rowKey 의 값으로 들어간다.
		 *
		 * @returns {string}
		 */
		__getKeyString: function () {
			let value = "";
			for (let i = 0; i < 32; i++) {
				value += Math.round(15 * Math.random()).toString(16)
			}
			value = value.replace(/[^a-f0-9]/gi, "").toLowerCase();
			while (value.length < 32) {
				value += "0"
			}

			return [value.substr(0, 8), value.substr(8, 4), value.substr(12, 4), value.substr(16, 4), value.substr(20, 12)].join("-")
		},

		__getDataByUrl: function (url) {
			return $.ajax({
				url: url,
				success: function(data) {
					Logger.debug("[SUCCESS]", data);
					return data;
				},
				error: function(e) {
					Logger.error(url, e.responseText);
				}
			});
		},

		__addEventListener: function (gridID) {
			let instance = dxGrid.getGridInstance(gridID);

			instance.option("onCellClick", function (eventObject) {
				eventObject.dataField = eventObject.column ? eventObject.column.dataField: undefined;
				eventObject.rowData = eventObject.data;
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onCellClick", eventObject, [gridID, eventObject.text, eventObject.value, eventObject.rowIndex, eventObject.dataField, eventObject.rowData, eventObject.row, eventObject.column, eventObject.instance, eventObject.event]);
			});
			instance.option("onContentReady", function (eventObject) {
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onContentReady", eventObject, [gridID, eventObject.instance]);

				let $el = eventObject.element;
				let $input = $el.find("div.dx-editor-outlined input.dx-texteditor-input");
				if ($input.length == 1) {
					$input = $input[0];
					let column = __currentEditingColumn.column;
					let rowIndex = __currentEditingColumn.rowIndex;
					let dataField = __currentEditingColumn.column.dataField;
					let newData;
					let oldData = dxGrid.getCellValue(gridID, rowIndex, dataField);

					$input.addEventListener("focusout", function (e) {
						dxGrid.method.__executeListener("onCellUpdating", {
							gridID: gridID,
							value: oldData,
							rowIndex: rowIndex,
							dataField: dataField,
						}, [gridID, oldData, rowIndex, dataField]);

						if (newData && oldData !== newData) {
							const rowData = __currentEditingColumn.data;
							rowData[column.dataField] = newData;
							if (column.__codeHelp) {
								const ds = column.__dataSource;
								const nt = column.__nameTarget;
								for (let i = 0 ; i < ds.length ; i++) {
									if (ds[i]["CODE"] == newData) {
										rowData[nt] = ds[i]["NAME"];
									}
								}
							}
							__currentEditingColumn.data = rowData;
							dxGrid.method.__executeListener("onCellUpdated", {
								gridID: gridID,
								rowIndex: rowIndex,
								dataField: dataField,
								rowData: rowData
							}, [gridID, rowIndex, dataField, rowData]);
						}
					});

					$input.addEventListener("keyup", function (e) {
						newData = e.target.value;
					});

					if (column) {
						let oldData = dxGrid.getCellValue(gridID,rowIndex,column.dataField);
						eventObject.element.find("div.dx-editor-outlined input.dx-texteditor-input").val("").focus();
						eventObject.element.find("div.dx-editor-outlined input.dx-texteditor-input").val(oldData).focus();
					}
				}
			});
			instance.option("onEditingStart", function (eventObject) {
				eventObject.rowIndex = eventObject.component.getRowIndexByKey(eventObject.key);
				eventObject.dataField = eventObject.column ? eventObject.column.dataField: undefined;
				eventObject.rowData = eventObject.data;
				eventObject.value = eventObject.component.cellValue(eventObject.rowIndex, eventObject.column.dataField);
				eventObject.instance = eventObject.component;
				__currentEditingColumn = eventObject;

				dxGrid.method.__executeListener("onEditingStart", eventObject, [gridID, eventObject.value, eventObject.rowIndex, eventObject.dataField, eventObject.rowData, eventObject.instance]);
			});
			instance.option("onFocusedCellChanging", function (eventObject) {
				const columns = eventObject.columns;
				if (columns) {
					eventObject.prevDataField = columns[eventObject.prevColumnIndex] ? columns[eventObject.prevColumnIndex].dataField: undefined;
					eventObject.newDataField = columns[eventObject.newColumnIndex] ? columns[eventObject.newColumnIndex].dataField: undefined;
				}
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onFocusedCellChanging", eventObject, [gridID, eventObject.prevRowIndex, eventObject.prevDataField, eventObject.newRowIndex, eventObject.newDataField, eventObject.instance, eventObject.event]);
			});
			instance.option("onFocusedCellChanged", function (eventObject) {
				__focusedCellElement = [eventObject.rowIndex, eventObject.columnIndex];
				eventObject.dataField = eventObject.column ? eventObject.column.dataField: undefined;
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onFocusedCellChanged", eventObject, [gridID, eventObject.rowIndex, eventObject.dataField, eventObject.instance]);
			});
			instance.option("onFocusedRowChanged", function (eventObject) {
				eventObject.rowData = eventObject.row ? eventObject.row.data: undefined;

				dxGrid.method.__executeListener("onFocusedRowChanged", eventObject, [gridID, eventObject.rowIndex, eventObject.rowData]);
			});
			instance.option("onInitialized", function (eventObject) {
				dxGrid.method.__executeListener("onInitialized", eventObject, [gridID]);
			});
			instance.option("onKeyDown", function (eventObject) {
				let column = __currentEditingColumn.column;

				if (eventObject.event.key == "F2") {
					eventObject.component.editCell(__focusedCellElement[0], __focusedCellElement[1]);
				}

				eventObject.keyCode = eventObject.event.keyCode;
				dxGrid.method.__executeListener("onKeyDown", eventObject, [gridID, eventObject.keyCode, eventObject.event]);
			});
			instance.option("onRowClick", function (eventObject) {
				eventObject.rowData = eventObject.data;
				eventObject.rowKey = eventObject.key;
				eventObject.columns = eventObject.columns;

				dxGrid.method.__executeListener("onRowClick", eventObject, [gridID, eventObject.rowIndex, eventObject.rowData, eventObject.rowKey, eventObject.columns]);
			});
			instance.option("onRowInserted", function (eventObject) {
				eventObject.rowData = eventObject.data;

				dxGrid.method.__executeListener("onRowInserted", eventObject, [gridID, eventObject.rowIndex, eventObject.rowData]);
			});
			instance.option("onCellUpdating", function (eventObject) {
				dxGrid.method.__executeListener("onCellUpdating", eventObject, [gridID, eventObject.value, eventObject.rowIndex, eventObject.dataField]);
			});
			instance.option("onCellUpdated", function (eventObject) {
				dxGrid.method.__executeListener("onCellUpdated", eventObject, [gridID, eventObject.rowIndex, eventObject.dataField, eventObject.rowData]);
			});
			instance.option("onSelectionChanged", function (eventObject) {
				dxGrid.method.__executeListener("onSelectionChanged", eventObject, [gridID, eventObject.currentSelectedRowKeys, eventObject.currentDeselectedRowKeys, eventObject.selectedRowsData]);
			});
		},

		__executeListener: function (fncName, pobj, args) {
			Logger.info(fncName, pobj);
			try {
				Listener.grid[fncName](args);
			} catch (err) {
				Logger.error(fncName, err);
			}
		},

		__checkDataSourceJsonKey: function (dataSource, text, args) {
			if (dataSource && dataSource.length > 0) {
				let obj = dataSource[0];
				let keys = Object.keys(obj);

				for (let i = 0 ; i < args.length ; i++) {
					let code = args[i];
					let flag = false;
					for (let j = 0 ; j < keys.length ; j++) {
						let key = keys[j];
						if (code === key) {
							flag = true;
							break;
						}
					}
					if (!flag) {
						Logger.error("ERROR", text);
					}
				}
			}
		},

		__configColumnType: function (gridID, columns) {
			let newColumns = new Array();
			// for SelectBox
			let __keyMap = dxGrid.method.__makeKeyMap(columns);
			let __keys = Object.keys(__keyMap);

			for (let i = 0 ; i < columns.length ; i++) {
				let col = columns[i];
				if (col.__codeHelp) {
					let dataSource = col.__dataSource;
					let text = "[" + gridID + "]" +
						"Help Popup 컬럼 DataSource의 키 값은 CODE, NAME 이어야 합니다.";
					dxGrid.method.__checkDataSourceJsonKey(dataSource, text, ["CODE", "NAME"]);

					_.merge(col, new dxGrid.method.__configCodeHelp(gridID, col.__dataSource, col.__nameTarget, col))
				} else if (col.__selectBox) {
					let dataSource = col.__dataSource;

					if (col.__parentField) {
						let text = "[" + gridID + "]" +
							"SelectBox 컬럼 DataSource의 키 값은 CODE, NAME, parentCode 이어야 합니다.";
						dxGrid.method.__checkDataSourceJsonKey(dataSource, text, ["CODE", "NAME", "parentCode"]);
					} else {
						let text = "[" + gridID + "]" +
							"SelectBox 컬럼 DataSource의 키 값은 CODE, NAME 이어야 합니다.";
						dxGrid.method.__checkDataSourceJsonKey(dataSource, text, ["CODE", "NAME"]);
					}
				}


				for (let i = 0 ; i < __keys.length ; i++) {
					let key = __keys[i];
					if (key == col.dataField) {
						_.merge(col, new dxGrid.method.__configSelectBox(key, __keyMap));
						break;
					}
				}
				newColumns.push(col);
			}

			return newColumns;
		},

		__makeKeyMap: function (columns) {
			let __keyMap = {};

			for (let i = 0 ; i < columns.length ; i++) {
				let col = columns[i];
				let colField = col.dataField;
				let parentField = col.__parentField;
				if (parentField != null) {
					if (__keyMap[parentField] == undefined) {
						__keyMap[parentField] = [];
					}
					__keyMap[parentField].push(colField);
				}
			}

			return __keyMap;
		},

		__configCodeHelp: function (gridID, dataSource, nameTarget, col) {
			let maxLength = undefined;

			if (col && col.options && col.options.maxLength) {
				maxLength = col.options.maxLength;
			}

			this.editCellTemplate = function (container, options) {
				let gridInstance = dxGrid.getGridInstance(gridID);
				let rowIndex = options.rowIndex;
				let colIndex = options.columnIndex;
				let target = options.column.dataField;
				let isExist = false;

				const __codeHelpCellCallBack = function () {
					let value = options.value;

					if (value != undefined) {
						isExist = false;
						for (let i = 0 ; i < dataSource.length ; i++) {
							let data = dataSource[i];
							if (data["CODE"] == value) {
								isExist = true;
								value = data["NAME"];
								break;
							}
						}

						if (isExist) {
							isExist = value;
						}

						if (isExist) {
							gridInstance.cellValue(rowIndex, nameTarget, value);
						} else {
							alert("존재하지 않는 코드입니다.");
						}
						return isExist;
					}
				}

				// 그리드의 텍스트박스
				let parentCellTextBox = $("<div>").dxTextBox({
					value: options.text,
					valueChangeEvent: "keyup",
					onValueChanged: function (evt) {
						options.setValue(evt.value);
					},
					maxLength: maxLength,
					onKeyDown: function(evt) {
						if (evt.event.keyCode === 13){
							let value = __codeHelpCellCallBack();
							if (value) {
								evt.event.keyCode = 9;
							} else {
								evt.event.stopPropagation();
							}
						}
					},
					onFocusIn: function (evt) {
					},
					onFocusOut: function (evt) {
						let relatedTarget = evt.event.relatedTarget;

						if (relatedTarget && relatedTarget.children && relatedTarget.children[0].classList && relatedTarget.children[0].classList.contains("dx-pointer-events-target")) {
							return;
						}
						if (relatedTarget && relatedTarget.classList.contains("dx-button")) {
							return;
						} else {
							__codeHelpCellCallBack();
						}
					},
				});

				// 물음표 버튼
				let parentCellButton = $("<div>").dxButton({
					hint: "helpBtn",
					icon: "help",
					onClick: function () {
						const popupID = "__popup";
						const tbxId = "__popupTextBox";
						const grdId = "__popupGrid";
						const btnId = "__popupButton";

						// 폼 만들기
						let $form = Form.create(Form.Type.Code(dataSource, tbxId, grdId, btnId));

						let focusedCode = "";
						let focusedName = "";
						let tbxInstance = $form.find("#" + tbxId).dxTextBox("instance");
						let grdInstance = $form.find("#" + grdId).dxDataGrid("instance");
						let btnInstance = $form.find("#" + btnId).dxButton("instance");

						// 이벤트 연결
						tbxInstance.option("onEnterKey", function () {
							grdInstance.option('focusedRowIndex', 0);
							grdInstance.refresh();

							let filterValue = tbxInstance.option("text");
							if (filterValue != undefined) {
								grdInstance.filter([
									["CODE", "contains", filterValue],
									"or",
									["NAME", "contains", filterValue]
								]);
							}
						});

						grdInstance.option("onFocusedRowChanged", function (e) {
							if (e && e.row && e.row.data) {
								focusedCode = e.row.data["CODE"];
								focusedName = e.row.data["NAME"];
							}
						});

						btnInstance.option("onClick", function () {
							gridInstance.cellValue(rowIndex, target, focusedCode);
							gridInstance.cellValue(rowIndex, nameTarget, focusedName);
							// gridInstance.saveEditData();  // saveEditData() 실행시 parent 그리드 깜빡임
							Popup.hide(popupID);
						});

						// 팝업창 생성
						Popup.create(popupID, $form, gridID, rowIndex, colIndex).show();
					}
				});

				parentCellTextBox.find(".dx-texteditor-buttons-container").append(parentCellButton);

				return $("<div>").append(parentCellTextBox);
			}
		},

		__configSelectBox: function (key, __keyMap) {
			this.setCellValue = function (rowData, value) {
				rowData[key] = value;
				for (let i = 0 ; i < __keyMap[key].length ; i++) {
					let child = __keyMap[key][i];
					rowData[child] = null;
					if (__keyMap[child] != undefined) {
						for (let j = 0 ; j < __keyMap[child].length ; j++) {
							let grandChild = __keyMap[child][j];
							rowData[grandChild] = null;
						}
					}
				}
			}
		},

		__mergeBandAndColumn: function (band, columns) {
			for (let k = 0 ; k < columns.length ; k++) {
				if (band.dataField === columns[k].dataField) {
					_.merge(band, columns[k]);
					return band;
				}
			}
			return band;
		},

		__getDataFormat: function (dataType) {
			let precision = undefined;

			/**
			 * type: number, percen 인 경우, 소수점(precision) 설정
			 */
			if (typeof dataType == "object") {
				precision = dataType.precision;
				dataType = dataType.type;
			}

			switch (dataType) {
				case "text":
					return {dataType: "string", alignment: "left"};
				case "number":
					let obj = {
						customizeText: function (options) {return options.valueText.replace(/\B(?=(\d{3})+(?!\d))/g, ",");},
						dataType: "number"
					}
					if (precision != null) {
						_.merge(obj, {format: {type: "fixedPoint", precision: precision}});
					}
					return obj;
				case "percent":
					return {
						dataType: "number",
						format: {type: "percent", precision: precision}
					};
				case "date":
					return {dataType: "date", format: "yyyy-mm-dd"};
				case "check":
					return {dataType: "boolean", alignment: "center"};
				case "code":
					return {alignment: "center"};
				case "password":
					return {customizeText: function (options) {return "*******";}}
			}
		},
	},
	/**
	 * SelectBox 객체. parentCode 가 상위 코드
	 *
	 * @param dataSource - Array	: JSON data가 있는 배열
	 * @param [parentField]		: 상위 SelectBox의 DataField
	 *
	 */
	SelectBox: function (dataSource, parentField) {
		this.__selectBox = true;
		this.__parentField = parentField;
		this.__dataSource = dataSource;

		this.lookup = {dataSource: "", valueExpr: "CODE", displayExpr: "NAME"};
		if (parentField != undefined) {
			this.lookup.dataSource = function (options) {
				return {
					store: dataSource,
					filter: options.data ? ["parentCode", "=", options.data[parentField]]: null,
				}
			}
		} else {
			this.lookup.dataSource = dataSource;
		}
	},

	CodeHelp: function (dataSource, nameTarget, parentField) {
		this.__codeHelp = true;
		this.__dataSource = dataSource;
		this.__nameTarget = nameTarget;
		this.__parentField = parentField;
	},
}

const Form = {
	create: function (type) {
		let form = $("<div class='form'></div>");

		if (type != undefined) {
			form.append(type);
		}

		return form;
	},

	__Field: {
		create: function (id, label) {
			let $field = $("<div class='dx-field'></div>");

			if (label != undefined) {
				$field.prepend("<div class='dx-field-label'>"+ label +"</div>");
				$field.append("<div class='dx-field-value'><div id="+ id +"></div></div>");
			} else {
				$field.append("<div id="+ id +"></div>");
			}

			return $field
		},

		mergeFields: function (args) {
			let $fieldSet = $("<div class='dx-fieldset'></div>");

			for (let i = 0 ; i < args.length ; i++) {
				let arg = args[i];
				$fieldSet.append(arg);
			}

			return $fieldSet;
		}

	},

	Type: {
		Code: function (dataSource, tbxId, grdId, btnId) {
			let $tbx = Form.__Field.create(tbxId, "코드/명");
			let $grd = Form.__Field.create(grdId);
			let $btn = Form.__Field.create(btnId);

			$tbx.find("#" + tbxId).dxTextBox({});
			$grd.find("#" + grdId).dxDataGrid({
				dataSource: dataSource,
				keyExpr: "CODE",
				columns: [
					{caption: "코드", dataField: "CODE"},
					{caption: "명", dataField: "NAME"},
				],
				width: "100%",
				height: 250,
				focusedRowEnabled: true,
			});
			$btn.find("#" + btnId).dxButton({
				text: "선택",
			});

			return Form.__Field.mergeFields([$tbx, $grd, $btn]);
		},

		Warn: function (popupID, text) {
			let txtId = "__warnTxt";
			let btnId = "__warnBtn";
			let $text = Form.__Field.create(txtId);
			let $btn = Form.__Field.create(btnId);

			$text.find("#" + txtId)
				.css("text-align", "center")
				.css("vertical-align", "center")
				.html(text);

			$btn.find("#" + btnId).dxButton({
				text: "확인",
				onClick: function () {
					Popup.hide(popupID);
				}
			});
			$btn.css("text-align", "center");

			return Form.__Field.mergeFields([$text, $btn]);
		},
	}
};

const Popup = {
	create: function (popupID, form, gridID, rowIndex, colIndex) {
		let instance = dxGrid.getGridInstance(gridID);
		let popupObj = {
			width: 500,
			height: 500,
			title: "코드",
			position: {
				my: "center",
				at: "center",
				of: window
			},
			animation: undefined,
			closeOnOutsideClick: false,
			showTitle: true,
			/**
			 * html - height: 100%,
			 * body - min-height: 100%
			 * 일 때만 dragging 가능
			 */
			dragEnabled: true,
			contentTemplate: function () {
				return form;
			},
			onHiding: function () {
				dxGrid.method.__setFocusOnCell(instance, rowIndex, colIndex);
			},
			onHidden: function () {
				$("#" + popupID).remove();
				instance.endUpdate();
			},
			onShowing: function () {
				instance.beginUpdate();
			}
		}

		$("#" + gridID).after("<div id=" + popupID + "></div>");
		return $("#" + popupID).dxPopup(popupObj).dxPopup("instance");
	},

	show: function (id) {
		Popup.getInstance(id).show();
	},

	hide: function (id) {
		Popup.getInstance(id).hide();
	},

	getInstance: function (id) {
		return $("#" + id).dxPopup("instance");
	},

};