let gridType = {

    setGridColumns: function (gridId, columns) {
        $("#" + gridId).dxDataGrid({columns: columns});
        $("#" + gridId).dxDataGrid("instance").repaint();
    },

    setGridData: function (gridId, data) {
        $("#" + gridId).dxDataGrid({dataSource:data});
    },

    setEditMode : function (gridId) {
        $("#" + gridId).dxDataGrid({
            editing: {
                mode: "batch",
                allowUpdating: true,
            },
            selection: {
                mode: "multiple"
            }
        });
        $("#" + gridId).dxDataGrid("instance").repaintRows();
    },


}

let gridColumn = {
    setColProperty: function (caption, dataField, ...option) {
        let obj = {
            caption: caption, // 컬럼 명
            dataField: dataField, // 컬럼에 바인딩 될 데이터 명
        }
        for (let i = 0 ; i < option.length ; i++) {
            _.merge(obj, option[i]);
        }
        return obj
    },
}
