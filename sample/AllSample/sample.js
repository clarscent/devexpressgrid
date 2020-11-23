/**
 * DevExtreme
 * Version: 18.2.14
 *
 * 관련 문서 ( official documentation )
 * https://js.devexpress.com/Documentation/18_2/ApiReference/UI_Widgets/dxDataGrid/
 *
 */

/**
 * 헤더 Grouping 할 때만 쓰는 객체
 * @param dataField - string    : 컬럼의 dataField. 단, band로 묶는 상위 컬럼일 경우 컬럼 명(caption)
 * @param [columns] - Array   : 같이 묶을 컬럼들
 *
 * 관련 예시 문서
 * https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/MultiRowHeadersBands/jQuery/Light/
 */
const Band = function (dataField, columns) {
    this.dataField = dataField;

    if (columns !== null) {
        this.caption = dataField;
        this.columns = columns;
        // 헤더 caption 개행 가능하도록
        this.headerCellTemplate = function (header) {
            header.append($("<div>").html(dataField.replace(/\n/g, "<br/>")));
        };
    }
}

// 처음 컬럼 셋팅할 때 쓰는 객체
const ColConfig = function (caption, dataField, width, dataType, columnType, disabled) {
    this.caption = caption;
    this.dataField = dataField;
    this.width = width;
    this.headerCellTemplate = function (header, info) {
        header.append($("<div>").html(caption.replace(/\n/g, "<br/>")));
    };
    if (disabled) {
        this.allowEditing = false;
    }

    let dataTypeObj = Column.dataFormat(dataType);
    _.merge(this, dataTypeObj);

    if (typeof columnType == "object") {
        _.merge(this, columnType);
    }
}

/**
 * Header CSS 생성 객체
 *
 * @param attr      : CSS의 Attribute
 * @param value     : 해당 Attribute 의 값
 *
 */
const Attribute = function (attr, value) {
    this.attr = attr;
    this.value = value;
};

/**
 * Footer 생성 객체
 *
 * @param dataField     : 연산을 할 dataField
 * @param type          : 'avg' | 'count' | 'max' | 'min' | 'sum'
 * @param text          : 출력할 text 지정
 * @param dataFormat   : 출력할 value format 지정
 * @param alignment     : 'center' | 'left' | 'right'
 *
 */
const Footer = function (dataField, type, text, dataFormat, alignment) {
    this.column = dataField;
    this.summaryType = type;
    this.displayFormat = text;
    if (dataFormat != undefined && dataFormat != "") {
        let obj = Column.dataFormat(dataFormat);
        this.valueFormat = obj.format;
    }
    this.alignment = alignment;
};

let Listener = {
    grid : {
        onCellClick: function (gridId, component, element, model, jQueryEvent, event, data, key, value, displayValue, text, columnIndex, column, rowIndex, rowType, cellElement, row) { },
        onContentReady: function (gridId, component, element, model) { },
        onDataErrorOccurred: function (gridId, component, element, model, error) { },
        onEditingStart: function (gridId, component, element, model, data, key, cancel, column) { },
        onFocusedCellChanged: function (gridId, component, element, model, cellElement, columnIndex, rowIndex, row, column) { },
        onFocusedCellChanging: function (gridId, component, element, model, cellElement, prevColumnIndex, prevRowIndex, newColumnIndex, newRowIndex, event, rows, columns, cancel, isHighlighted) { },
        onFocusedRowChanged: function (gridId, component, element, model, rowElement, rowIndex, row) { },
        onFocusedRowChanging: function (gridId, component, element, model, rowElement, prevRowIndex, newRowIndex, event, rows, cancel) { },
        onInitialized: function (gridId, component, element) { },
        onInitNewRow: function (gridId, component, element, model, data) { },
        onKeyDown: function (gridId, component, element, model, jQueryEvent, event, handled) { },
        onRowClick: function (gridId, component, element, model, jQueryEvent, event, data, key, values, columns, rowIndex, rowType, isSelected, isExpanded, groupIndex, rowElement, handled) { },
        onRowInserted: function (gridId, component, element, model, data, key, error) { },
        onRowUpdated: function (gridId, component, element, model, data, key, error) { },
        onRowUpdating: function (gridId, component, element, model, oldData, newData, key, cancel) { },
        onRowValidating: function (gridId, component, element, model, brokenRules, isValid, key, newData, oldData, errorText) { },
        onSelectionChanged: function (gridId, component, element, model, currentSelectedRowKeys, currentDeselectedRowKeys, selectedRowKeys, selectedRowsData) { },
    },

};

// LOGGER
const LOG_LEVEL_ERROR = 1;
const LOG_LEVEL_WARN = 2;
const LOG_LEVEL_INFO = 3;
const LOG_LEVEL_DEBUG = 4;
const Logger = {

    __logLevel : LOG_LEVEL_DEBUG,

    setLogLevel: function(logLevel) {
        Logger.__logLevel = logLevel;
    },

    error : function(title, message) {
        if (Logger.__logLevel >= LOG_LEVEL_ERROR) {
            console.error("[ERROR] " + title, message);
        }
    },
    warn : function(title, message) {
        if (Logger.__logLevel >= LOG_LEVEL_WARN) {
            console.warn("[WARN] " + title, message);
        }
    },
    info : function(title, message) {
        if (Logger.__logLevel >= LOG_LEVEL_INFO) {
            console.info("[INFO] " + title, message);
        }
    },
    debug : function(title, message) {
        if (Logger.__logLevel >= LOG_LEVEL_DEBUG) {
            console.debug("[DEBUG] " + title, message);
        }
    },
};

/**
 *  __rowKey 가 각 행의 키값이 된다.
 */
const Grid = {
    config: {
        setGrid : function (gridId, width, height, option) {
            let instance = $("#" + gridId).dxDataGrid({
                width: width,
                height: height,
                selection: { mode: "multiple" },
                keyExpr: "__rowKey",
                editing : { texts: { confirmDeleteMessage: "", } },
                loadPanel: { enabled: false, },
                paging : { enabled: false, pageSize: 0 },
                showBorders: false,
                focusedRowEnabled: true,
                dataSource : [],
                // width 조정
                allowColumnResizing: true,
                columnResizingMode: "nextColumn",
                columnMinWidth: 50,
                onEditorPreparing : function (evt) {
                    /**
                     * Lookup 설정부분
                     *
                     * Configuration 관련 문서
                     * https://js.devexpress.com/Documentation/18_2/ApiReference/UI_Widgets/dxLookup/Configuration/
                     */
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
                },

            }).dxDataGrid("instance");

            // 옵션
            if (option) {
                if (option.checkbox) {
                    instance.option("selection.showCheckBoxesMode", "always");
                } else {
                    instance.option("selection.showCheckBoxesMode", "none");
                    instance.option("selection.mode", "none");
                }

                if (option.editable) {
                    instance.option("onToolbarPreparing", function(e) {
                        e.toolbarOptions.visible = false;
                    });
                    instance.option("editing", {mode:"batch", allowUpdating: option.editable, allowAdding: option.editable});
                    instance.option("sorting", { mode : "none"});
                }

                if (option.sortable) {
                    instance.option("sorting", { mode : "single", });
                    if (option.sortable !== true) {
                        instance.option("sorting", { mode : option.sortable, });
                    }
                }
            }

            // EventListener 연결
            Grid.method.__addEventListener(gridId);
        },

        // setEditMode : function (gridId, editable) {
        //     let instance = Grid.method.getGridInstance(gridId);
        //     instance.option("onToolbarPreparing", function(e) {
        //         e.toolbarOptions.visible = false;
        //     });
        //     instance.option("editing", {mode:"batch", allowUpdating: editable, allowAdding: editable});
        //
        //     // Edit 모드 시, 정렬 기능 비활성화
        //     Grid.config.setSorting(gridId, "none");
        // },

        /**
         *
         * @param gridId
         * @param sortable - "none"      - 정렬 안 함
         *                   "single"    - 하나의 컬럼으로만 정렬 가능
         *                   "multiple"  - 여러 개의 컬럼으로 정렬 가능
         */
        // setSorting : function (gridId, sortable) {
        //     let instance = Grid.method.getGridInstance(gridId);
        //     instance.option("sorting", { mode : sortable, });
        // },

        setFooter : function (gridId, footer) {
            let instance = Grid.method.getGridInstance(gridId);
            if (footer != undefined) {
                for (let elm of footer) {
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
            instance.option("summary", { totalItems: footer, });
        },

    },

    method: {
        setGridData : function (gridId, data) {
            let instance = Grid.method.getGridInstance(gridId);

            if (!(data instanceof Array)) {
                data.__rowKey = Grid.method.__getKeyString();
                data = [data];
            } else {
                for (let j = 0 ; j < data.length ; j++) {
                    data[j].__rowKey = Grid.method.__getKeyString();
                }
            }

            instance.option("dataSource", data);
            instance.option("focusedRowEnabled", true);
            instance.option("focusedRowKey", false);
        },

        setGridDataByUrl: async function (gridId, url) {
            let instance = Grid.method.getGridInstance(gridId);
            let gridData = await Grid.method.__getDataByUrl(url);

            for (let j = 0 ; j < gridData.length ; j++) {
                gridData[j].__rowKey = Grid.method.__getKeyString();
            }

            instance.option("dataSource", gridData);
            instance.option("focusedRowEnabled", true);
            instance.option("focusedRowKey", false);

        },

        /**
         *
         * @param gridId    filter 된 내용을 출력할 Grid
         * @param keyArr    마스터, 디테일 테이블 사이의 Key 값
         * @param value     마스터 테이블의 Value 값
         */
        // setGridFilter : function (gridId, keyArr, value) {
        //     let instance = Grid.method.getGridInstance(gridId);
        //     let filterExpr = new Array();
        //
        //     if (keyArr != undefined) {
        //         for (let key of keyArr) {
        //             filterExpr.push([key,"=",value[key]]);
        //         }
        //     }
        //
        //     instance.option("filterValue", filterExpr);
        // },

        getGridInstance : function (id) {
            return $("#" + id).dxDataGrid("instance");
        },

        getGridData : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            return instance.getDataSource() ? instance.getDataSource().items() : undefined;
        },

        /**
         * 선택한 행들의 데이터와 행의 인덱스를 리턴
         *
         * @param gridId
         * @returns {*}
         *
         */
        getCheckedData : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            let rowsData = instance.getSelectedRowsData();
            let rowIndex;

            for (let j = 0 ; j < rowsData.length ; j++) {
                rowIndex = instance.getRowIndexByKey(rowsData[j]["__rowKey"]);
                _.merge(rowsData[j], { __rowIndex : rowIndex });
            }

            return rowsData;
        },

        /**
         * 새로운 행 추가
         *
         * @param gridId
         * @param data  - 행에 들어갈 데이터를 넣어준다.
         * @param rowIndex - 행이 들어갈 위치를 지정해준다.
         *
         */
        addRow : async function (gridId, data, rowIndex) {
            let instance = Grid.method.getGridInstance(gridId);
            let dataSource = instance.getDataSource();
            instance.option("focusedRowEnabled", false);

            if (data == undefined) {
                data = new Object();
            }
            data["__rowKey"] = Grid.method.__getKeyString();

            // default 값은 bottom으로 들어가도록
            if (rowIndex == null) {
                rowIndex = Grid.method.getGridData(gridId);
                if (rowIndex != null) {
                    rowIndex = rowIndex.length;
                } else {
                    rowIndex = 0;
                }
            }
            dataSource.store().insert(data, rowIndex);
            instance.refresh().done(() => {
                instance.option("focusedRowEnabled", true);
                Grid.method.__setFocusOnCell(instance, rowIndex, 1);
            });

        },

        /**
         * 선택한 행들을 일괄 삭제
         *
         * @param gridId
         *
         * instance.option("focusedRowEnabled", false), instance.option("focusedRowEnabled", true)
         * 작동하기 위해서는 두 함수가 반드시 필요함
         *
         */
        deleteRow : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            let checkedData = Grid.method.getCheckedData(gridId);
            instance.option("focusedRowEnabled", false);

            for (let j = 0 ; j < checkedData.length ; j++) {
                instance.deleteRow(checkedData[j].__rowIndex);
                instance.refresh();
            }
            instance.deselectAll();
            instance.option("focusedRowEnabled", true);
            Grid.method.saveEditData(gridId);
        },

        saveEditData : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.saveEditData();
        },

        __setFocusOnCell : function (instance, rowIndex, colIndex) {
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

        __getDataByUrl : function (url) {
            return $.ajax({
                url : url,
                success : function(data) {
                    console.log("[SUCCESS]", data);
                    return data;
                },
                error : function(e) {
                    console.log("[ERROR]", e.responseText);
                }
            });
        },

        __addEventListener : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);

            instance.option("onCellClick", function(eventObject) {
                Grid.method.__executeListener("onCellClick", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.jQueryEvent, eventObject.event, eventObject.data, eventObject.key, eventObject.value, eventObject.displayValue, eventObject.text, eventObject.columnIndex, eventObject.column, eventObject.rowIndex, eventObject.rowType, eventObject.cellElement, eventObject.row);
            });
            instance.option("onContentReady", function(eventObject) {
                Grid.method.__executeListener("onContentReady", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model);
            });
            instance.option("onDataErrorOccurred", function(eventObject) {
                Grid.method.__executeListener("onDataErrorOccurred", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.error);
            });
            instance.option("onEditingStart", function(eventObject) {
                __currentEditingColumn = eventObject.column;

                Grid.method.__executeListener("onEditingStart", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.data, eventObject.key, eventObject.cancel, eventObject.column);
            });
            instance.option("onFocusedCellChanged", function(eventObject) {
                __focusedCellElement = [eventObject.rowIndex, eventObject.columnIndex];

                Grid.method.__executeListener("onFocusedCellChanged", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.cellElement, eventObject.columnIndex, eventObject.rowIndex, eventObject.row, eventObject.column);
            });
            instance.option("onFocusedCellChanging", function(eventObject) {
                Grid.method.__executeListener("onFocusedCellChanging", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.cellElement, eventObject.prevColumnIndex, eventObject.prevRowIndex, eventObject.newColumnIndex, eventObject.newRowIndex, eventObject.event, eventObject.rows, eventObject.columns, eventObject.cancel, eventObject.isHighlighted);
            });
            instance.option("onFocusedRowChanged", function(eventObject) {
                Grid.method.__executeListener("onFocusedRowChanged", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.rowElement, eventObject.rowIndex, eventObject.row);
            });
            instance.option("onFocusedRowChanging", function(eventObject) {
                Grid.method.__executeListener("onFocusedRowChanging", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.rowElement, eventObject.prevRowIndex, eventObject.newRowIndex, eventObject.event, eventObject.rows, eventObject.cancel);
            });
            instance.option("onInitialized", function(eventObject) {
                Grid.method.__executeListener("onInitialized", eventObject, gridId, eventObject.component, eventObject.element);
            });
            instance.option("onInitNewRow", function(eventObject) {
                Grid.method.__executeListener("onInitNewRow", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.data);
            });
            instance.option("onKeyDown", function(eventObject) {
                let column = __currentEditingColumn;

                if (eventObject.event.key == "Enter" && column.__helpPopUp) {
                    __listener.grid.onKeyDown(eventObject);
                }

                if (eventObject.event.key == "F2") {
                    eventObject.component.editCell(__focusedCellElement[0],__focusedCellElement[1]);
                }

                Grid.method.__executeListener("onKeyDown", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.jQueryEvent, eventObject.event, eventObject.handled);
            });
            instance.option("onRowClick", function(eventObject) {
                Grid.method.__executeListener("onRowClick", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.jQueryEvent, eventObject.event, eventObject.data, eventObject.key, eventObject.values, eventObject.columns, eventObject.rowIndex, eventObject.rowType, eventObject.isSelected, eventObject.isExpanded, eventObject.groupIndex, eventObject.rowElement, eventObject.handled);
            });
            instance.option("onRowInserted", function(eventObject) {
                Grid.method.__executeListener("onRowInserted", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.data, eventObject.key, eventObject.error);
            });
            instance.option("onRowUpdated", function(eventObject) {
                Grid.method.__executeListener("onRowUpdated", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.data, eventObject.key, eventObject.error);
            });
            instance.option("onRowUpdating", function(eventObject) {
                Grid.method.__executeListener("onRowUpdating", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.oldData, eventObject.newData, eventObject.key, eventObject.cancel);
            });
            instance.option("onRowValidating", function(eventObject) {
                Grid.method.__executeListener("onRowValidating", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.brokenRules, eventObject.isValid, eventObject.key, eventObject.newData, eventObject.oldData, eventObject.errorText);
            });
            instance.option("onSelectionChanged", function(eventObject) {
                Grid.method.__executeListener("onSelectionChanged", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.currentSelectedRowKeys, eventObject.currentDeselectedRowKeys, eventObject.selectedRowKeys, eventObject.selectedRowsData);
            });
        },

        __executeListener : function (fncName, pobj, ...args) {
            Logger.info(fncName, pobj);
            try {
                Listener.grid[fncName](...args);
            } catch (err) {
                Logger.error(fncName, err);
            }
        },

    },

}

const Header = {
    config: {
        setHeader : function (gridId, columns, band) {
            for ( let j = 0 ; j < band.length ; j++) {
                band[j] = Column.method.__mergeBandAndColumn(band[j], columns);

                if (band[j].columns != null) {
                    Header.config.setHeader(gridId, columns, band[j].columns);
                }
            }

            Column.config.setColumn(gridId, band);

            let headerCss = [
                new Attribute("text-align", "center"),
            ]
            Header.config.setCss(gridId, headerCss);
        },

        setCss : function (gridId, css) {
            let instance = Grid.method.getGridInstance(gridId);
            let columns = instance.option("columns");
            columns = Header.method.__mergeHeaderTemplate(columns, css);
            Column.config.setColumn(gridId, columns);
        },

    },

    method: {
        __mergeHeaderTemplate : function (header, css) {
            for (let k = 0 ; k < header.length ; k++) {
                header[k].headerCellTemplate = function (header, info) {
                    header.append($("<div>").html(info.column.caption.replace(/\n/g, "<br/>")));
                    for (let j = 0 ; j < css.length ; j++) {
                        header.parent().css(css[j].attr, css[j].value);
                    }
                }

                if (header[k].columns != null) {
                    header[k].columns = Header.method.__mergeHeaderTemplate(header[k].columns, css);
                }
            }
            return header;
        },

    }
}

const Column = {
    config: {
        setColumn : function (gridId, columns) {
            let instance = Grid.method.getGridInstance(gridId);

            columns = Column.config.__configColumnType(gridId, columns);

            instance.option("columns", columns);
            instance.refresh();
        },

        __checkDataSourceJsonKey : function (dataSource, text, ...args) {
            if (dataSource && dataSource.length > 0) {
                let obj = dataSource[0];
                let keys = Object.keys(obj);
                // const popUpId = "__popUp";

                for (let code of args) {
                    let flag = false;
                    for (let key of keys) {
                        if (code === key) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        console.log("code", code);
                        // PopUp.create(popUpId, Form.create(Form.Type.Warn(popUpId, text)), "warn", gridId).show();
                        Logger.error("ERROR", text);
                    }
                }
            }
        },

        __configColumnType : function (gridId, columns) {
            let newColumns = new Array();
            // for SelectBox
            let __keyMap = Column.config.__makeKeyMap(columns);
            let __keys = Object.keys(__keyMap);

            for (let col of columns) {
                if (col.__helpPopUp) {
                    let dataSource = col.__dataSource;
                    let text = "[" + gridId + "]" +
                        "Help PopUp 컬럼 DataSource의 키 값은 CODE, NAME 이어야 합니다.";
                    Column.config.__checkDataSourceJsonKey(dataSource, text, "CODE", "NAME");

                    _.merge(col, new Column.config.__configHelpPopUp(gridId, col.__dataSource, col.__nameTarget))
                } else if (col.__selectBox) {
                    let dataSource = col.__dataSource;

                    if (col.__parentField) {
                        let text = "[" + gridId + "]" +
                            "SelectBox 컬럼 DataSource의 키 값은 CODE, NAME, parentCode 이어야 합니다.";
                        Column.config.__checkDataSourceJsonKey(dataSource, text, "CODE", "NAME", "parentCode");
                    } else {
                        let text = "[" + gridId + "]" +
                            "SelectBox 컬럼 DataSource의 키 값은 CODE, NAME 이어야 합니다.";
                        Column.config.__checkDataSourceJsonKey(dataSource, text, "CODE", "NAME");
                    }
                }


                for (let key of __keys) {
                    if (key == col.dataField) {
                        _.merge(col, new Column.config.__configSelectBox(key, __keyMap));
                        break;
                    }
                }
                newColumns.push(col);
            }

            return newColumns;
        },

        __makeKeyMap : function (columns) {
            let __keyMap = {};

            for (let col of columns) {
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

        __configHelpPopUp : function (gridId, dataSource, nameTarget) {
            this.editCellTemplate = function (container, options) {
                let gridInstance = Grid.method.getGridInstance(gridId);
                let rowIndex = options.rowIndex;
                let colIndex = options.columnIndex;
                let target = options.column.dataField;
                let isExist = false;

                const __codeHelpCellCallBack = function () {
                    const popUpId = "__warn";
                    let value = options.value;

                    if (value != undefined) {
                        isExist = false;
                        for (let data of dataSource) {
                            if (data["CODE"] == value) {
                                isExist = true;
                                value = data["NAME"];
                                break;
                            }
                        }

                        if (!isExist) {
                            const text = "존재하지 않는 코드입니다."
                            options.setValue(options.text);

                            PopUp.create(popUpId, Form.Type.Warn(popUpId, text), "warn", gridId, rowIndex, colIndex).show();
                        } else {
                            gridInstance.cellValue(rowIndex, nameTarget, value);
                        }

                        gridInstance.saveEditData();
                    }
                }

                // Enter 리스터 연결
                __listener.grid.onKeyDown = function () {
                    // 마지막 editable cell 일 때 (onFocusOut이벤트가 먹지않음)
                    if (rowIndex == gridInstance.totalCount() - 1 && colIndex == gridInstance.columnCount() - 1) {
                        __codeHelpCellCallBack();
                    }
                }

                // 그리드의 텍스트박스
                let parentCellTextBox = $("<div>").dxTextBox({
                    value: options.text,
                    valueChangeEvent: "keydown",
                    onValueChanged : function (evt) {
                        options.setValue(evt.value);
                    },
                    onFocusOut : function (evt) {
                        let relatedTarget = evt.event.relatedTarget;

                        if (relatedTarget == undefined) {
                            __codeHelpCellCallBack();
                        }  else if ( !$(relatedTarget).hasClass("dx-editor-cell") && relatedTarget.title !== "helpBtn" ) {
                            __codeHelpCellCallBack();
                        }
                    },
                });

                // 물음표 버튼
                let parentCellButton = $("<div>").dxButton({
                    hint : "helpBtn",
                    icon : "help",
                    onClick: function () {
                        const popUpId = "__popUp";
                        const tbxId = "__popUpTextBox";
                        const grdId = "__popUpGrid";
                        const btnId = "__popUpButton";

                        // 폼 만들기
                        let $form = Form.create(Form.Type.Code(dataSource, tbxId, grdId, btnId));

                        let focusedCode = "";
                        let focusedName = "";
                        let tbxInstance = $form.find("#" + tbxId).dxTextBox("instance");
                        let grdInstance = $form.find("#" + grdId).dxDataGrid("instance");
                        let btnInstance = $form.find("#" + btnId).dxButton("instance");

                        // 이벤트 연결
                        tbxInstance.option("onEnterKey", _ => {
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

                        grdInstance.option("onFocusedRowChanged", (e) => {
                            if (e && e.row && e.row.data) {
                                focusedCode = e.row.data["CODE"];
                                focusedName = e.row.data["NAME"];
                            }
                        });

                        btnInstance.option("onClick", function () {
                            gridInstance.cellValue(rowIndex, target, focusedCode);
                            gridInstance.cellValue(rowIndex, nameTarget, focusedName);
                            gridInstance.saveEditData();
                            PopUp.hide(popUpId);
                        });

                        // 팝업창 생성
                        PopUp.create(popUpId, $form, "code", gridId, rowIndex, colIndex + 2).show();
                    }
                });

                parentCellTextBox.find(".dx-texteditor-buttons-container").append(parentCellButton);

                return $("<div>").append(parentCellTextBox);
            }
        },

        __configSelectBox : function (key, __keyMap) {
            this.setCellValue = function (rowData, value) {
                rowData[key] = value;
                for (let child of __keyMap[key]) {
                    rowData[child] = null;
                    if (__keyMap[child] != undefined) {
                        for (let grandChild of __keyMap[child]) {
                            rowData[grandChild] = null;
                        }
                    }
                }
            }
        },

    },

    method: {
        __mergeBandAndColumn : function (band, columns) {
            for (let k = 0 ; k < columns.length ; k++) {
                if (band.dataField === columns[k].dataField) {
                    _.merge(band, columns[k]);
                    return band;
                }
            }
            return band;
        },
    },

    dataFormat : function (dataType) {
        let precision = undefined;

        /**
         * type : number, percen 인 경우, 소수점(precision) 설정
         */
        if (typeof dataType == "object") {
            precision = dataType.pre;
            dataType = dataType.type;
        }

        switch (dataType) {
            case "text":
                return { dataType: "string", alignment : "left" };
            case "number":
                let obj = {
                    customizeText: (options) => { return options.valueText.replace(/\B(?=(\d{3})+(?!\d))/g, ","); },
                    dataType: "number"
                }
                if (precision != null) {
                    _.merge(obj, { format : { type: "fixedPoint", precision: precision }});
                }
                return obj;
            case "percent":
                return {
                    dataType: "number",
                    format: { type: "percent", precision: precision }
                };
            case "date":
                return { dataType : "date", format : "yyyy-mm-dd" };
            case "check":
                return { dataType : "boolean", alignment : "center" };
            case "code":
                return { alignment : "center" };
        }
    },

    /**
     * SelectBox 객체. parentCode 가 상위 코드
     *
     * @param dataSource - Array    : JSON data가 있는 배열
     * @param [parentField]         : 상위 SelectBox의 DataField
     *
     */
    SelectBox : function (dataSource, parentField) {
        this.__selectBox = true;
        this.__parentField = parentField;
        this.__dataSource = dataSource;

        this.lookup = { dataSource : "", valueExpr : "CODE", displayExpr: "NAME" };
        if (parentField != undefined) {
            this.lookup.dataSource = function (options) {
                return {
                    store: dataSource,
                    filter: options.data ? ["parentCode", "=", options.data[parentField]] : null,
                }
            }
        } else {
            this.lookup.dataSource = dataSource;
        }
    },

    HelpPopUp : function (dataSource, nameTarget) {
        this.__helpPopUp = true;
        this.__dataSource = dataSource;
        this.__nameTarget = nameTarget;
    },

}

const Form = {
    create : function (type) {
        let form = $("<div class='form'></div>");

        if (type != undefined) {
            form.append(type);
        }

        return form;
    },

    __Field : {
        create : function (id, label) {
            let $field = $("<div class='dx-field'></div>");

            if (label != undefined) {
                $field.prepend("<div class='dx-field-label'>"+ label +"</div>");
                $field.append("<div class='dx-field-value'><div id="+ id +"></div></div>");
            } else {
                $field.append("<div id="+ id +"></div>");
            }

            return $field
        },

        mergeFields : function (...args) {
            let $fieldSet = $("<div class='dx-fieldset'></div>");

            for (let arg of args) {
                $fieldSet.append(arg);
            }

            return $fieldSet;
        }

    },

    Type : {
        Code : function (dataSource, tbxId, grdId, btnId) {
            let $tbx = Form.__Field.create(tbxId, "코드/명");
            let $grd = Form.__Field.create(grdId);
            let $btn = Form.__Field.create(btnId);

            $tbx.find("#" + tbxId).dxTextBox({});
            $grd.find("#" + grdId).dxDataGrid({
                dataSource: dataSource,
                keyExpr: "CODE",
                columns : [
                    { caption: "코드", dataField: "CODE"},
                    { caption: "명", dataField: "NAME"},
                ],
                width: "100%",
                height: 250,
                focusedRowEnabled: true,
            });
            $btn.find("#" + btnId).dxButton({
                text: "선택",
            });

            return Form.__Field.mergeFields($tbx, $grd, $btn);
        },

        Warn : function (popUpId, text) {
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
                    PopUp.hide(popUpId);
                }
            });
            $btn.css("text-align", "center");

            return Form.__Field.mergeFields($text, $btn);
        },
    }
};

const PopUp = {
    create : function (popUpId, form, type, gridId, rowIndex, colIndex) {
        let instance = Grid.method.getGridInstance(gridId);
        let popUpObj = {
            position: {
                my: "center",
                at: "center",
                of: window
            },
            animation: undefined,
            closeOnOutsideClick: false,
            showTitle: true,
            contentTemplate: function () {
                return form;
            },
            onHiding : function () {
                if (rowIndex && colIndex) {
                    Grid.method.__setFocusOnCell(instance, rowIndex, colIndex)
                }
            },
            onHidden : function () {
                $("#" + popUpId).remove();
                instance.endUpdate();
            },
            onShowing : function () {
                instance.beginUpdate();
            }
        }

        $("#" + gridId).after("<div id=" + popUpId + "></div>");

        if (type === "code") {
            _.merge(popUpObj, {
                width: 500,
                height: 500,
                title: "코드",
                /**
                 * html - height: 100%,
                 * body - min-height : 100%
                 * 일 때만 dragging 가능
                 */
                dragEnabled: true,
            })
        } else if (type === "warn") {
            _.merge(popUpObj, {
                width: 300,
                height: "auto",
                title: "Warning",
                dragEnabled: false,
            });
        }

        return $("#" + popUpId).dxPopup(popUpObj).dxPopup("instance");
    },

    show : function (id) {
        PopUp.getInstance(id).show();
    },

    hide : function (id) {
        PopUp.getInstance(id).hide();
    },

    getInstance : function (id) {
        return $("#" + id).dxPopup("instance");
    },

};

let __focusedCellElement = new Array(2);
let __currentEditingColumn = new Object();
let __listener = {
    grid : {
        onKeyDown : function(eventObject) { },
    }
}



