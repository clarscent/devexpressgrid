var Grid = {
    config: {
        setGrid : function (gridId, header, column, headerCss) {
            Header.config.setHeaders(gridId, header, headerCss);
            Column.config.setColumns(gridId, column);
        },

        setGridData: function (gridId, data) {
            $(gridId).dxDataGrid({dataSource:data});
        },

        setEditMode : function (gridId, addMode, updateMode, deleteMode, selMode) {
            $(gridId).dxDataGrid({
                editing: {
                    mode: "batch",
                    allowAdding: addMode,
                    allowUpdating: updateMode,
                    allowDeleting: deleteMode
                },

                selection: {
                    mode: selMode
                },

            });
        },

    },

    method: {
        getGridInstance : function (gridId) {
            return $(gridId).dxDataGrid('instance');
        },

        getGridData : function (gridId) {
            let gridItems = $(gridId).dxDataGrid('instance')._controllers.data._dataSource._items;
            console.log("gridItems", gridItems);
        },

        getCheckedData : function (gridId) {
            let selectedRowsData = $(gridId).dxDataGrid("instance").getSelectedRowsData();
            console.log("selectedRowsData", selectedRowsData);
        },

        addRow : function (gridId, data) {
            var dataSource = $(gridId).dxDataGrid("instance").getDataSource();
            dataSource.store().insert(data).then(function() {
                dataSource.reload();
            });
        }
    }
}

var Header = {
    config: {
        setHeaders : function (gridId, header, css) {
            if (css == null) {
                css = new Array()
            }
            header = Header.method.__mergeHeaderTemplate(header, css);
            $(gridId).dxDataGrid({columns: header});
            Grid.config.setEditMode(gridId, true, true, true, "multiple");
        }
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

        set : function (dataField, width, dataType) {
            this.dataField = dataField;
            this.width = width;
            this.dataType = dataType;
        },

        setColumns : function (gridId, columns) {
            for (let k = 0 ; k < columns.length ; k++) {
                let obj = this.setDataType(columns[k].dataType);
                console.log("obj", obj);
                this.__setColumnAttributes(columns[k].dataField, Grid.method.getGridInstance(gridId), obj)
            }
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

        __setAllColumnAttributes : function (dataFieldArr, instance, attrArr) {
            for (let i = 0 ; i < dataFieldArr.length ; i++) {
                this.__setColumnAttributes(dataFieldArr[i], instance, attrArr);
            }
        },

        __setColumnAttributes: function (dataField, instance, obj) {
            instance.columnOption(dataField, obj);
        },

        setDataType : function (type) {
            let obj = new Object();
            switch (type) {
                case "number":
                    obj = {
                        alignment : "right",
                        format : {
                                type: "fixedPoint",
                                precision: 0
                        }
                    }
                    break;

                case "text":
                    obj = { alignment : "left" }
                    break;

                case "code":
                    obj = { alignment : "center" }
                    break;

                case "check":
                    obj = {
                        dataType : "boolean",
                        alignment : "center"
                    }
                    break;

                case "date":
                    obj = {
                        dataType : "date",
                        format : "yyyy-mm-dd"
                    }
                    break;
            }
            return obj;
        },

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

    }

}

var Attribute = function (attr, value) {
    return {attr: attr, value: value};
}
