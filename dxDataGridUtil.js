var Grid = {
    config: {

        setGridColumns: function (gridId, header, columns) {
            header = Header.method.__mergeHeaderAndColumns(header, columns);
            $(gridId).dxDataGrid({columns: header});
            $(gridId).dxDataGrid("instance").repaint();
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
                }
            });
            // $(gridId).dxDataGrid("instance").repaintRows();
        },


        // __setColProperty: function (caption, dataField, ...option) {
        //     let obj = {
        //         caption: caption, // 컬럼 명
        //         dataField: dataField, // 컬럼에 바인딩 될 데이터 명
        //         headerCellTemplate: function (header, info) { // 개행 가능
        //             header.append($("<div>").html(info.column.caption));
        //         },
        //     }
        //     for (let i = 0 ; i < option.length ; i++) {
        //         _.merge(obj, option[i]);
        //     }
        //     return obj
        // },

        // colConfig의 Params 는 caption, dataField, [parent], ... 순으로 들어가야함.
        // setColumns: function (gridId, colConfig) {
        //     // 각 columns 의 객체를 배열의 인덱스와 알맞게 설정한다. (0부터 시작)
        //     // let colObjArr = new Array(colConfig.length);
        //     // for (let i = 0 ; i < colObjArr.length ; i++) {
        //     //     let caption = colConfig[i].caption;
        //     //     let dataField = colConfig[i].dataField;
        //     //     delete colConfig[i]["caption"];
        //     //     delete colConfig[i]["dataField"];
        //     //     colObjArr[i] = this.setColProperty(caption, dataField, colConfig[i]);
        //     // }
        //
        //     for (let i = 0 ; i < colConfig.length ; i++) {
        //         colConfig[i]["headerCellTemplate"] = function (header, info) { // 개행 가능
        //             header.append($("<div>").html(info.column.caption));
        //         }
        //     }
        //
        //     // columns 의 depth 를 가진 배열을 가져와서 depth가 깊은 순대로 정렬.
        //     let sortedColConfig = getColumnDepth(colConfig);
        //     sortedColConfig.sort(function (a, b) {
        //         return b.depth - a.depth;
        //     });
        //
        //     // depth가 깊은 것부터 grouping 하여 최종적으로 colArr에 배열의 정보가 들어간다.
        //     for (let i = 0 ; i < sortedColConfig.length ; i++) {
        //         let parent = sortedColConfig[i].parent;
        //         let index = sortedColConfig[i].index;
        //         if (parent != null) {
        //             if (colObjArr[parent].columns == null) {
        //                 colObjArr[parent].columns = [];
        //             }
        //             colObjArr[parent].columns.push(colObjArr[index]);
        //         } else {
        //             colArr.push(colObjArr[index]);
        //         }
        //     }
        //
        //     this.setGridColumns(gridId, colArr);
        // },




    },
}

var Header = {
    config: {

    },

    method: {
        __mergeHeaderAndColumns: function (header, columns) {
            for (let k = 0 ; k < header.length ; k++ ) {
                header[k]["headerCellTemplate"] = function (header, info) { // 개행 가능.
                    header.append($("<div>").html(info.column.caption.replace(/\n/g, "<br/>")));
                }

                if (columns != null) {
                    for (let j = 0 ; j < columns.length ; j++ ) {
                        if (columns[j].dataField === header[k].dataField) {
                            _.merge(header[k], columns[j]);
                            break;
                        }
                    }
                }

                if (header[k]["columns"] != null) {
                    header[k]["columns"] = this.__mergeHeaderAndColumns(header[k]["columns"], columns);
                }
            }

            return header;
        },

    }
}


var Column = {
    config: {
        set: function (dataField, width, alignment, maxLength, option) {
            this.dataField = dataField;
            this.width = width;
            this.alignment = alignment;
            this.editorOptions = {"maxLength": maxLength};
            _.merge(this, option);
        },

        setOneColumnOptionalFields: function(gridId, attr) {
            let instance = $(gridId).dxDataGrid("instance");

            return (dataField, value) => {
                instance.columnOption(dataField, attr, value);
                // let result = Column.method.__findColumns(dataField, instance.option('columns'), {flag: 0, str: ""});
                // result.str = result.str.slice(1)
                // instance.option(result.str + "." + attr, value);
            };
        },

        __setColumnAttributes: function (dataField, instance, arr) {
            for (let k = 0 ; k < arr.length ; k++) {
                instance.columnOption(dataField, arr[k].attr, arr[k].value);
            }

            // let result = Column.method.__findColumns(dataField, instance.option('columns'), {flag: 0, str: ""});
            // result.str = result.str.slice(1)
            // for (let k = 0 ; k < arr.length ; k++) {
            //     instance.option(result.str + "." + arr[k].attr, arr[k].value);
            // }

            // console.log("instance.option(result.str)", instance.option(result.str));
        },

        setColumnType: function (gridId, type) {
            let instance = $(gridId).dxDataGrid("instance");
            let attrArr = new Array();

            switch (type) {
                case "button":
                    attrArr = [
                        {attr: "type", value: "buttons"},
                        {
                            attr: "buttons",
                            value: [{
                                icon: "edit",
                                visible: true,
                            }]
                        },
                    ];
                    break;

                case "checkBox":
                    attrArr = [
                        {attr: "dataType", value: "boolean"}
                    ];
                    break;

                case "comboBox":
                    return (dataField, dataSource, value, display, clearing) => {
                        this.__setColumnAttributes(dataField, instance, [
                            {
                                attr: "lookup",
                                value: {
                                    dataSource: dataSource,
                                    valueExpr: value,
                                    displayExpr: display,
                                    allowClearing: clearing,
                                }
                            },
                        ]);
                    };

                case "date":
                    attrArr = [
                        {attr: "dataType", value: "date"}
                    ];
                    break;

                case "mask":
                    attrArr = [
                        {
                            attr: "customizeText",
                            value: function(cellInfo) {
                                return "******";
                            }
                        }
                    ];
                    break;

                case "image":
                    attrArr = [
                        {
                            attr: "cellTemplate",
                            value: function (container, options) {
                                $("<div>")
                                    .append($("<img>", { "src": options.value, "width": "100" }))
                                    .appendTo(container);
                            }
                        },
                    ];
                    break;

                case "textarea":
                    attrArr = [
                        {
                            attr: "cellTemplate",
                            value: function (container, options) { // 개행 가능.
                                container.append($("<div>").html(options.text.replace(/\n/g, "<br/>")));
                            }
                        },
                        {
                            attr: "editorOptions",
                            value: {
                                onKeyDown: function(args){
                                    if(args.event.keyCode == 13){
                                        args.event.stopPropagation();
                                    }
                                }
                            }
                        },
                    ];
                    break;
            }

            return (dataField) => {
                if (type === "textarea") {
                    $(gridId).dxDataGrid({
                        onEditorPreparing : function (e) {
                            if (e.dataField === dataField) {
                                e.editorName = "dxTextArea";
                            }
                        }
                    });
                }
                this.__setColumnAttributes(dataField, instance, attrArr);
            };

        },

    },

    method: {
        // __findColumns: function (dataField, columns, result) {
        //     for (let k = 0 ; k < columns.length ; k++) {
        //         if (columns[k].dataField === dataField) {
        //             result.flag = 1;
        //             result.str += ".columns["+ k +"]"
        //             return result;
        //         }
        //         if (columns[k].columns != null) {
        //             result.str += ".columns["+ k +"]"
        //             result = this.__findColumns(dataField, columns[k].columns, result);
        //             if (result.flag == 1) {
        //                 return result;
        //             } else {
        //                 result.str = "";
        //             }
        //         }
        //     }
        //     return result;
        // },



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

// function getColumnDepth (colConfig) {
//    for (let i = 0 ; i < colConfig.length ; i ++) {
//        let parent = colConfig[i].parent;
//        if (parent != null) {
//            if ( colConfig[parent].depth != null) {
//                colConfig[i].depth = colConfig[parent].depth + 1;
//            }
//        } else {
//            colConfig[i].depth = 0;
//        }
//    }
//    return colConfig;
// }
//
// function getHeaderDepth (header) {
//     for (let i = 0 ; i < header.length ; i ++) {
//         header[i].depth = 0;
//         if (header[i].child != null) {
//             for (let k = 0 ; k < header[i].child.length ; k++) {
//
//             }
//         }
//     }
//     return colConfig;
// }
//
// function getChildDepth(child) {
//     for (let k = 0 ; k < child.length ; k++) {
//
//     }
// }