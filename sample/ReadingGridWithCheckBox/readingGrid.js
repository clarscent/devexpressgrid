
var Band = function (dataField, columns) {
    this.dataField = dataField;

    if (columns !== null) {
        this.caption = dataField;
        this.columns = columns;
        this.headerCellTemplate = function (header) {
            header.append($("<div>").html(dataField.replace(/\n/g, "<br/>")));
        };
    }
}

var ColConfig = function (caption, dataField, width, dataType, arg) {
    this.caption = caption;
    this.dataField = dataField;
    this.width = width;
    this.headerCellTemplate = function (header, info) {
        header.append($("<div>").html(caption.replace(/\n/g, "<br/>")));
    };

    let dataTypeObj = Column.dataFormat(dataType, arg);
    _.merge(this, dataTypeObj);
}

var Grid = {
    config: {
        set : function (gridId, width, height, checkBox) {
            let instance = $(gridId).dxDataGrid({
                width: width,
                height: height,
                selection: {
                    mode: "multiple"
                },
                editing : {
                    texts: {
                        confirmDeleteMessage: "",
                    }
                },
                keyExpr: "__rowIndex",
                // errorRowEnabled: false,
                onSelectionChanged : function (e) {
                    e.component.refresh();
                },
                loadPanel: {
                    enabled: false,
                }

            }).dxDataGrid("instance");

            if (checkBox) {
                instance.option("selection.showCheckBoxesMode", "always");
            } else {
                instance.option("selection.showCheckBoxesMode", "none");
            }
        },

        setGridData: function (gridId, data) {
            for (let j = 0 ; j < data.length ; j++) {
                data[j].__rowIndex = j;
            }
            Grid.method.getGridInstance(gridId).option("dataSource", data);
            // console.log("data", data);
        },

        setEditMode : function (gridId, boolean) {
            let instance = Grid.method.getGridInstance(gridId);
            instance.option("onToolbarPreparing", function(e) {
                e.toolbarOptions.visible = false;
            });
            instance.option("editing", {mode:"batch", allowUpdating: boolean});
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

    dataFormat : function (dataType, precision) {
        switch (dataType) {
            case "text":
                return { alignment : "left" };
            case "number":
                return {
                    customizeText : (options) => {
                        return options.valueText.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    },
                    // format : { type: "fixedPoint", precision: precision }
                };
            case "percent":
                return { format: { type: "percent", precision: precision } }
            case "date":
                return { dataType : "date", format : "yyyy-mm-dd" };
            case "check":
                return { dataType : "boolean", alignment : "center" };
            case "code":
                return { alignment : "center" };
        }
    },

    config: {
        set : function (gridId, columns) {
            let instance = Grid.method.getGridInstance(gridId)
            instance.option("columns", []);
            instance.option("columns", columns);
            instance.repaint();
        },



        // TestMethod
        setOneColumnOptionalFields: function(gridId, attr) {
            let instance = $(gridId).dxDataGrid("instance");

            return (dataField, value) => {
                instance.columnOption(dataField, attr, value);
                // let result = Column.method.__findColumns(dataField, instance.option('columns'), {flag: 0, str: ""});
                // result.str = result.str.slice(1)
                // instance.option(result.str + "." + attr, value);
            };
        },

        // TestMethod
        __setAllColumnAttributes : function (dataFieldArr, instance, attrArr) {
            for (let i = 0 ; i < dataFieldArr.length ; i++) {
                this.__setColumnAttributes(dataFieldArr[i], instance, attrArr);
            }
        },

        // TestMethod
        __setColumnAttributes: function (dataField, instance, obj) {
            instance.columnOption(dataField, obj);
        },

        // TestMethod
        setColumnType: function (gridId, type) {
            let instance = Grid.method.getGridInstance(gridId);
            let obj = new Object();

            switch (type) {
                case "button":
                    return (dataField, icon, hint, visible, onClick) => {
                        obj = {
                            type: "buttons",
                            buttons: [
                                {
                                    icon: icon,
                                    hint: hint,
                                    visible: visible,
                                    onClick: onClick,
                                }
                            ]
                        }
                        Column.config.__setColumnAttributes(dataField, instance, obj);
                    };


                case "selectBox":
                    return (dataField, dataSource, value, display, clearing) => {
                        obj = {
                            lookup : {
                                dataSource: dataSource,
                                valueExpr: value,
                                displayExpr: display,
                                allowClearing: clearing,
                            },

                            showEditorAlways : true
                        }

                        Column.config.__setColumnAttributes(dataField, instance, obj);
                    };


                case "mask":
                    return (dataField, fromStr, toStr) => {
                        obj = {
                            customizeText : function(cellInfo) {
                                let str = cellInfo.valueText + "";
                                str = str.slice(fromStr,toStr);
                                return str + "******";
                            }
                        };

                        Column.config.__setColumnAttributes(dataField, instance, obj);
                    }

                case "image":
                    return (dataField, width) => {
                        obj = {
                            cellTemplate : function (container, options) {
                                $("<div>")
                                    .append($("<img>", { "src": options.value, "width": width }))
                                    .appendTo(container);
                            },

                            allowEditing : false
                        };

                        Column.config.__setColumnAttributes(dataField, instance, obj);
                    }

                case "textarea":
                    return (dataField) => {
                        $(gridId).dxDataGrid({
                            onEditorPreparing : function (e) {
                                if (e.dataField === dataField) {
                                    e.editorName = "dxTextArea";
                                }
                            }
                        });

                        obj = {
                            cellTemplate : function (container, options) { // 개행 가능.
                                container.append($("<div>").html(options.text.replace(/\n/g, "<br/>")));
                            },

                            editorOptions : {
                                onKeyDown: function(args){
                                    if(args.event.keyCode == 13){
                                        args.event.stopPropagation();
                                    }
                                }
                            }
                        }

                        Column.config.__setColumnAttributes(dataField, instance, obj);
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

        // TestMethod
        setComboBoxLookUp : function (gridId, dataField, dependentField) {
            let instance = $(gridId).dxDataGrid("instance");
            Column.config.__setColumnAttributes(dataField, instance, [
                {
                    attr: "editorOptions",
                    value: {
                        onValueChanged: function(data){
                            // console.log("changed");
                            // console.log("dependentField", dependentField);
                            // console.log("data", data);
                            // console.log("data.value", data.value);
                            instance.columnOption(dependentField, "lookup.dataSource", function(options) {
                                return {
                                    store: cities,
                                    filter: options.data ? ["StateID", "=", options.data.StateID] : null
                                };
                            });
                            instance.columnOption(dependentField, "lookup.valueExpr", data.value);
                            instance.columnOption(dependentField, "lookup.displayExpr", data.value);
                            // instance.columnOption(dependentField, "lookup.allowClearing", false);
                            // instance.columnOption(dataField, "value", data.value);
                        }
                    }
                }
            ]);
        },

        // TestMethod
        __setLookUp : function (dataSource, value, display, clearing) {
            return {
                attr: "lookup",
                value: {
                    dataSource: dataSource,
                    valueExpr: value,
                    displayExpr: display,
                    allowClearing: clearing,
                }
            }
        }

    },

}

var Attribute = function (attr, value) {
    this.attr = attr;
    this.value = value;
}

// var Listener = {
//     grid : {
//         onRowClick : function () { alert("default event"); }
//     },
//
//     addEventListener : function (gridId, callBackFunc) {
//         Grid.method.getGridInstance(gridId)
//     }
// }

var Listener = function (gridId) {
    this.grid = {
        onRowClick : function () { alert("default event"); }
    };

    this.addEventListener = function (event, callBackFunc) {
        Grid.method.getGridInstance(gridId).option(event, callBackFunc);
    }
}