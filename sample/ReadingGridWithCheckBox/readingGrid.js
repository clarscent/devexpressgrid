
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
                editing : {
                    texts: { confirmDeleteMessage: "", }
                },
                loadPanel: { enabled: false, },
                paging : { enabled: false, pageSize: 0 },
                showBorders: true,
                scrolling: { mode: "Virtual" },
                focusedRowEnabled: true,

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

        setGridData: function (gridId, data) {
            let instance = Grid.method.getGridInstance(gridId);

            for (let j = 0 ; j < data.length ; j++) {
                data[j].__rowKey = Grid.method.getKeyString();
            }

            if (!(data instanceof Array)) {
                data = [data];
            }

            instance.option("dataSource", []);
            instance.option("dataSource", data);
            instance.option("focusedRowEnabled", true);
            instance.option("focusedRowKey", false);
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
        }

    },

    method: {
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

            instance.option("onCellClick", function (cellElement, column, columnIndex, component, data, displayValue, element, event, jQueryEvent, key, model, row, rowIndex, rowType, text, value) {
                let paramObj = {gridId: gridId, cellElement:cellElement, column:column, columnIndex:columnIndex, component:component, data:data, displayValue:displayValue, element:element, event:event, jQueryEvent:jQueryEvent, key:key, model:model, row:row, rowIndex:rowIndex, rowType:rowType, text:text, value:value,};
                Grid.method.__executeListener("onCellClick", paramObj, gridId, cellElement, column, columnIndex, component, data, displayValue, element, event, jQueryEvent, key, model, row, rowIndex, rowType, text, value);
            });
            instance.option("onCellDblClick", function(cellElement, column, columnIndex, component, data, displayValue, element, event, key, model, row, rowIndex, rowType, text, value) {
                let paramObj = {gridId: gridId, cellElement:cellElement, column:column, columnIndex:columnIndex, component:component, data:data, displayValue:displayValue, element:element, event:event, key:key, model:model, row:row, rowIndex:rowIndex, rowType:rowType, text:text, value:value,};
                Grid.method.__executeListener("onCellDblClick", paramObj, gridId, cellElement, column, columnIndex, component, data, displayValue, element, event, key, model, row, rowIndex, rowType, text, value);
            });
            instance.option("onContentReady", function(component, element, model) {
                let paramObj = {gridId: gridId, component:component, element:element, model:model,};
                Grid.method.__executeListener("onContentReady", paramObj, gridId, component, element, model);
            });
            instance.option("onDataErrorOccurred", function(component, element, error, model) {
                let paramObj = {gridId: gridId, component:component, element:element, error:error, model:model,};
                Grid.method.__executeListener("onDataErrorOccurred", paramObj, gridId, component, element, error, model);
            });
            instance.option("onEditingStart", function(cancel, column, component, data, element, key, model) {
                let paramObj = {gridId: gridId, cancel:cancel, column:column, component:component, data:data, element:element, key:key, model:model,};
                Grid.method.__executeListener("onEditingStart", paramObj, gridId, cancel, column, component, data, element, key, model);
            });
            instance.option("onFocusedCellChanged", function(cellElement, column, columnIndex, component, element, model, row, rowIndex) {
                let paramObj = {gridId: gridId, cellElement:cellElement, column:column, columnIndex:columnIndex, component:component, element:element, model:model, row:row, rowIndex:rowIndex,};
                Grid.method.__executeListener("onFocusedCellChanged", paramObj, gridId, cellElement, column, columnIndex, component, element, model, row, rowIndex);
            });
            instance.option("onFocusedCellChanging", function(cancel, cellElement, columns, component, element, event, isHighlighted, model, newColumnIndex, newRowIndex, prevColumnIndex, prevRowIndex, rows) {
                let paramObj = {gridId: gridId, cancel:cancel, cellElement:cellElement, columns:columns, component:component, element:element, event:event, isHighlighted:isHighlighted, model:model, newColumnIndex:newColumnIndex, newRowIndex:newRowIndex, prevColumnIndex:prevColumnIndex, prevRowIndex:prevRowIndex, rows:rows,};
                Grid.method.__executeListener("onFocusedCellChanging", paramObj, gridId, cancel, cellElement, columns, component, element, event, isHighlighted, model, newColumnIndex, newRowIndex, prevColumnIndex, prevRowIndex, rows);
            });
            instance.option("onFocusedRowChanged", function(component, element, model, row, rowElement, rowIndex) {
                let paramObj = {gridId: gridId, component:component, element:element, model:model, row:row, rowElement:rowElement, rowIndex:rowIndex,};
                Grid.method.__executeListener("onFocusedRowChanged", paramObj, gridId, component, element, model, row, rowElement, rowIndex);
            });
            instance.option("onFocusedRowChanging", function(cancel, component, element, event, model, newRowIndex, prevRowIndex, rowElement, rows) {
                let paramObj = {gridId: gridId, cancel:cancel, component:component, element:element, event:event, model:model, newRowIndex:newRowIndex, prevRowIndex:prevRowIndex, rowElement:rowElement, rows:rows,};
                Grid.method.__executeListener("onFocusedRowChanging", paramObj, gridId, cancel, component, element, event, model, newRowIndex, prevRowIndex, rowElement, rows);
            });
            instance.option("onInitialized", function(component, element) {
                let paramObj = {gridId: gridId, component:component, element:element,};
                Grid.method.__executeListener("onInitialized", paramObj, gridId, component, element);
            });
            instance.option("onInitNewRow", function(component, data, element, model, promise) {
                let paramObj = {gridId: gridId, component:component, data:data, element:element, model:model, promise:promise,};
                Grid.method.__executeListener("onInitNewRow", paramObj, gridId, component, data, element, model, promise);
            });
            instance.option("onKeyDown", function(component, element, event, handled, jQueryEvent, model) {
                let paramObj = {gridId: gridId, component:component, element:element, event:event, handled:handled, jQueryEvent:jQueryEvent, model:model,};
                Grid.method.__executeListener("onKeyDown", paramObj, gridId, component, element, event, handled, jQueryEvent, model);
            });
            instance.option("onRowClick", function(columns, component, data, element, event, groupIndex, handled, isExpanded, isNewRow, isSelected, jQueryEvent, key, model, rowElement, rowIndex, rowType, values) {
                let paramObj = {gridId: gridId, columns:columns, component:component, data:data, element:element, event:event, groupIndex:groupIndex, handled:handled, isExpanded:isExpanded, isNewRow:isNewRow, isSelected:isSelected, jQueryEvent:jQueryEvent, key:key, model:model, rowElement:rowElement, rowIndex:rowIndex, rowType:rowType, values:values,};
                Grid.method.__executeListener("onRowClick", paramObj, gridId, columns, component, data, element, event, groupIndex, handled, isExpanded, isNewRow, isSelected, jQueryEvent, key, model, rowElement, rowIndex, rowType, values);
            });
            instance.option("onRowDblClick", function(columns, component, data, element, event, groupIndex, isExpanded, isNewRow, isSelected, key, model, rowElement, rowIndex, rowType, values) {
                let paramObj = {gridId: gridId, columns:columns, component:component, data:data, element:element, event:event, groupIndex:groupIndex, isExpanded:isExpanded, isNewRow:isNewRow, isSelected:isSelected, key:key, model:model, rowElement:rowElement, rowIndex:rowIndex, rowType:rowType, values:values,};
                Grid.method.__executeListener("onRowDblClick", paramObj, gridId, columns, component, data, element, event, groupIndex, isExpanded, isNewRow, isSelected, key, model, rowElement, rowIndex, rowType, values);
            });
            instance.option("onRowInserted", function(component, data, element, error, key, model) {
                let paramObj = {gridId: gridId, component:component, data:data, element:element, error:error, key:key, model:model,};
                Grid.method.__executeListener("onRowInserted", paramObj, gridId, component, data, element, error, key, model);
            });
            instance.option("onRowUpdated", function(component, data, element, error, key, model) {
                let paramObj = {gridId: gridId, component:component, data:data, element:element, error:error, key:key, model:model,};
                Grid.method.__executeListener("onRowUpdated", paramObj, gridId, component, data, element, error, key, model);
            });
            instance.option("onRowUpdating", function(cancel, component, element, key, model, newData, oldData) {
                let paramObj = {gridId: gridId, cancel:cancel, component:component, element:element, key:key, model:model, newData:newData, oldData:oldData,};
                Grid.method.__executeListener("onRowUpdating", paramObj, gridId, cancel, component, element, key, model, newData, oldData);
            });
            instance.option("onRowValidating", function(brokenRules, component, element, errorText, isValid, key, model, newData, oldData, promise) {
                let paramObj = {gridId: gridId, brokenRules:brokenRules, component:component, element:element, errorText:errorText, isValid:isValid, key:key, model:model, newData:newData, oldData:oldData, promise:promise,};
                Grid.method.__executeListener("onRowValidating", paramObj, gridId, brokenRules, component, element, errorText, isValid, key, model, newData, oldData, promise);
            });
            instance.option("onSelectionChanged", function(component, currentDeselectedRowKeys, currentSelectedRowKeys, element, model, selectedRowKeys, selectedRowsData) {
                let paramObj = {gridId: gridId, component:component, currentDeselectedRowKeys:currentDeselectedRowKeys, currentSelectedRowKeys:currentSelectedRowKeys, element:element, model:model, selectedRowKeys:selectedRowKeys, selectedRowsData:selectedRowsData,};
                Grid.method.__executeListener("onSelectionChanged", paramObj, gridId, component, currentDeselectedRowKeys, currentSelectedRowKeys, element, model, selectedRowKeys, selectedRowsData);
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
        onCellClick : function (gridId, cellElement, column, columnIndex, component, data, displayValue, element, event, jQueryEvent, key, model, row, rowIndex, rowType, text, value) { },
        onCellDblClick : function (gridId, cellElement, column, columnIndex, component, data, displayValue, element, event, key, model, row, rowIndex, rowType, text, value) { },
        onContentReady : function (gridId, component, element, model) { },
        onDataErrorOccurred : function (gridId, component, element, error, model) { },
        onEditingStart : function (gridId, cancel, column, component, data, element, key, model) { },
        onFocusedCellChanged : function (gridId, cellElement, column, columnIndex, component, element, model, row, rowIndex) { },
        onFocusedCellChanging : function (gridId, cancel, cellElement, columns, component, element, event, isHighlighted, model, newColumnIndex, newRowIndex, prevColumnIndex, prevRowIndex, rows) { },
        onFocusedRowChanged : function (gridId, component, element, model, row, rowElement, rowIndex) { },
        onFocusedRowChanging : function (gridId, cancel, component, element, event, model, newRowIndex, prevRowIndex, rowElement, rows) { },
        onInitialized : function (gridId, component, element) { },
        onInitNewRow : function (gridId, component, data, element, model, promise) { },
        onKeyDown : function (gridId, component, element, event, handled, jQueryEvent, model) { },
        onRowClick : function (gridId, columns, component, data, element, event, groupIndex, handled, isExpanded, isNewRow, isSelected, jQueryEvent, key, model, rowElement, rowIndex, rowType, values) { },
        onRowDblClick : function (gridId, columns, component, data, element, event, groupIndex, isExpanded, isNewRow, isSelected, key, model, rowElement, rowIndex, rowType, values) { },
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
