
// 헤더 Grouping 할 때만 쓰는 객체
const Band = function (dataField, columns) {
    this.dataField = dataField;

    if (columns !== null) {
        this.caption = dataField;
        this.columns = columns;
        this.headerCellTemplate = function (header) {
            header.append($("<div>").html(dataField.replace(/\n/g, "<br/>")));
        };
    }
}

// 처음 컬럼 셋팅할 때 쓰는 객체
const ColConfig = function (caption, dataField, width, dataType, precision) {
    this.caption = caption;
    this.dataField = dataField;
    this.width = width;
    this.headerCellTemplate = function (header, info) {
        header.append($("<div>").html(caption.replace(/\n/g, "<br/>")));
    };

    let dataTypeObj = Column.dataFormat(dataType, precision);
    _.merge(this, dataTypeObj);
}

/**
 *  __rowKey 가 각 행의 키값이 된다.
 */
const Grid = {
    config: {
        setGrid : function (gridId, width, height, checkBox) {
            let instance = $(gridId).dxDataGrid({
                width: width,
                height: height,
                selection: { mode: "multiple" },
                keyExpr: "__rowKey",
                editing : { texts: { confirmDeleteMessage: "", } },
                loadPanel: { enabled: false, },
                paging : { enabled: false, pageSize: 0 },
                showBorders: false,
                focusedRowEnabled: true,
                // width 조정
                allowColumnResizing: true,
                columnResizingMode: "nextColumn",
                columnMinWidth: 50,

                onColumnsChanging: function (e) {
                    let i = Grid.method.getGridInstance(gridId);
                    let columns = i.option("columns");
                    for (let col of columns) {
                        if(col.width == "auto") {
                            i.columnOption(col.dataField, "width", "auto");
                        }
                    }
                }

            }).dxDataGrid("instance");

            // checkBox
            if (checkBox) {
                instance.option("selection.showCheckBoxesMode", "always");
            } else {
                instance.option("selection.showCheckBoxesMode", "none");
                instance.option("selection.mode", "none");
            }

            // EventListener 연결
            Grid.method.__addEventListener(gridId);

        },

        setEditMode : function (gridId, boolean) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.option("onToolbarPreparing", function(e) {
                e.toolbarOptions.visible = false;
            });
            instance.option("editing", {mode:"batch", allowUpdating: boolean});
            Grid.config.setSorting(gridId, "none");
        },

        /**
         *
         * @param gridId
         * @param sorting - "none"      - 정렬 안 함
         *                  "single"    - 하나의 컬럼으로만 정렬 가능
         *                  "multiple"  - 여러 개의 컬럼으로 정렬 가능
         */
        setSorting : function (gridId, sorting) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.option("sorting", { mode : sorting, });
        },

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
        setGridData: async function (gridId, url) {
            let instance = Grid.method.getGridInstance(gridId);
            let gridData = await Grid.method.__getDataByUrl(url);

            for (let j = 0 ; j < gridData.length ; j++) {
                gridData[j].__rowKey = Grid.method.getKeyString();
            }

            instance.option("dataSource", []);
            instance.option("dataSource", gridData);
            instance.option("focusedRowEnabled", true);
            instance.option("focusedRowKey", false);
        },

        setGridDataByObj : function (gridId, data) {
            let instance = Grid.method.getGridInstance(gridId);

            if (!(data instanceof Array)) {
                data.__rowKey = Grid.method.getKeyString();
                data = [data];
            } else {
                for (let j = 0 ; j < data.length ; j++) {
                    data[j].__rowKey = Grid.method.getKeyString();
                }
            }

            instance.option("dataSource", []);
            instance.option("dataSource", data);
            instance.option("focusedRowEnabled", true);
            instance.option("focusedRowKey", false);
        },

        /**
         *
         * @param gridId    filter 된 내용을 출력할 Grid
         * @param keyArr    마스터, 디테일 테이블 사이의 Key 값
         * @param value     마스터 테이블의 Value 값
         */
        setGridFilter : function (gridId, keyArr, value) {
            let instance = Grid.method.getGridInstance(gridId);
            let filterExpr = new Array();

            if (keyArr != undefined) {
                for (let key of keyArr) {
                    filterExpr.push([key,"=",value[key]]);
                }
            }

            instance.option("filterValue", filterExpr);
        },

        __getDataByUrl : function (url) {
            return $.ajax({
                url : url,
                success : function(data) {
                    return data;
                },
                error : function(e) {
                    console.log("[ERROR]", e.responseText);
                }
            });
        },

        getGridInstance : function (gridId) {
            return $(gridId).dxDataGrid('instance');
        },

        getGridData : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            return instance.getDataSource().items();
        },

        /**
         * 랜덤 키 값을 생성해주는 함수.
         * 각 행의 __rowKey 의 값으로 들어간다.
         *
         * @returns {string}
         */
        getKeyString: function () {
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
         * @param index - 행이 들어갈 위치를 지정해준다.
         *
         * instance.option("focusedRowEnabled", false), instance.option("focusedRowEnabled", true)
         * 작동하기 위해서는 두 함수가 반드시 필요함
         *
         */
        addRow : function (gridId, data, index) {
            let instance = Grid.method.getGridInstance(gridId);
            let dataSource = instance.getDataSource();
            instance.option("focusedRowEnabled", false);

            data["__rowKey"] = Grid.method.getKeyString();

            // default 값은 bottom으로 들어가도록
            if (index == null) {
                index = Grid.method.getGridData(gridId);
                if (index != null) {
                    index = index.length;
                } else {
                    index = 0;
                }
            }
            dataSource.store().insert(data, index);
            instance.refresh();
            instance.option("focusedRowEnabled", true);
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
        },

        saveEditData : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.saveEditData();
        },

        __addEventListener : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);

            instance.option("onCellClick", function(eventObject) {
                Grid.method.__executeListener("onCellClick", eventObject, gridId, eventObject.cellElement, eventObject.column, eventObject.columnIndex, eventObject.component, eventObject.data, eventObject.displayValue, eventObject.element, eventObject.event, eventObject.event, eventObject.key, eventObject.model, eventObject.row, eventObject.rowIndex, eventObject.rowType, eventObject.text, eventObject.value);
            });
            instance.option("onContentReady", function(eventObject) {
                Grid.method.__executeListener("onContentReady", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model);
            });
            instance.option("onDataErrorOccurred", function(eventObject) {
                Grid.method.__executeListener("onDataErrorOccurred", eventObject, gridId, eventObject.component, eventObject.element, eventObject.error, eventObject.model);
            });
            instance.option("onEditingStart", function(eventObject) {
                Grid.method.__executeListener("onEditingStart", eventObject, gridId, eventObject.cancel, eventObject.column, eventObject.component, eventObject.data, eventObject.element, eventObject.key, eventObject.model);
            });
            instance.option("onFocusedCellChanged", function(eventObject) {
                Grid.method.__executeListener("onFocusedCellChanged", eventObject, gridId, eventObject.cellElement, eventObject.column, eventObject.columnIndex, eventObject.component, eventObject.element, eventObject.model, eventObject.row, eventObject.rowIndex);
            });
            instance.option("onFocusedCellChanging", function(eventObject) {
                Grid.method.__executeListener("onFocusedCellChanging", eventObject, gridId, eventObject.cancel, eventObject.cellElement, eventObject.columns, eventObject.component, eventObject.element, eventObject.event, eventObject.isHighlighted, eventObject.model, eventObject.newColumnIndex, eventObject.newRowIndex, eventObject.prevColumnIndex, eventObject.prevRowIndex, eventObject.rows);
            });
            instance.option("onFocusedRowChanged", function(eventObject) {
                Grid.method.__executeListener("onFocusedRowChanged", eventObject, gridId, eventObject.component, eventObject.element, eventObject.model, eventObject.row, eventObject.rowElement, eventObject.rowIndex);
            });
            instance.option("onFocusedRowChanging", function(eventObject) {
                Grid.method.__executeListener("onFocusedRowChanging", eventObject, gridId, eventObject.cancel, eventObject.component, eventObject.element, eventObject.event, eventObject.model, eventObject.newRowIndex, eventObject.prevRowIndex, eventObject.rowElement, eventObject.rows);
            });
            instance.option("onInitialized", function(eventObject) {
                Grid.method.__executeListener("onInitialized", eventObject, gridId, eventObject.component, eventObject.element);
            });
            instance.option("onInitNewRow", function(eventObject) {
                Grid.method.__executeListener("onInitNewRow", eventObject, gridId, eventObject.component, eventObject.data, eventObject.element, eventObject.model, eventObject.promise);
            });
            instance.option("onKeyDown", function(eventObject) {
                Grid.method.__executeListener("onKeyDown", eventObject, gridId, eventObject.component, eventObject.element, eventObject.event, eventObject.handled, eventObject.event, eventObject.model);
            });
            instance.option("onRowClick", function(eventObject) {
                Grid.method.__executeListener("onRowClick", eventObject, gridId, eventObject.columns, eventObject.component, eventObject.data, eventObject.element, eventObject.event, eventObject.groupIndex, eventObject.handled, eventObject.isExpanded, eventObject.isNewRow, eventObject.isSelected, eventObject.event, eventObject.key, eventObject.model, eventObject.rowElement, eventObject.rowIndex, eventObject.rowType, eventObject.values);
            });
            instance.option("onRowInserted", function(eventObject) {
                Grid.method.__executeListener("onRowInserted", eventObject, gridId, eventObject.component, eventObject.data, eventObject.element, eventObject.error, eventObject.key, eventObject.model);
            });
            instance.option("onRowUpdated", function(eventObject) {
                Grid.method.__executeListener("onRowUpdated", eventObject, gridId, eventObject.component, eventObject.data, eventObject.element, eventObject.error, eventObject.key, eventObject.model);
            });
            instance.option("onRowUpdating", function(eventObject) {
                Grid.method.__executeListener("onRowUpdating", eventObject, gridId, eventObject.cancel, eventObject.component, eventObject.element, eventObject.key, eventObject.model, eventObject.newData, eventObject.oldData);
            });
            instance.option("onRowValidating", function(eventObject) {
                Grid.method.__executeListener("onRowValidating", eventObject, gridId, eventObject.brokenRules, eventObject.component, eventObject.element, eventObject.errorText, eventObject.isValid, eventObject.key, eventObject.model, eventObject.newData, eventObject.oldData, eventObject.promise);
            });
            instance.option("onSelectionChanged", function(eventObject) {
                Grid.method.__executeListener("onSelectionChanged", eventObject, gridId, eventObject.component, eventObject.currentDeselectedRowKeys, eventObject.currentSelectedRowKeys, eventObject.element, eventObject.model, eventObject.selectedRowKeys, eventObject.selectedRowsData);
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

            instance.option("columns", []);
            instance.option("columns", columns);
            instance.repaint();
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

    dataFormat : function (dataType, precision) {
        switch (dataType) {
            case "text":
                return { alignment : "left" };
            case "number":
                let obj = { customizeText: (options) => { return options.valueText.replace(/\B(?=(\d{3})+(?!\d))/g, ","); } }
                if (precision != null) {
                    _.merge(obj, { format : { type: "fixedPoint", precision: precision }});
                }
                return obj;
            case "percent":
                return { format: { type: "percent", precision: precision } };
            case "date":
                return { dataType : "date", format : "yyyy-mm-dd" };
            case "check":
                return { dataType : "boolean", alignment : "center" };
            case "code":
                return { alignment : "center" };
        }
    },
}

const Attribute = function (attr, value, text) {
    this.attr = attr;
    this.value = value;
    this.text= text;
};

/**
 *
 * @param dataField     연산을 할 dataField
 * @param type          'avg' | 'count' | 'max' | 'min' | 'sum'
 * @param text          출력할 text 지정
 * @param valueFormat   출력할 value format 지정
 * @param alignment     'center' | 'left' | 'right'
 */
const Footer = function (dataField, type, text, valueFormat, alignment) {
    this.column = dataField;
    this.summaryType = type;
    this.displayFormat = text;
    if (valueFormat != null) {
        this.valueFormat = valueFormat.format;
    }
    this.alignment = alignment;
};

// LISTENER
let Listener = {
    grid : {
        onCellClick : function (gridId, cellElement, column, columnIndex, component, data, displayValue, element, event, event, key, model, row, rowIndex, rowType, text, value) { },
        onContentReady : function (gridId, component, element, model) { },
        onDataErrorOccurred : function (gridId, component, element, error, model) { },
        onEditingStart : function (gridId, cancel, column, component, data, element, key, model) { },
        onFocusedCellChanged : function (gridId, cellElement, column, columnIndex, component, element, model, row, rowIndex) { },
        onFocusedCellChanging : function (gridId, cancel, cellElement, columns, component, element, event, isHighlighted, model, newColumnIndex, newRowIndex, prevColumnIndex, prevRowIndex, rows) { },
        onFocusedRowChanged : function (gridId, component, element, model, row, rowElement, rowIndex) { },
        onFocusedRowChanging : function (gridId, cancel, component, element, event, model, newRowIndex, prevRowIndex, rowElement, rows) { },
        onInitialized : function (gridId, component, element) { },
        onInitNewRow : function (gridId, component, data, element, model, promise) { },
        onKeyDown : function (gridId, component, element, event, handled, event, model) { },
        onRowClick : function (gridId, columns, component, data, element, event, groupIndex, handled, isExpanded, isNewRow, isSelected, event, key, model, rowElement, rowIndex, rowType, values) { },
        onRowInserted : function (gridId, component, data, element, error, key, model) { },
        onRowUpdated : function (gridId, component, data, element, error, key, model) { },
        onRowUpdating : function (gridId, cancel, component, element, key, model, newData, oldData) { },
        onRowValidating : function (gridId, brokenRules, component, element, errorText, isValid, key, model, newData, oldData, promise) { },
        onSelectionChanged : function (gridId, component, currentDeselectedRowKeys, currentSelectedRowKeys, element, model, selectedRowKeys, selectedRowsData) { },
    },

}

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
