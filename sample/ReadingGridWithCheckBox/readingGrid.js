var Grid = {
    config: {
        setGrid : function (gridId, width, height, checkBox) {
            let instance = $(gridId).dxDataGrid({
                width: width,
                height: height,
                selection: {
                    mode: "multiple"
                },
                // editing : {
                //     mode: "batch",
                //     allowAdding: true,
                //     allowUpdating: true,
                // }
            }).dxDataGrid("instance");

            if (checkBox) {
                instance.option("selection.showCheckBoxesMode", "always");
            } else {
                instance.option("selection.showCheckBoxesMode", "none");
            }
        },

        setColumns : function (gridId, columns) {
            let instance = Grid.method.getGridInstance(gridId)
            instance.option("columns", []);
            instance.option("columns", columns);
            instance.repaint();
        },

        // columns grouping 할 때
        setHeaders : function (gridId, columns, headers) {
            for ( let j = 0 ; j < headers.length ; j++) {
                headers[j] = this.__mergeHeaderAndColumn(headers[j], columns);

                if (headers[j].columns !== null) {
                    this.setHeaders(gridId, columns, headers[j]);
                }
            }

            this.setColumns(gridId, headers);
        },

        __mergeHeaderAndColumn : function (header, columns) {
            if (header.dataField == null) {
                return header;
            }
            for (let k = 0 ; k < columns.length ; k++) {
                if (header.dataField === columns[k].dataField) {
                    _.merge(header, columns[k]);
                    return header;
                }
            }
        },

        setGridData: function (gridId, data, key) {
            Grid.method.getGridInstance(gridId).option("dataSource", data);
            Grid.method.getGridInstance(gridId).option("keyExpr", key);
            // $(gridId).dxDataGrid({dataSource:data});
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
            let gridItems = Grid.method.getGridInstance(gridId)._controllers.data._dataSource._items;
            console.log("gridItems", gridItems);
        },

        getCheckedData : function (gridId) {
            let selectedRowsData = Grid.method.getGridInstance(gridId).getSelectedRowsData();
            console.log("selectedRowsData", selectedRowsData);
        },

        addRow : function (gridId, data) {
            // let instance = Grid.method.getGridInstance(gridId);
            // instance.on("initNewRow", e => {
            //     e.data = data;
            // });
            // instance.addRow();
            // instance.saveEditData();
            // instance.repaint();


            var dataSource = Grid.method.getGridInstance(gridId).getDataSource();
            dataSource.store().insert(data).then(function() {
                dataSource.reload();
            });
        }
    }
}

var Header = {
    config: {
        set : function (name, columns) {
            if (columns != null) {
                return { caption : name, columns: columns };
            } else {
                return { dataField : name };
            }
        },

        setHeaderCss : function (gridId, css) {
            let columns = Grid.method.getGridInstance(gridId).option("columns");
            columns = Header.method.__mergeHeaderTemplate(columns, css);
            Grid.config.setColumns(gridId, columns);
        },

        setHeaders : function (gridId, header, css) {
            if (css == null) {
                css = new Array()
            }
            header = Header.method.__mergeHeaderTemplate(header, css);
            $(gridId).dxDataGrid({columns: header});
            Grid.config.setEditMode(gridId, false, false, true, "multiple");
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
        dataFormat : {
            Text : function () {
                return { alignment : "left" };
            },

            Number : function (precision) {
                let obj = {
                    customizeText : (options) => {
                        return this.__setThousandUnitComma(options.valueText);
                    }
                }

                if (precision != null) {
                    obj = { format : { type: "fixedPoint", precision: precision } }
                }

                return obj;
            },

            Percent : function (precision) {
                return { format: { type: "percent", precision: precision } };
            },

            Date : function () {
                return { dataType : "date", format : "yyyy-mm-dd" };
            },

            Check : function () {
                return { dataType : "boolean", alignment : "center" }
            },

            Code : function () {
                return { alignment : "center" };
            },

            __setThousandUnitComma : (str) => {
                return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

        },

        set : function (caption, dataField, width, dataType, arg) {
            let obj = {
                caption : caption,
                dataField : dataField,
                width : width,
                headerCellTemplate : function (header, info) {
                    header.append($("<div>").html(caption.replace(/\n/g, "<br/>")));
                },
            }
            let dataTypeObj = new Object();
            switch (dataType) {
                case "text":
                    dataTypeObj = Column.config.dataFormat.Text(arg);
                    break;
                case "number":
                    dataTypeObj = Column.config.dataFormat.Number(arg);
                    break;
                case "percent":
                    dataTypeObj = Column.config.dataFormat.Percent(arg);
                    break;
                case "date":
                    dataTypeObj = Column.config.dataFormat.Date(arg);
                    break;
                case "check":
                    dataTypeObj = Column.config.dataFormat.Check(arg);
                    break;
                case "code":
                    dataTypeObj = Column.config.dataFormat.Code(arg);
                    break;
            }
            _.merge(obj, dataTypeObj);

            // console.log("this", this);
            return obj;
        },

        setColumns : function (gridId, columns) {

            // if (columns != null) {
            //     for (let k = 0 ; k < columns.length ; k++) {
            //         let obj = this.setDataType(columns[k].dataType);
            //         console.log("obj", obj);
            //         this.__setColumnAttributes(columns[k].dataField, Grid.method.getGridInstance(gridId), obj)
            //     }
            // }
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
                            type: "percent",
                            // precision: 2
                        },
                        customizeText: (options) => {
                            return options.valueText.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
