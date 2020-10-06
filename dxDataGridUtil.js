var dxDataGrid = {
    config: {
        setGridColumns: function (gridId, columns) {
            $(gridId).dxDataGrid({columns: columns});
            $(gridId).dxDataGrid("instance").repaint();
        },

        setGridData: function (gridId, data) {
            $(gridId).dxDataGrid({dataSource:data});
        },

        setEditMode : function (gridId) {
            $(gridId).dxDataGrid({
                editing: {
                    mode: "batch",
                    allowUpdating: true,
                },
                selection: {
                    mode: "multiple"
                }
            });
            $(gridId).dxDataGrid("instance").repaintRows();
        },

        setColProperty: function (caption, dataField, ...option) {
            let obj = {
                caption: caption, // 컬럼 명
                dataField: dataField, // 컬럼에 바인딩 될 데이터 명
                headerCellTemplate: function (header, info) { // 개행 가능
                    $("<div>")
                        .html(info.column.caption.replace(/\n/g, "<br/>"))
                        .appendTo(header);
                },
            }
            for (let i = 0 ; i < option.length ; i++) {
                _.merge(obj, option[i]);
            }
            return obj
        },

        // colConfig의 Params 는 caption, dataField, [parent], ... 순으로 들어가야함.
        setColumns: function (gridId, colConfig) {
            // 각 columns 의 객체를 배열의 인덱스와 알맞게 설정한다. (0부터 시작)
            let colObjArr = new Array(colConfig.length);
            for (let i = 0 ; i < colObjArr.length ; i++) {
                let caption = colConfig[i].caption;
                let dataField = colConfig[i].dataField;
                delete colConfig[i]["caption"];
                delete colConfig[i]["dataField"];
                colObjArr[i] = this.setColProperty(caption, dataField, colConfig[i]);
            }

            // columns 의 depth 를 가진 배열을 가져와서 depth가 깊은 순대로 정렬.
            let sortedColConfig = getColumnDepth(colConfig);
            sortedColConfig.sort(function (a, b) {
                return b.depth - a.depth;
            });

            // depth가 깊은 것부터 grouping 하여 최종적으로 colArr에 배열의 정보가 들어간다.
            for (let i = 0 ; i < sortedColConfig.length ; i++) {
                let parent = sortedColConfig[i].parent;
                let index = sortedColConfig[i].index;
                if (parent != null) {
                    if (colObjArr[parent].columns == null) {
                        colObjArr[parent].columns = [];
                    }
                    colObjArr[parent].columns.push(colObjArr[index]);
                } else {
                    colArr.push(colObjArr[index]);
                }
            }

            this.setGridColumns(gridId, colArr);
        },


    },

    method: { },

    event: { },

    row : { },
}

function getColumnDepth (colConfig) {
   for (let i = 0 ; i < colConfig.length ; i ++) {
       let parent = colConfig[i].parent;
       if (parent != null) {
           if ( colConfig[parent].depth != null) {
               colConfig[i].depth = colConfig[parent].depth + 1;
           }
       } else {
           colConfig[i].depth = 0;
       }
   }
   return colConfig;
}
