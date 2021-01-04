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
	__logLevel: LOG_LEVEL_ERROR,

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
let __focusedCell = {};
let __focusedRow = {};
let __editingCell = {};
let __clickedCell = {};

// Event listener
let Listener = {
	grid: {
		onCellClick: function (gridID, text, value, rowIndex, dataField, rowData, row, column, columnIndex, instance, event) {},
		onContentReady: function (gridID, instance) {},
		onEditingStart: function (gridID, value, rowIndex, dataField, rowData, instance) {},
		onFocusedCellChanging: function (gridID, prevRowIndex, prevDataField, newRowIndex, newDataField, instance, event) {},
		onFocusedCellChanged: function (gridID, rowIndex, dataField, instance) {},
		onFocusedRowChanged: function (gridID, rowIndex, rowData) {},
		onInitialized: function (gridID) {},
		onKeyDown: function (gridID, rowIndex, columnIndex, dataField, value, keyCode, rowData, event) {},
		onRowClick: function (gridID, rowIndex, rowData, rowKey, columns, rowType) {},
		onRowDblClick: function (gridID, rowIndex, rowData, columnIndex, dataField) {},
		onRowInserted: function (gridID, rowIndex, rowData) {},
		onCellUpdating: function (gridID, value, rowIndex, dataField) {},
		onCellUpdated: function (gridID, rowIndex, columnIndex, dataField, columnValue, rowData) {},
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
	let btn;
	this.caption = caption;
	this.dataField = dataField;
	this.width = width;
	this.allowHeaderFiltering = false;
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
	} else if (dataType === "rowIndex") {
		this.cellTemplate = function($el, info) {
			let str = $el.parent().attr("aria-rowindex");
			$el.text(str);
		}
	} else if (dataType === "textarea") {
		this.__textarea = true;
		this.cellTemplate = function ($el, info) { // 개행 가능.
			$el.append($("<div>").html(info.text.replace(/\n/g, "<br/>")));
		}
		this.editorOptions = {
			onKeyDown: function(args){
				if(args.event.keyCode == 13){
					args.event.stopPropagation();
				}
			}
		}
	} else if (dataType === "button") {
		btn = function ($el, info) {
			let $btn, btnTxt;

			if (options && options.btnText) {
				btnTxt = options.btnText;
			} else {
				btnTxt = info.text;
			}

			$btn = $("<button>").html(btnTxt);

			$btn.on("click", function () {
				if (options && options.callBackFn) {
					let gridID = info.component._$element[0].attributes["id"].value;

					options.callBackFn(gridID, $el, info);
				}
			});

			return $btn;
		}

		this.cellTemplate = function ($el, info) {
			$el.append(btn($el, info));
		};
		this.allowEditing = false;
	}

	this.options = options;
	this.dataTypes = dataType;

	let dataTypeObj = dxGrid.method.__getDataFormat(dataType);
	$.extend(true, this, dataTypeObj);

	//options
	if (options) {
		let readonly = options.readonly;
		let maxLength = options.maxLength;
		let alignment = options.align;
		let visible = options.visible;
		let cellStyle = options.cellStyle;
		let headerStyle = options.headerStyle;
		let fixed = options.fixed;
		let filter = options.filter;
		let columnType = options.columnType;

		let div = function ($el, info, aStyle) {
			let $div = $("<div>");

			let style = "";

			if (typeof aStyle == "function") {
				style = aStyle(info.data);
			} else {
				style = aStyle;
			}

			if (style) {
				const index = style.indexOf(":");

				if (index > 0) {
					const attribute = style.substr(0, index).trim();
					const value = style.substr(index+1).trim();
					if (dataType === "rowIndex") {
						$el.css(attribute, value);
					} else {
						$div.css(attribute, value);
					}
				} else {
					$div.addClass(style);
				}
			}

			return $div;
		};

		if (readonly) {
			this.allowEditing = !readonly;
		}

		if (cellStyle) {
			if (dataType === "rowIndex") {
				this.cellTemplate = function($el, info) {
					let $div = div($el, info, cellStyle);

					$div.html(info.data.__rowIndex + 1);

					$el.append($div);
				}
			} else {
				this.cellTemplate = function ($el, info) {
					let $div = div($el, info, cellStyle);

					if (dataType === "button") {
						$div.append(btn($el, info));
					} else {
						$div.html(info.text.replace(/\n/g, "<br/>"));
					}

					$el.append($div);
				};
			}
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
			$.extend(true, this, columnType);
		}

		if (alignment) {
			this.alignment = alignment;
		}

		if (visible !== undefined) {
			this.visible = visible;
		}

		if (fixed) {
			this.fixed = true;
			this.fixedPosition = fixed;
		}

		if (filter) {
			this.allowHeaderFiltering = true;
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
			// paging: {enabled: false, pageSize: 0},
			showBorders: false,
			focusedRowEnabled: true,
			dataSource: [],
			// renderAsync: true,
			scrolling: {
				mode: "virtual",
				// rowRenderingMode: "virtual",
				// columnRenderingMode: "virtual",
			},
			// width 조정
			allowColumnResizing: true,
			columnResizingMode: "nextColumn",
			errorRowEnabled: false,
			headerFilter: { visible: true },

		}).dxDataGrid("instance");

		// 옵션
		if (option) {
			const checkbox = option.checkbox;
			const editable = option.editable;
			const sortable = option.sortable;
			const showRowIndex = option.showRowIndex;
			const showHeader = option.showHeader;

			if (checkbox) {
				instance.__checkBoxMode = true;
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
			} else {
				instance.option("sorting", {mode: "none"});
			}

			if (showRowIndex || typeof showRowIndex === "object") {
				instance.__showRowIndex = true;
				instance.__rowIndexStyle = showRowIndex;
			}

			if (showHeader === false) {
				instance.option("showColumnHeaders", false);
			}
		}

		dxGrid.method.__addEventListener(gridID);

		dxGrid.method.__executeListener("onInitialized", {gridID: gridID}, function () {
			Listener.grid.onInitialized(gridID);
		});
	},

	setColumn: function (gridID, columns, band) {
		let instance = dxGrid.getGridInstance(gridID);

		// rowIndex 추가
		if (instance.__showRowIndex) {
			let rowIndex;

			if (typeof instance.__rowIndexStyle === "object") {
				rowIndex = new Column("","","50px","rowIndex",{align: "right", fixed:"left", readonly:"true", cellStyle:instance.__rowIndexStyle.cellStyle, headerStyle:instance.__rowIndexStyle.headerStyle});
			} else {
				rowIndex = new Column("","","50px","rowIndex",{align: "right", fixed:"left", readonly:"true"});
			}
			columns.unshift(rowIndex);

			if (band) {
				band.unshift(new Band(""));
			}
		}

		columns = dxGrid.method.__configColumnType(gridID, columns);

		if (band) {
			columns = dxGrid.method.__setBands(gridID, columns, band);
		}

		instance.option("columns", columns);
		instance.option("onEditorPreparing", function(evt) {
			let maxLength = -1;

			// textarea
			if (evt.__textarea) {
				evt.editorName = "dxTextArea";
			}

			// maxLength 설정
			for (let i = 0; i < columns.length; i++) {
				if (columns[i].dataField === evt.dataField && columns[i].options && columns[i].options.maxLength) {
					maxLength = columns[i].options.maxLength;
				}
			}

			if (maxLength && maxLength > 0) {
				evt.editorOptions.maxLength = maxLength;
				evt.editorOptions.max = Math.pow(10, maxLength) - 1;
			}

			// 마우스 휠 할 때, 숫자 증감 해제
			evt.editorOptions.step = 0;

			// 체크박스 (-2) 컬럼엔 이벤트 걸지 않음
			if (evt.index != -2) {
				evt.editorOptions.onValueChanged = function (args) {
					evt.setValue(args.value);
					let oldData = args.previousValue;
					let newData = args.value;
					dxGrid.method.__onCellUpdatEvent(gridID, oldData, newData, evt.row.rowIndex, evt.dataField, evt.row.data, evt.index);
				}
			}

			if (evt.lookup != undefined) {
				evt.editorOptions.onValueChanged = function (args) {
					evt.setValue(args.value);
					evt.component.refresh(true).done(function () {
						let oldData = args.previousValue;
						let newData = args.value;
						dxGrid.method.__onCellUpdatEvent(gridID, oldData, newData, evt.row.rowIndex, evt.dataField, evt.row.data, evt.index);
					});
				}
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

		if (data) {
			if (!(data instanceof Array)) {
				data.check = false;
				data.__rowKey = dxGrid.method.__getKeyString();
				data = [data];
			} else {
				for (let j = 0 ; j < data.length ; j++) {
					data[j].check = false;
					data[j].__rowIndex = j;
					data[j].__rowKey = dxGrid.method.__getKeyString();
				}
			}

			// codehelp 코드명
			for (let i = 0 ; i < columns.length ; i++) {
				if (columns[i].__codeHelp && data && data.length > 0) {
					let nameTarget = columns[i].__nameTarget;
					if (!data[0].nameTarget) {
						Logger.warn("<codeHelp>", "dataSource에 " + nameTarget + "에 대한 데이터가 없습니다. join 을 통해 값을 가져오십시오.");
					}
				}
			}
		} else {
			data = [];
		}

		instance.option("dataSource", data);
		instance.option("focusedRowEnabled", true);
		instance.option("focusedRowKey", false);

		return instance.refresh();
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
		instance.saveEditData();

		return instance.getDataSource().store()._array;
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
		let allData = dxGrid.getGridData(gridID);
		let rowsData = instance.getSelectedRowsData();
		let rowIndex = [];

		for(let i = 0 ; i < rowsData.length ; i++) {
			let index = allData.indexOf(allData.filter(function (item) {
				return item.__rowKey === rowsData[i].__rowKey;
			})[0]);

			rowIndex.push(index);
		}

		for (let j = 0 ; j < rowsData.length ; j++) {
			$.extend(true, rowsData[j], {__rowIndex: rowIndex[j]});
		}

		return rowsData;
	},

	getTotRowCount: function(gridID){
		let instance = dxGrid.getGridInstance(gridID);
		return instance.totalCount();
	},

	getTotColCount: function(gridID){
		let instance = dxGrid.getGridInstance(gridID);
		return instance.columnCount();
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
			let allData = dxGrid.getGridData(gridID);
			rowIndex = allData ? allData.length : 0;
		}

		dataSource.store().insert(data, rowIndex).then( function () {
			dxGrid.method.__executeListener("onRowInserted", {gridID: gridID, rowIndex: rowIndex, rowData: data}, function () {
				Listener.grid.onRowInserted(gridID, rowIndex, data);
			});

			dxGrid.method.__setRowIndex(gridID, rowIndex);
		});

		return instance.refresh().done( function () {
			instance.option("focusedRowEnabled", true);

			let firstColumnIndex = 0
			if (instance.__checkBoxMode) {
				firstColumnIndex = 1;
			}

			if (instance.__showRowIndex) {
				firstColumnIndex++;
			}

			dxGrid.method.__setFocusOnCell(instance, rowIndex, firstColumnIndex);
		});
	},

	deleteRow: function(gridID, rowIndex) {
		let instance = dxGrid.getGridInstance(gridID);
		let allData = dxGrid.getGridData(gridID);
		let dataSource = instance.getDataSource();
		let rowKey = allData[rowIndex].__rowKey;

		instance.option("focusedRowEnabled", false);

		dataSource.store().remove(rowKey);

		dxGrid.method.__setRowIndex(gridID, rowIndex);

		instance.refresh();
		instance.option("focusedRowEnabled", true);
		instance.saveEditData();
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
		let dataSource = instance.getDataSource();

		instance.option("focusedRowEnabled", false);

		for (let j = 0 ; j < checkedData.length ; j++) {
			dataSource.store().remove(checkedData[j].__rowKey);
			instance.refresh();
		}

		dxGrid.method.__setRowIndex(gridID, 0);

		instance.deselectAll();
		instance.option("focusedRowEnabled", true);
		instance.saveEditData();
	},

	getCellValue: function(gridID, rowIndex, dataField) {
		let rowData = dxGrid.getRowData(gridID, rowIndex)
		return rowData[dataField];
	},

	setCellValue: function(gridID, rowIndex, dataField, value) {
		let rowData = dxGrid.getRowData(gridID, rowIndex);
		rowData[dataField] = value;

		dxGrid.setRowData(gridID, rowIndex, rowData);
	},

	getRowData: function(gridID, rowIndex) {
		let instance = dxGrid.getGridInstance(gridID);
		let $rowEl = instance.getRowElement(rowIndex);
		let rowData = $rowEl.data("options").data;

		return rowData;
	},

	setRowData: function(gridID, rowIndex, rowData) {
		let instance = dxGrid.getGridInstance(gridID);
		instance.saveEditData();

		let rowKey = instance.getKeyByRowIndex(rowIndex);
		let dataSource = instance.getDataSource();

		dataSource.store().update(rowKey, rowData).then(function () {
			dataSource.load();
		});
	},

	setFocus: function(gridID, rowIndex, dataField) {
		let instance = dxGrid.getGridInstance(gridID);
		let $cellEl = instance.getCellElement(rowIndex, dataField);
		if ($cellEl) {
			let colIndex = $cellEl.get(0).cellIndex;
			dxGrid.method.__setFocusOnCell(instance, rowIndex, colIndex);
		}
	},

	/**
	 * 현재 포커스를 가지고 있는 행의 index 반환
	 *
	 * @param gridID
	 */
	getRowIndex: function(gridID) {
		const rowIndex = __focusedRow ? __focusedRow.data.__rowIndex : undefined;
		return rowIndex;
	},

	setEmptyGrid: function(gridID) {
		let instance = dxGrid.getGridInstance(gridID);
		let columns = instance.option("columns");

		dxGrid.setGridData(gridID, []);
		instance.clearFilter();
		instance.clearSorting();

		instance.refresh().done(function () {
			dxGrid.method.__executeListener("onInitialized", {gridID: gridID}, function () {
				Listener.grid.onInitialized(gridID);
			});
		});
	},

	exportToExcel: function(gridID) {
		let instance = dxGrid.getGridInstance(gridID);
		let checkedData = dxGrid.getCheckedData(gridID);
		let bool = false;

		if (checkedData && checkedData.length > 0) {
			bool = true;
		}

		instance.exportToExcel(bool);
	},

	saveEditData: function (gridID) {
		let instance = dxGrid.getGridInstance(gridID);
		instance.saveEditData();
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
			let currentCellElement = instance.getCellElement(rowIndex, colIndex);
			instance.focus(currentCellElement);
			if (instance.columnOption(colIndex).allowEditing) {
				instance.editCell(rowIndex, colIndex);
			}
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

				__clickedCell = eventObject;

				if (eventObject.column === undefined) {
					return;
				}

				dxGrid.method.__executeListener("onCellClick", eventObject, function () {
					Listener.grid.onCellClick(gridID, eventObject.text, eventObject.value, eventObject.rowIndex, eventObject.dataField, eventObject.rowData, eventObject.row, eventObject.column, eventObject.column.index, eventObject.instance, eventObject.event);
				});
			});
			instance.option("onContentReady", function (eventObject) {
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onContentReady", eventObject, function () {
					Listener.grid.onContentReady(gridID, eventObject.instance);
				});

				$("div#"+gridID+" tr.dx-data-row").on("dblclick", function (evt) {
					dxGrid.method.__executeListener("onRowDblClick", __clickedCell, function () {
						Listener.grid.onRowDblClick(gridID, __clickedCell.rowIndex, __clickedCell.rowData, __clickedCell.column.index, __clickedCell.dataField);
					});
				});

				// 셀 클릭했을 때, value 앞에 포커스 설정 (IE버그)
				let $el = eventObject.element;
				let $input = $el.find("div.dx-editor-outlined input.dx-texteditor-input");
				if (__editingCell.key && $input.length == 1) {
					let column = __editingCell.column;
					let rowIndex = __editingCell.rowIndex;

					if (column) {
						if (!column.__selectBox) {
							let oldData = dxGrid.getCellValue(gridID, rowIndex, column.dataField);
							eventObject.element.find("div.dx-editor-outlined input.dx-texteditor-input").val("").focus();
							eventObject.element.find("div.dx-editor-outlined input.dx-texteditor-input").val(oldData).focus();
						}
					}
				}
			});
			instance.option("onEditingStart", function (eventObject) {

				if (eventObject.column.dataTypes !== "check") {
					__editingCell = eventObject;
				}

				eventObject.rowIndex = eventObject.component.getRowIndexByKey(eventObject.key);
				eventObject.dataField = eventObject.column ? eventObject.column.dataField: undefined;
				eventObject.rowData = eventObject.data;
				eventObject.value = eventObject.component.cellValue(eventObject.rowIndex, eventObject.column.dataField);
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onEditingStart", eventObject, function () {
					Listener.grid.onEditingStart(gridID, eventObject.value, eventObject.rowIndex, eventObject.dataField, eventObject.rowData, eventObject.instance);
				});
			});
			instance.option("onFocusedCellChanging", function (eventObject) {
				let columns = eventObject.columns;
				if (columns) {
					eventObject.prevDataField = columns[eventObject.prevColumnIndex] ? columns[eventObject.prevColumnIndex].dataField: undefined;
					eventObject.newDataField = columns[eventObject.newColumnIndex] ? columns[eventObject.newColumnIndex].dataField: undefined;
				}
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onFocusedCellChanging", eventObject, function () {
					Listener.grid.onFocusedCellChanging(gridID, eventObject.prevRowIndex, eventObject.prevDataField, eventObject.newRowIndex, eventObject.newDataField, eventObject.instance, eventObject.event);
				});
			});
			instance.option("onFocusedCellChanged", function (eventObject) {
				__focusedCell = {
					row: eventObject.row,
					column: eventObject.column,
					rowIndex: eventObject.rowIndex,
					columnIndex: eventObject.column ? eventObject.column.index: undefined
				}
				eventObject.dataField = eventObject.column ? eventObject.column.dataField: undefined;
				eventObject.instance = eventObject.component;

				dxGrid.method.__executeListener("onFocusedCellChanged", eventObject, function () {
					Listener.grid.onFocusedCellChanged(gridID, eventObject.rowIndex, eventObject.dataField, eventObject.instance);
				});
			});
			instance.option("onFocusedRowChanged", function (eventObject) {
				__focusedRow = eventObject.row;
				eventObject.rowData = eventObject.row ? eventObject.row.data: undefined;

				dxGrid.method.__executeListener("onFocusedRowChanged", eventObject, function () {
					Listener.grid.onFocusedRowChanged(gridID, eventObject.rowIndex, eventObject.rowData);
				});
			});
			instance.option("onInitialized", function (eventObject) {
				dxGrid.method.__executeListener("onInitialized", eventObject, function () {
					Listener.grid.onInitialized(gridID);
				});
			});
			instance.option("onKeyDown", function (eventObject) {
				if (eventObject.event.key == "F2") {
					eventObject.component.editCell(__focusedCell.rowIndex, __focusedCell.columnIndex);
				}

				eventObject.rowIndex = __focusedRow.rowIndex;
				eventObject.columnIndex = __focusedCell.columnIndex;
				eventObject.dataField = __focusedCell.column ? __focusedCell.column.dataField : undefined;
				eventObject.value = eventObject.component.cellValue(eventObject.rowIndex, eventObject.dataField);
				eventObject.keyCode = eventObject.event.keyCode;
				eventObject.rowData = __focusedRow.data;

				dxGrid.method.__executeListener("onKeyDown", eventObject, function () {
					Listener.grid.onKeyDown(gridID, eventObject.rowIndex, eventObject.columnIndex,eventObject.dataField, eventObject.value, eventObject.keyCode, eventObject.rowData, eventObject.event);
				});
			});
			instance.option("onRowClick", function (eventObject) {
				eventObject.rowData = eventObject.data;
				eventObject.rowKey = eventObject.key;

				dxGrid.method.__executeListener("onRowClick", eventObject, function () {
					Listener.grid.onRowClick(gridID, eventObject.rowIndex, eventObject.rowData, eventObject.rowKey, eventObject.columns, eventObject.rowType);
				});
			});
			instance.option("onRowInserted", function (eventObject) {
				eventObject.rowData = eventObject.data;

				dxGrid.method.__executeListener("onRowInserted", eventObject, function () {
					Listener.grid.onRowInserted(gridID, eventObject.rowIndex, eventObject.rowData);
				});
			});
			instance.option("onSelectionChanged", function (eventObject) {
				let instance = eventObject.component;
				let dataSource = instance.getDataSource();
				let selectedRowKey = eventObject.currentSelectedRowKeys[0];
				let deselectRowKey = eventObject.currentDeselectedRowKeys[0];

				dataSource.store().load().done(function (allData) {
					let row = allData.filter(function (item) {
						return (item.__rowKey === selectedRowKey || item.__rowKey === deselectRowKey);
					});
					if (row && row.length > 0) {
						row = row[0];
						row.check = !row.check;
						dataSource.store().update(row.__rowKey, row);
					}
				});

				dxGrid.method.__executeListener("onSelectionChanged", eventObject, function () {
					Listener.grid.onSelectionChanged(gridID, eventObject.currentSelectedRowKeys, eventObject.currentDeselectedRowKeys, eventObject.selectedRowsData);
				});
			});
		},

		__executeListener: function (fncName, eventObject, callbackFunc) {
			Logger.info(fncName, eventObject);
			try {
				callbackFunc();
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

					$.extend(true, col, new dxGrid.method.__configCodeHelp(gridID, col.__dataSource, col.__nameTarget, col));
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
						$.extend(true,col, new dxGrid.method.__configSelectBox(key, __keyMap));
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
				let oldTargetData = options.text;
				let oldNameTargetData = dxGrid.getCellValue(gridID, rowIndex, nameTarget);
				let rowData = dxGrid.getRowData(gridID, rowIndex);
				let targetIndex = gridInstance.columnOption(target).index;
				let nameTargetIndex = gridInstance.columnOption(nameTarget).index;

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
					onValueChanged: function (args) {
						options.setValue(args.value);
						let oldData = args.previousValue;
						let newData = args.value;

						dxGrid.method.__onCellUpdatEvent(gridID, oldData, newData, rowIndex, target, rowData, targetIndex);
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
					onFocusOut: function (evt) {
						let relatedTarget = evt.event.relatedTarget;

						if (relatedTarget && relatedTarget.children && relatedTarget.children[0] && relatedTarget.children[0].classList && relatedTarget.children[0].classList.contains("dx-pointer-events-target")) {
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

						let btnFn = function() {
							gridInstance.cellValue(rowIndex, target, focusedCode);
							gridInstance.cellValue(rowIndex, nameTarget, focusedName);

							gridInstance.refresh(true).done(function () {
								let newTargetData = focusedCode;
								let newNameTargetData = focusedName;

								dxGrid.method.__onCellUpdatEvent(gridID, oldTargetData, newTargetData, rowIndex, target, rowData, targetIndex);
								dxGrid.method.__onCellUpdatEvent(gridID, oldNameTargetData, newNameTargetData, rowIndex, nameTarget, rowData, nameTargetIndex);
							});

							Popup.hide(popupID);
						};

						// 폼 만들기
						let $form = Form.create(Form.Code(dataSource, tbxId, grdId, btnId, btnFn));

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

						btnInstance.option("onClick", btnFn);

						// 팝업창 생성
						Popup.create(popupID, $form, gridID, rowIndex, colIndex).show();
					}
				});

				parentCellTextBox.find(".dx-texteditor-buttons-container").append(parentCellButton);

				return $("<div>").append(parentCellTextBox);
			}
		},

		// cascading value change event.
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
					$.extend(true, band, columns[k]);
					return band;
				}
			}
			return band;
		},

		__getDataFormat: function (dataType) {
			let precision = undefined;

			/**
			 * type: number, percent 인 경우, 소수점(precision) 설정
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
						$.extend(true, obj, {format: {type: "fixedPoint", precision: precision}});
					}
					return obj;
				case "percent":
					return {
						dataType: "number",
						format: {type: "percent", precision: precision}
					};
				case "date":
					return {dataType: "date", format: "yyyy-MM-dd"};
				case "check":
					return {dataType: "boolean", alignment: "center"};
				case "password":
					return {
						customizeText: function (options) {
							let str = "";
							for (let i = 0 ; i < options.valueText.length ; i++) {
								str += "*";
							}
							return str;
						}
					}
			}
		},

		__onCellUpdatEvent: function (gridID, oldData, newData, rowIndex, dataField, rowData, columnIndex) {
			dxGrid.method.__executeListener("onCellUpdating", {gridID: gridID, value: oldData, rowIndex: rowIndex, dataField: dataField}, function () {
				Listener.grid.onCellUpdating(gridID, oldData, rowIndex, dataField);
			});

			if (oldData != newData) {
				rowData = dxGrid.getRowData(gridID, rowIndex);
				rowData[dataField] = newData;

				dxGrid.method.__executeListener("onCellUpdated", {gridID: gridID, rowIndex: rowIndex, columnIndex: columnIndex, dataField: dataField, columnValue : newData, rowData: rowData}, function () {
					Listener.grid.onCellUpdated(gridID, rowIndex, columnIndex, dataField, newData, rowData);
				});
			}
		},

		__setRowIndex: function (gridID, rowIndex) {
			let instance = dxGrid.getGridInstance(gridID);
			let allData = instance.getDataSource().store()._array;

			for(let i = rowIndex ; i < allData.length ; i++) {
				allData[i].__rowIndex = i;
			}
		},
	},
	/**
	 * SelectBox 객체. parentCode 가 상위 코드
	 *
	 * @param dataSource - Array	: JSON data가 있는 배열
	 * @param [parentField]		: 상위 SelectBox의 DataField
	 **
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

	method: {
		__create: function (id, label) {
			let $field = $("<div class='dx-field'></div>");

			if (label != undefined) {
				$field.prepend("<div class='dx-field-label'>"+ label +"</div>");
				$field.append("<div class='dx-field-value'><div id="+ id +"></div></div>");
			} else {
				$field.append("<div id="+ id +"></div>");
			}

			return $field
		},

		__mergeFields: function (args) {
			let $fieldSet = $("<div class='dx-fieldset'></div>");

			for (let i = 0 ; i < args.length ; i++) {
				let arg = args[i];
				$fieldSet.append(arg);
			}

			return $fieldSet;
		}

	},

	Code: function (dataSource, tbxId, grdId, btnId, btnFn) {
		let $tbx = Form.method.__create(tbxId, "코드/명");
		let $grd = Form.method.__create(grdId);
		let $btn = Form.method.__create(btnId);

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
			paging: {enabled: false, pageSize: 0},
			onContentReady: function () {
				$("div#__popupGrid tr.dx-data-row").on("dblclick", function (evt) {
					btnFn();
				});
			},
		});
		$btn.find("#" + btnId).dxButton({
			text: "선택",
		});

		return Form.method.__mergeFields([$tbx, $grd, $btn]);
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