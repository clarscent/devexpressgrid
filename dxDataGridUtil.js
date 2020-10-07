var grid = {
    config: {
        __mergeHeaderAndColumns: function (header, columns) {
            for (let k = 0 ; k < header.length ; k++ ) {
                header[k]["headerCellTemplate"] = function (header, info) { // 개행 가능.
                    header.append($("<div>").html(info.column.caption.replace(/\n/g, "<br/>")));
                }

                if (columns != null) {
                    for (let j = 0 ; j < columns.length ; j++ ) {
                        if (columns[j].dataField === header[k].dataField) {
                            delete columns[j].dataField;
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

        setGridColumns: function (gridId, header, columns) {
            header = this.__mergeHeaderAndColumns(header, columns);
            $(gridId).dxDataGrid({columns: header});
            $(gridId).dxDataGrid("instance").repaint();
        },

        setGridData: function (gridId, data) {
            $(gridId).dxDataGrid({dataSource:data});
        },

        // setEditMode : function (gridId, addMode, updateMode, deleteMode, selMode) {
        //     $(gridId).dxDataGrid({
        //         editing: {
        //             mode: "batch",
        //             allowAdding: addMode,
        //             allowUpdating: updateMode,
        //             allowDeleting: deleteMode
        //         },
        //         selection: {
        //             mode: selMode
        //         }
        //     });
        //     $(gridId).dxDataGrid("instance").repaintRows();
        // },
        //
        // setReadOnlyMode : function (gridId) {
        //     $(gridId).dxDataGrid({
        //         editing: {
        //             mode: "batch",
        //             allowAdding: false,
        //             allowUpdating: false,
        //             allowDeleting: false
        //         },
        //         selection: {
        //             mode:"none"
        //         }
        //     });
        //     $(gridId).dxDataGrid("instance").repaintRows();
        // },

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

        setOneColumnOptionalFields: function(gridId, attr) {
            let instance = $(gridId).dxDataGrid("instance");

            return (index, value) => {
                console.log("columns: ", instance.option('columns'));
                instance.option(`columns[${index}].${attr}`, value);
            };
        },


    },
}

var Header = {

}

var Column = {

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