
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
                onSelectionChanged : function (e) {
                    e.component.refresh();
                },

            }).dxDataGrid("instance");

            // __rowKey 초기셋팅
            instance["__rowKey"] = 0;

            // checkBox
            if (checkBox) {
                instance.option("selection.showCheckBoxesMode", "always");
            } else {
                instance.option("selection.showCheckBoxesMode", "none");
            }

            // EventListener 연결
            Grid.method.__addEventListener(gridId);

        },

        setGridData: function (gridId, data) {
            let instance = Grid.method.getGridInstance(gridId);

            for (let j = 0 ; j < data.length ; j++) {
                data[j].__rowKey = instance.__rowKey++;
            }

            instance.option("dataSource", data);
            instance.option("focusedRowEnabled", true);

        },

        setEditMode : function (gridId, boolean) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.option("onToolbarPreparing", function(e) {
                e.toolbarOptions.visible = false;
            });
            instance.option("editing", {mode:"batch", allowUpdating: boolean});
            this.setSorting(gridId, "none");
        },

        /**
         * @param gridId
         * @param sorting - "none"      - 정렬 안 함
         *                  "single"    - 하나의 컬럼으로만 정렬 가능
         *                  "multiple"  - 여러 개의 컬럼으로 정렬 가능
         */
        setSorting : function (gridId, sorting) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.option("sorting", { mode : sorting, });
        },

    },

    method: {
        getGridInstance : function (gridId) {
            return $(gridId).dxDataGrid('instance');
        },

        getGridData : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            return instance._controllers.data._dataSource._items;
        },

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

        addRow : function (gridId, data, index) {
            let instance = Grid.method.getGridInstance(gridId);
            let dataSource = Grid.method.getGridInstance(gridId).getDataSource();
            let arr = dataSource.store()._array;

            instance.deselectAll();
            data.__rowKey = instance.__rowKey++;

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

            instance.refresh();
        },

        deleteRow : function (gridId) {
            let instance = Grid.method.getGridInstance(gridId);
            let checkedData = instance.getSelectedRowKeys();

            for (let j = 0 ; j < rowKeys.length ; j++) {
                let rowIndex = instance.getRowIndexByKey(rowKeys[j]);
                instance.deleteRow(rowIndex);
                instance.refresh();
            }
            instance.deselectAll();
        },
//
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

const Column = {
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

const Attribute = function (attr, value) {
    this.attr = attr;
    this.value = value;
}

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
