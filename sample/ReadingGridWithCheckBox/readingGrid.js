
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
var ColConfig = function (caption, dataField, width, dataType, precision) {
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
 *  __rowIndex 가 각 행의 키값이 된다.
 */
var Grid = {
    config: {
        setGrid : function (gridId, width, height, checkBox) {
            let instance = $(gridId).dxDataGrid({
                width: width,
                height: height,
                selection: { mode: "multiple" },
                keyExpr: "__rowIndex",
                editing : {
                    texts: { confirmDeleteMessage: "", }
                },
                loadPanel: { enabled: false, },
                onSelectionChanged : function (e) {
                    e.component.refresh();
                },

            }).dxDataGrid("instance");

            if (checkBox) {
                instance.option("selection.showCheckBoxesMode", "always");
            } else {
                instance.option("selection.showCheckBoxesMode", "none");
            }

            // Add EventListener
            return Grid.__addEventListener(gridId);

        },

        setGridData: function (gridId, data) {
            for (let j = 0 ; j < data.length ; j++) {
                data[j].__rowIndex = j;
            }
            Grid.method.getGridInstance(gridId).option("dataSource", data);
        },

        setEditMode : function (gridId, boolean) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.option("onToolbarPreparing", function(e) {
                e.toolbarOptions.visible = false;
            });
            instance.option("editing", {mode:"batch", allowUpdating: boolean});
            this.setSorting(gridId, "none");
        },

        /*
            sorting - 정렬 시 옵션 지정
                value:  "none" - 정렬 안 함
                        "single" - 하나의 컬럼으로만 정렬 가능
                        "multiple" - 여러개의 컬럼으로 정렬 가능
         */
        setSorting : function (gridId, sorting) {
            Grid.method.getGridInstance(gridId).option("sorting", { mode : sorting, });
        },

    },

    method: {
        getGridInstance : function (gridId) {
            return $(gridId).dxDataGrid('instance');
        },

        getGridData : function (gridId) {
            return Grid.method.getGridInstance(gridId)._controllers.data._dataSource._items;
        },

        getCheckedData : function (gridId) {
            return Grid.method.getGridInstance(gridId).getSelectedRowsData();
        },

        addRow : function (gridId, data, index) {
            Grid.method.getGridInstance(gridId).deselectAll();
            let dataSource = Grid.method.getGridInstance(gridId).getDataSource();
            let arr = JSON.parse(JSON.stringify(dataSource.store()._array));

            switch (index) {
                case null :
                case "bottom":
                    arr.push(data);
                    break;
                case "top":
                    arr.unshift(data);
                    break;
                default :
                    arr.splice(index, 0, data);
                    break;
            }

            this.__setRowSeq(arr);

            dataSource.store()._array = arr;
            dataSource.reload();
        },

        deleteRow : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            let dataSource = instance.getDataSource();
            let checkedData = this.getCheckedData(gridId);
            for (let j = 0 ; j < checkedData.length ; j++) {
                instance.deleteRow(checkedData[j].__rowIndex);
                dataSource.reload();
            }
            instance.deselectAll();

            this.__setRowSeq(dataSource.store()._array);
        },

        saveEditData : function (gridId) {
            Grid.method.getGridInstance(gridId).saveEditData();
        },

        __setRowSeq : function (arr) {
            for (let j = 0 ; j <arr.length ; j++) {
                arr[j].__rowIndex = j;
            }
        },

    },


    __addEventListener : function (gridId) {
        let listener = Listener.getListenerInstance(gridId);

        let keys = Object.keys(listener.grid);

        for (let j = 0 ; j < keys.length ; j++) {
            Grid.method.getGridInstance(gridId).option(keys[j], function () {
                Logger.info("",keys[j]);
                try {
                    listener.grid[keys[j]]();
                } catch (err) {
                    Logger.error("",err);
                }
            });
        }

    }

}

var Header = {
    config: {
        set : function (gridId, columns, band) {
            for ( let j = 0 ; j < band.length ; j++) {
                band[j] = Column.method.__mergeBandAndColumn(band[j], columns);

                if (band[j].columns != null) {
                    this.set(gridId, columns, band[j].columns);
                }
            }

            Column.config.set(gridId, band);
        },

        setCss : function (gridId, css) {
            let columns = Grid.method.getGridInstance(gridId).option("columns");
            columns = Header.method.__mergeHeaderTemplate(columns, css);
            Column.config.set(gridId, columns);
        },

    },

    method: {
        __mergeHeaderTemplate : function (header, css) {
            for (let k = 0 ; k < header.length ; k++) {
                header[k].headerCellTemplate = function (header, info) {
                    header.append(
                        $("<div>")
                            .html(info.column.caption.replace(/\n/g, "<br/>"))
                    );
                    for (let j = 0 ; j < css.length ; j++) {
                        header.parent().css(css[j].attr, css[j].value);
                    }
                }

                if (header[k].columns != null) {
                    header[k].columns = this.__mergeHeaderTemplate(header[k].columns, css);
                }
            }
            return header;
        },

    }
}

var Column = {
    config: {
        set : function (gridId, columns) {
            let instance = Grid.method.getGridInstance(gridId)
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

var Attribute = function (attr, value) {
    this.attr = attr;
    this.value = value;
}

// LISTENER
var Listener = {
    __instance : new Object(),

    getListenerInstance : function (gridId) {
        if (this.__instance[gridId] == null) {
            this.__instance[gridId] = _.cloneDeep(Listener.event);
        }
        return this.__instance[gridId];
    },

    event : {
        grid : {
            onCellClick : function (cellElement, column, columnIndex, component, data, displayValue, element, event, jQueryEvent, key, model, row, rowIndex, rowType, text, value) { },
            onCellDblClick : function (cellElement, column, columnIndex, component, data, displayValue, element, event, key, model, row, rowIndex, rowType, text, value) { },
            onContentReady : function (component, element, model) { },
            onDataErrorOccurred : function (component, element, error, model) { },
            onEditingStart : function (cancel, column, component, data, element, key, model) { },
            onFocusedCellChanged : function (cellElement, column, columnIndex, component, element, model, row, rowIndex) { },
            onFocusedCellChanging : function (cancel, cellElement, columns, component, element, event, isHighlighted, model, newColumnIndex, newRowIndex, prevColumnIndex, prevRowIndex, rows) { },
            onFocusedRowChanged : function (component, element, model, row, rowElement, rowIndex) { },
            onFocusedRowChanging : function (cancel, component, element, event, model, newRowIndex, prevRowIndex, rowElement, rows) { },
            onInitialized : function (component, element) { },
            onInitNewRow : function (component, data, element, model, promise) { },
            onKeyDown : function (component, element, event, handled, jQueryEvent, model) { },
            onRowClick : function (columns, component, data, element, event, groupIndex, handled, isExpanded, isNewRow, isSelected, jQueryEvent, key, model, rowElement, rowIndex, rowType, values) { },
            onRowDblClick : function (columns, component, data, element, event, groupIndex, isExpanded, isNewRow, isSelected, key, model, rowElement, rowIndex, rowType, values) { },
            onRowInserted : function (component, data, element, error, key, model) { },
            onRowUpdated : function (component, data, element, error, key, model) { },
            onRowUpdating : function (cancel, component, element, key, model, newData, oldData) { },
            onRowValidating : function (brokenRules, component, element, errorText, isValid, key, model, newData, oldData, promise) { },
            onSelectionChanged : function (component, currentDeselectedRowKeys, currentSelectedRowKeys, element, model, selectedRowKeys, selectedRowsData) { },
        },
    },

    this.addEventListener = function (event, callBackFunc) {
        Grid.method.getGridInstance(gridId).option(event, callBackFunc);
    }
}

// LOGGER
const LOG_LEVEL_ERROR = 1;
const LOG_LEVEL_WARN = 2;
const LOG_LEVEL_INFO = 3;
const LOG_LEVEL_DEBUG = 4;
var Logger = {

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
